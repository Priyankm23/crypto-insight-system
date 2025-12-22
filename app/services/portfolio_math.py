import numpy as np
import pandas as pd
import sqlite3
from concurrent.futures import ThreadPoolExecutor, as_completed
import matplotlib.pyplot as plt

def cap_weights(weights, cap=0.5):
    capped = {s: min(w, cap) for s, w in weights.items()}
    total_capped = sum(capped.values())
    excess = 1 - total_capped
    if abs(excess) < 1e-9:
        return {s: round(capped[s], 6) for s in capped}
    uncapped_assets = [s for s in weights if weights[s] < cap]
    if not uncapped_assets:
        return {s: round(capped[s] / total_capped, 6) for s in capped}
    uncapped_total = sum(weights[s] for s in uncapped_assets)
    for s in uncapped_assets:
        add = (weights[s] / uncapped_total) * excess
        capped[s] += add
        if capped[s] > cap:
            capped[s] = cap
    total_final = sum(capped.values())
    return {s: round(capped[s] / total_final, 6) for s in capped}

def equal_weight(symbols):
    w = 1 / len(symbols)
    weights = {s: round(w, 6) for s in symbols}
    return cap_weights(weights)

def price_weight(symbols, prices):
    prices = {s: float(prices[s]) for s in symbols}
    total = sum(prices.values())
    weights = {s: prices[s] / total for s in symbols}
    return cap_weights(weights)

def inverse_volatility(symbols, returns):
    vols = {s: float(np.std(returns[s])) for s in symbols}
    inv = {s: 1 / vols[s] if vols[s] > 0 else 0 for s in symbols}
    total = sum(inv.values())
    weights = {s: inv[s] / total for s in symbols}
    return cap_weights(weights)

def percent_change(prices):
    changes = []
    for i in range(1, len(prices)):
        change = ((prices[i] - prices[i - 1]) / prices[i - 1]) * 100
        changes.append(round(change, 6))
    return changes

def portfolio_return(weights, returns):
    min_len = min(len(r) for r in returns.values())
    port = []
    for i in range(min_len):
        r = sum(weights[s] * returns[s][i] for s in weights)
        port.append(round(r, 2))
    return port

def portfolio_risk(port):
    return round(np.std(port), 2)

def fetch_prices_from_request(uploaded_data):
    data = {}
    for crypto in uploaded_data:
        df = pd.DataFrame(crypto['data'])
        df.columns = [col.strip().lower() for col in df.columns]
        if 'close' in df.columns and 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'], errors='coerce')
            df = df.dropna(subset=['date', 'close'])
            df.set_index("date", inplace=True)
            data[crypto['symbol'].upper()] = df["close"]
    if not data:
        return pd.DataFrame()
    prices_df = pd.concat(data, axis=1).dropna(how="any")
    return prices_df

def run_and_plot_strategy(selected_rule="Equal", processed_data=None, user_id=None):
    prices_df = fetch_prices_from_request(processed_data)
    if prices_df.empty:
        raise ValueError("No price data available")

    returns = {col: percent_change(prices_df[col].tolist()) for col in prices_df.columns}
    prices = {col: prices_df[col].iloc[0] for col in prices_df.columns}
    symbols = list(returns.keys())

    rules = {
        "Equal": equal_weight,
        "Price": price_weight,
        "InvVol": inverse_volatility,
    }

    if selected_rule not in rules:
        raise ValueError(f"Unknown rule: {selected_rule}")

    if selected_rule == "Equal":
        w = rules[selected_rule](symbols)
    elif selected_rule == "Price":
        w = rules[selected_rule](symbols, prices)
    elif selected_rule == "InvVol":
        w = rules[selected_rule](symbols, returns)
    else:
        raise ValueError(f"Unknown rule: {selected_rule}")
        
    port_ret = portfolio_return(w, returns)

    n = min(15, len(port_ret))
    comparison_df = pd.DataFrame({f"{s}_Return": returns[s][:n] for s in symbols})
    comparison_df[f"{selected_rule}_Portfolio"] = port_ret[:n]

    insights = ""
    for col in comparison_df.columns:
        avg_ret = np.mean(comparison_df[col])
        risk = np.std(comparison_df[col])
        insights += f"{col} -> Avg Return={avg_ret:.2f}%, Risk={risk:.2f}\n"

    plt.figure(figsize=(10, 6))
    for col in comparison_df.columns:
        plt.plot(comparison_df.index, comparison_df[col], label=col)
    plt.legend()
    plt.title("Portfolio Analysis (Last 15 days)")
    plt.xlabel("Days")
    plt.ylabel("Returns (%)")
    plot_path = f"C:\\Users\\priya\\web dev\\crypto_investment_manager_backend\\data\\portfolio_analysis_{user_id}.png"
    plt.savefig(plot_path)
    plt.close()

    return comparison_df.to_dict(), insights, w, plot_path

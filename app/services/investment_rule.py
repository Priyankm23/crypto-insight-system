import pandas as pd
import numpy as np
import sqlite3
from datetime import datetime
import warnings

warnings.filterwarnings("ignore", category=RuntimeWarning)

def combine_uploaded_data(uploaded_data):
    if not uploaded_data:
        raise ValueError("Uploaded data is empty. Cannot run strategy.")

    all_dfs = []
    
    def identify_price_column(df):
        if 'close' in df.columns:
            return 'close'
        other_cols = [c for c in df.columns if c.lower() not in ['date', 'volume', 'adj close']]
        if other_cols:
            return other_cols[-1]
        raise ValueError("Uploaded DataFrame must contain a 'date' or date-like column and a 'close' or price-like column.")


    for crypto in uploaded_data:
        df = pd.DataFrame(crypto.data)
        df.columns = [col.lower() for col in df.columns]
        
        if 'date' not in df.columns:
            date_col = next((c for c in df.columns if 'date' in c.lower() or 'time' in c.lower()), None)
            if date_col:
                df = df.rename(columns={date_col: "date"})
            else:
                raise ValueError(f"DataFrame for {crypto.symbol} must contain a 'date' or date-like column.")

        price_col = identify_price_column(df)

        df = df.rename(columns={price_col: crypto.symbol, "date": "date"})
        df = df[["date", crypto.symbol]]
        df["date"] = pd.to_datetime(df["date"], errors='coerce')
        df = df.dropna(subset=['date'])
        all_dfs.append(df)

    if not all_dfs:
        raise ValueError("No valid data found in uploaded files.")
    prices_df = all_dfs[0]
    for df in all_dfs[1:]:
        prices_df = prices_df.merge(df, on="date", how="outer")

    prices_df = prices_df.sort_values("date").set_index("date").dropna(how='all')
    prices_df = prices_df.fillna(method='ffill').fillna(method='bfill')
    
    return prices_df

def sharpe_weights(prices_df, risk_free_rate=0.0):
    returns = np.log(prices_df / prices_df.shift(1)).dropna()
    
    if returns.empty:
        raise ValueError("Insufficient data to calculate returns. Check for missing or single-row data.")
        
    mean_returns = returns.mean()
    vol = returns.std()

    sharpe_ratios = (mean_returns - risk_free_rate) / vol
    sharpe_ratios = sharpe_ratios.clip(lower=0)

    if sharpe_ratios.sum() > 0:
        weights = sharpe_ratios / sharpe_ratios.sum()
    else:
        weights = pd.Series([1/len(sharpe_ratios)]*len(sharpe_ratios), index=sharpe_ratios.index)

    return weights, returns

def dynamic_weights_and_return(uploaded_data):
    prices = combine_uploaded_data(uploaded_data)
    weights, returns = sharpe_weights(prices)

    if returns.empty:
        portfolio_return = 0.0
    else:
        portfolio_return = np.dot(weights, returns.iloc[-1])

    return dict(weights), portfolio_return, returns

def stress_test(weights, n=1000):
    weights = {k.lower(): v for k, v in weights.items()}
    assets = list(weights.keys())

    scenarios_params = {
        "Bull Market": (0.04, 0.01),      
        "Bear Market": (-0.04, 0.015),    
        "Volatile Market": (0.00, 0.08)   
    }

    simulated_scenarios = {}
    for scenario, (mu, sigma) in scenarios_params.items():
        scenario_df_data = {}
        for asset in assets:
            scenario_df_data[asset] = np.random.normal(mu, sigma, n)
        simulated_scenarios[scenario] = pd.DataFrame(scenario_df_data)

    results = {}
    for scenario, df in simulated_scenarios.items():
        weight_vector = np.array([weights.get(col, 0) for col in df.columns])
        portfolio_returns = df.dot(weight_vector)

        results[scenario] = {
            "mean_return": float(portfolio_returns.mean()),
            "volatility": float(portfolio_returns.std()),
            "min_return": float(portfolio_returns.min()),
            "max_return": float(portfolio_returns.max())
        }

    return results

def interpret_stress_test(results):
    insights = []

    bear = results["Bear Market"]
    insights.append(f"Bear Market -> Avg: {bear['mean_return']:.2%}, Worst-case: {bear['min_return']:.2%}. "
                    f"Portfolio faces a downside, and diversification will determine the severity of the loss.")

    bull = results["Bull Market"]
    insights.append(f"Bull Market -> Avg: {bull['mean_return']:.2%}, Best-case: {bull['max_return']:.2%}. "
                    f"The current weights allow the portfolio to capture significant upside potential.")

    vol = results["Volatile Market"]
    insights.append(f"Volatile Market -> Range: {vol['min_return']:.2%} to {vol['max_return']:.2%}. "  
                    f"High swings show significant uncertainty, with potential for both large gains and losses.")

    return insights

def run_investment_strategy(uploaded_data):
    weights, port_return, returns = dynamic_weights_and_return(uploaded_data)
    results = stress_test(weights)
    insights = interpret_stress_test(results)
    
    return {
        "weights": weights,
        "portfolio_return": port_return,
        "stress_test_results": results,
        "insights": insights
    }

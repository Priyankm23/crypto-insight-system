import pandas as pd
import numpy as np
import smtplib
from email.mime.text import MIMEText
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

THRESHOLDS = {
    "volatility": 0.05,
    "sharpe": 1.0,
    "max_drawdown": -0.20,
    "sortino": 1.0,
    "beta": 1.2,
    "max_weight": 0.5
}

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = os.getenv("SMTP_PORT")

def fetch_data(uploaded_data=None):
    data = {}
    for crypto in uploaded_data:
        df = pd.DataFrame(crypto.data)
        df.columns = [col.strip().lower() for col in df.columns]
        if 'close' in df.columns and 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'], errors='coerce')
            df = df.dropna(subset=['date', 'close'])
            df.set_index("date", inplace=True)
            data[crypto.symbol] = pd.to_numeric(df['close'], errors='coerce')
    if not data:
        return pd.DataFrame()
    prices = pd.concat(data, axis=1)
    prices = prices.dropna(how="any")
    return prices

def compute_metrics(prices):
    returns = prices.pct_change(fill_method=None).dropna()
    n_assets = returns.shape[1]
    weights = np.repeat(1 / n_assets, n_assets) if n_assets > 0 else []

    port_ret = returns.dot(weights)
    vol = port_ret.std() * np.sqrt(252) if not port_ret.empty else np.nan

    sharpe = (port_ret.mean() / port_ret.std()) * np.sqrt(252) if port_ret.std() != 0 else np.nan
    downside = port_ret[port_ret < 0].std()
    sortino = (port_ret.mean() / downside) * np.sqrt(252) if downside != 0 else np.nan

    cumulative = (1 + port_ret).cumprod()
    peak = cumulative.cummax()
    drawdown = (cumulative - peak) / peak
    mdd = drawdown.min() if not drawdown.empty else np.nan

    if not returns.empty:
        market = returns.iloc[:, 0]
        cov = np.cov(port_ret, market)[0][1]
        var = np.var(market)
        beta = cov / var if var != 0 else np.nan
    else:
        beta = np.nan

    max_weight = weights.max() if weights.size > 0 else np.nan

    return {
        "volatility": vol,
        "sharpe": sharpe,
        "sortino": sortino,
        "max_drawdown": mdd,
        "beta": beta,
        "max_weight": max_weight
    }

def check_and_prepare_alert(metrics):
    violations = []

    if metrics["volatility"] >= THRESHOLDS["volatility"]:
        violations.append(f"Volatility {metrics['volatility']:.2%} >= {THRESHOLDS['volatility']:.0%}")
    if metrics["sharpe"] < THRESHOLDS["sharpe"]:
        violations.append(f"Sharpe {metrics['sharpe']:.2f} < {THRESHOLDS['sharpe']}")
    if metrics["sortino"] < THRESHOLDS["sortino"]:
        violations.append(f"Sortino {metrics['sortino']:.2f} < {THRESHOLDS['sortino']}")
    if metrics["max_drawdown"] < THRESHOLDS["max_drawdown"]:
        violations.append(f"Max Drawdown {metrics['max_drawdown']:.2%} < {THRESHOLDS['max_drawdown']:.0%}")
    if metrics["beta"] is not None and metrics["beta"] >= THRESHOLDS["beta"]:
        violations.append(f"Beta {metrics['beta']:.2f} >= {THRESHOLDS['beta']:.2f}")
    if metrics["max_weight"] > THRESHOLDS["max_weight"]:
        violations.append(f"Max Weight {metrics['max_weight']:.2%} >= {THRESHOLDS['max_weight']:.0%}")

    if not violations:
        return None

    return f"Risk Alert Triggered: {', '.join(violations)}"

def run_risk_check(user_email, uploaded_data=None):
    prices = fetch_data(uploaded_data)
    metrics = compute_metrics(prices)
    alert_message = check_and_prepare_alert(metrics)

    if alert_message and EMAIL_USER and EMAIL_PASS and user_email and SMTP_SERVER and SMTP_PORT:
        try:
            email = MIMEText(alert_message)
            email["Subject"] = "Crypto Risk Alert"
            email["From"] = EMAIL_USER
            email["To"] = user_email

            with smtplib.SMTP(SMTP_SERVER, int(SMTP_PORT)) as server:
                server.starttls()
                server.login(EMAIL_USER, EMAIL_PASS)
                server.send_message(email)
        except Exception as e:
            print(f"Failed to send risk alert email: {e}")

    return metrics, alert_message

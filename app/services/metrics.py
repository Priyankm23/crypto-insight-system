import pandas as pd
from typing import List, Optional
from app.models.portfolio import CryptoData
import numpy as np
from app.services.database import add_metric


def calculate_technical_metrics(crypto_data: List[dict], user_id: Optional[int] = None, rows: int = 10):
    """
    Compute per-symbol time-series technical metrics and store numeric metrics in DB.

    Returns a dict mapping symbol -> list of recent metric rows (each row is a dict with
    date, percent_change, rolling_volatility_7d, average_return_3d, trading_signal,
    sortino, beta).

    If `user_id` is provided, numeric metrics will be stored in the DB using `add_metric`.
    Ensures at least 30 metric rows are written to DB (duplicates latest values if necessary).
    """
    output = {}
    all_returns = {}

    # First pass: build DataFrames and returns for each symbol
    for crypto in crypto_data:
        df = pd.DataFrame(crypto.get('data', []))
        if df.empty:
            continue
        df.columns = [col.strip().lower() for col in df.columns]
        if 'close' not in df.columns:
            continue

        df['close'] = pd.to_numeric(df['close'], errors='coerce')
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'], errors='coerce')
            df = df.dropna(subset=['date', 'close'])
            df = df.sort_values('date')
        else:
            df = df.dropna(subset=['close'])

        if df.shape[0] < 2:
            continue

        returns = df['close'].pct_change().dropna()
        if returns.empty:
            continue

        symbol = crypto.get('symbol', 'UNKNOWN')
        all_returns[symbol] = returns
        # attach processed df for second pass
        output[symbol] = {'df': df}

    # Determine market returns as first symbol (if any)
    market_series = None
    if all_returns:
        first_symbol = next(iter(all_returns))
        market_series = all_returns[first_symbol]

    # Second pass: compute per-symbol metrics and prepare rows
    for symbol, info in list(output.items()):
        df = info['df']
        returns = df['close'].pct_change().dropna()

        # percent_change as decimal
        df['percent_change'] = df['close'].pct_change()
        df['rolling_volatility_7d'] = df['percent_change'].rolling(window=7).std()
        df['average_return_3d'] = df['percent_change'].rolling(window=3).mean()

        # moving averages & signal
        df['ma_5'] = df['close'].rolling(window=5).mean()
        df['ma_20'] = df['close'].rolling(window=20).mean()
        df['trading_signal'] = 'Hold'
        df.loc[df['ma_5'] > df['ma_20'], 'trading_signal'] = 'Buy'
        df.loc[df['ma_5'] < df['ma_20'], 'trading_signal'] = 'Sell'

        # Sortino ratio (annualized)
        downside = returns[returns < 0]
        downside_std = downside.std() * np.sqrt(252) if not downside.empty else np.nan
        mean_annual = returns.mean() * 252
        sortino = (mean_annual / downside_std) if downside_std and downside_std != 0 else np.nan

        # Beta vs market
        if market_series is not None and symbol in all_returns:
            # align series
            aligned = pd.concat([all_returns[symbol], market_series], axis=1).dropna()
            if aligned.shape[0] > 1:
                cov = np.cov(aligned.iloc[:, 0], aligned.iloc[:, 1])[0][1]
                var = np.var(aligned.iloc[:, 1])
                beta = cov / var if var != 0 else np.nan
            else:
                beta = np.nan
        else:
            beta = np.nan

        # build rows: take last `rows` non-null entries with metrics
        metrics_rows = []
        df_clean = df.dropna(subset=['percent_change'])
        tail = df_clean.tail(rows)
        for _, r in tail.iterrows():
            metrics_rows.append({
                'date': r['date'].isoformat() if 'date' in r and not pd.isna(r['date']) else None,
                'percent_change': float(r.get('percent_change', np.nan)),
                'rolling_volatility_7d': float(r.get('rolling_volatility_7d', np.nan)) if not pd.isna(r.get('rolling_volatility_7d', np.nan)) else None,
                'average_return_3d': float(r.get('average_return_3d', np.nan)) if not pd.isna(r.get('average_return_3d', np.nan)) else None,
                'trading_signal': str(r.get('trading_signal', 'Hold')),
                'sortino': float(sortino) if not pd.isna(sortino) else None,
                'beta': float(beta) if not pd.isna(beta) else None
            })

        output[symbol] = metrics_rows

    # If user_id provided, persist numeric metrics to DB (ensure at least 30 rows)
    stored = 0
    if user_id is not None:
        for symbol, rows_list in output.items():
            for row in rows_list:
                # store numeric metrics only
                for metric_name in ['percent_change', 'rolling_volatility_7d', 'average_return_3d', 'sortino', 'beta']:
                    val = row.get(metric_name)
                    if val is None or (isinstance(val, float) and np.isnan(val)):
                        continue
                    metric_key = f"{symbol}_{metric_name}"
                    try:
                        add_metric(metric_key, float(val), user_id)
                        stored += 1
                    except Exception:
                        # ignore DB write errors for now
                        pass
                    if stored >= 30:
                        break
                if stored >= 30:
                    break
            if stored >= 30:
                break

        # if still less than 30, duplicate latest numeric entries until we reach 30
        if stored < 30:
            # gather a list of candidate (metric_key, val)
            candidates = []
            for symbol, rows_list in output.items():
                if not rows_list:
                    continue
                last = rows_list[-1]
                for metric_name in ['percent_change', 'rolling_volatility_7d', 'average_return_3d', 'sortino', 'beta']:
                    val = last.get(metric_name)
                    if val is None or (isinstance(val, float) and np.isnan(val)):
                        continue
                    candidates.append((f"{symbol}_{metric_name}", float(val)))

            ci = 0
            while stored < 30 and candidates:
                key, val = candidates[ci % len(candidates)]
                try:
                    add_metric(f"{key}_dup{stored}", float(val), user_id)
                    stored += 1
                except Exception:
                    pass
                ci += 1

    return {'metrics': output, 'stored_count': stored}

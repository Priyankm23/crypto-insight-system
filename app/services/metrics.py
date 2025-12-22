import pandas as pd
from typing import List
from app.models.portfolio import CryptoData

def calculate_technical_metrics(crypto_data: List[dict]):
    results = []
    for crypto in crypto_data:
        df = pd.DataFrame(crypto['data'])
        df.columns = [col.strip().lower() for col in df.columns]
        
        if 'close' not in df.columns:
            continue

        # Calculate metrics
        df['percent_change'] = df['close'].pct_change() * 100
        df['rolling_volatility_7d'] = df['percent_change'].rolling(window=7).std()
        df['average_return_3d'] = df['percent_change'].rolling(window=3).mean()

        # Generate trading signals
        df['ma_5'] = df['close'].rolling(window=5).mean()
        df['ma_20'] = df['close'].rolling(window=20).mean()
        df['signal'] = 'Hold'
        df.loc[df['ma_5'] > df['ma_20'], 'signal'] = 'Buy'
        df.loc[df['ma_5'] < df['ma_20'], 'signal'] = 'Sell'
        
        df = df.dropna()
        
        daily_metrics = []
        for index, row in df.iterrows():
            daily_metrics.append({
                "date": row['date'],
                "percent_change": row['percent_change'],
                "rolling_volatility_7d": row['rolling_volatility_7d'],
                "average_return_3d": row['average_return_3d'],
                "trading_signal": row['signal']
            })

        results.append({
            "symbol": crypto['symbol'],
            "daily_metrics": daily_metrics
        })
    return results

import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_squared_error

def run_predictor(uploaded_data):
    results = []
    
    for crypto in uploaded_data:
        try:
            df = pd.DataFrame(crypto.data)
            df.columns = [col.strip().lower() for col in df.columns]
            
            if 'close' not in df.columns:
                continue

            df['return'] = np.log(df['close'] / df['close'].shift(1))
            df.dropna(inplace=True)
            
            if df.empty:
                continue

            # Train ARIMA model
            model = ARIMA(df['return'], order=(5,1,0))
            model_fit = model.fit()
            
            # Make prediction
            forecast = model_fit.get_forecast(steps=1)
            predicted_return = forecast.predicted_mean.iloc[0]
            conf_int = forecast.conf_int().iloc[0].tolist()

            results.append({
                "label": crypto.symbol,
                "actual_return": df['return'].iloc[-1],
                "predicted_return": predicted_return,
                "confidence_interval": conf_int
            })
        except Exception as e:
            results.append({
                "label": crypto.symbol,
                "error": str(e)
            })
        
    return {"results": results}

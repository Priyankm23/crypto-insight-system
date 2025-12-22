import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

def run_predictor(uploaded_data):
    """
    Run enhanced ARIMA prediction on uploaded crypto data with model validation.
    Returns format matching frontend expectations with additional accuracy metrics:
    {
        "predicted_value": float,
        "confidence_interval": [lower, upper],
        "next_period": "YYYY-MM-DD",
        "r2_score": float,
        "rmse": float,
        "mae": float,
        "mape": float,
        "model_order": [p, d, q],
        "training_size": int,
        "validation_size": int
    }
    """
    if not uploaded_data:
        raise ValueError("No data provided for prediction")
    
    # Use first crypto data for prediction
    crypto = uploaded_data[0]
    
    # Support both dict-like (from process_uploaded_files) and object-like inputs
    if isinstance(crypto, dict):
        rows = crypto.get('data')
        symbol = crypto.get('symbol', 'UNKNOWN')
    else:
        rows = getattr(crypto, 'data', None)
        symbol = getattr(crypto, 'symbol', 'UNKNOWN')
    
    if not rows:
        raise ValueError("No data found in uploaded file")
    
    df = pd.DataFrame(rows)
    df.columns = [str(col).strip().lower() for col in df.columns]
    
    if 'close' not in df.columns:
        raise ValueError("'close' column not found in data")
    
    # Parse date if available
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        df = df.dropna(subset=['date'])
        df = df.sort_values('date')
        last_date = df['date'].iloc[-1]
        next_period = (last_date + timedelta(days=1)).strftime('%Y-%m-%d')
    else:
        next_period = datetime.now().strftime('%Y-%m-%d')
    
    df['close'] = pd.to_numeric(df['close'], errors='coerce')
    df = df.dropna(subset=['close'])
    
    if df.shape[0] < 30:
        raise ValueError("Insufficient data points for prediction (need at least 30 for accurate modeling)")
    
    # Use close prices for prediction
    close_prices = df['close'].values
    
    # Split data: 80% training, 20% validation
    split_idx = int(len(close_prices) * 0.8)
    train_data = close_prices[:split_idx]
    test_data = close_prices[split_idx:]
    
    # Try multiple ARIMA configurations and select the best
    best_order = None
    best_aic = np.inf
    best_model = None
    
    # Grid search over common ARIMA parameters
    param_grid = [
        (1, 1, 0), (1, 1, 1), (2, 1, 0), (2, 1, 1),
        (3, 1, 0), (3, 1, 1), (5, 1, 0), (5, 1, 1),
        (1, 1, 2), (2, 1, 2), (3, 1, 2)
    ]
    
    for order in param_grid:
        try:
            model = ARIMA(train_data, order=order)
            model_fit = model.fit()
            if model_fit.aic < best_aic:
                best_aic = model_fit.aic
                best_order = order
                best_model = model_fit
        except:
            continue
    
    if best_model is None:
        # Fallback to simple model
        best_order = (1, 1, 0)
        model = ARIMA(train_data, order=best_order)
        best_model = model.fit()
    
    # Validate on test set
    predictions = []
    actuals = []
    
    for i in range(len(test_data)):
        # Retrain with expanding window
        temp_train = close_prices[:split_idx + i]
        try:
            temp_model = ARIMA(temp_train, order=best_order)
            temp_fit = temp_model.fit()
            pred = temp_fit.forecast(steps=1)[0]
            predictions.append(pred)
            actuals.append(test_data[i])
        except:
            # If model fails, use last known value
            predictions.append(temp_train[-1])
            actuals.append(test_data[i])
    
    # Calculate validation metrics
    try:
        r2 = r2_score(actuals, predictions)
        rmse = np.sqrt(mean_squared_error(actuals, predictions))
        mae = mean_absolute_error(actuals, predictions)
        mape = np.mean(np.abs((np.array(actuals) - np.array(predictions)) / np.array(actuals))) * 100
    except:
        r2 = 0.0
        rmse = 0.0
        mae = 0.0
        mape = 0.0
    
    # Train final model on all data and make prediction
    try:
        final_model = ARIMA(close_prices, order=best_order)
        final_fit = final_model.fit()
        
        # Make prediction
        forecast = final_fit.get_forecast(steps=1)
        predicted_value = float(forecast.predicted_mean.iloc[0])
        conf_int = forecast.conf_int().iloc[0].tolist()
        confidence_interval = [float(conf_int[0]), float(conf_int[1])]
    except Exception as e:
        # Fallback to weighted moving average with trend
        recent_window = close_prices[-10:]
        weights = np.arange(1, len(recent_window) + 1)
        predicted_value = float(np.average(recent_window, weights=weights))
        std = float(np.std(recent_window))
        confidence_interval = [predicted_value - 1.96 * std, predicted_value + 1.96 * std]
    
    return {
        "predicted_value": predicted_value,
        "confidence_interval": confidence_interval,
        "next_period": next_period,
        "r2_score": round(float(r2), 4),
        "rmse": round(float(rmse), 4),
        "mae": round(float(mae), 4),
        "mape": round(float(mape), 2),
        "model_order": list(best_order),
        "training_size": split_idx,
        "validation_size": len(test_data),
        "aic": round(float(best_aic), 2)
    }

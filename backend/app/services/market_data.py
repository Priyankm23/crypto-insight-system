import requests

BASE_URL = "https://api.coingecko.com/api/v3"

def get_historical_data(coin_id: str, days: int = 90):
    """
    Get historical market data for a specific coin.
    """
    url = f"{BASE_URL}/coins/{coin_id}/market_chart"
    params = {
        "vs_currency": "usd",
        "days": days,
    }
    response = requests.get(url, params=params)
    response.raise_for_status()  # Raise an exception for bad status codes
    return response.json()

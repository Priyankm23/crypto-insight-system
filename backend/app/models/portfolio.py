from pydantic import BaseModel
from typing import List, Dict
from fastapi import UploadFile

class CryptoData(BaseModel):
    symbol: str
    data: List[Dict]

class PortfolioAnalysisRequest(BaseModel):
    rule: str
    crypto_data: List[UploadFile]

class InvestmentStrategyRequest(BaseModel):
    crypto_data: List[UploadFile]

class RiskCheckRequest(BaseModel):
    crypto_data: List[UploadFile]

class PredictionRequest(BaseModel):
    crypto_data: List[UploadFile]

class Metric(BaseModel):
    name: str
    value: float

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from typing import List
from app.services.metrics import calculate_technical_metrics
from app.models.portfolio import CryptoData
from app.services.auth import get_current_user
from app.models.user import User
from app.services.database import get_metrics
from app.services.file_processing import process_uploaded_files

router = APIRouter()

@router.get("/")
async def get_latest_metrics(current_user: User = Depends(get_current_user)):
    try:
        metrics = get_metrics(current_user['id'])
        return metrics
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/")
async def get_technical_metrics(files: List[UploadFile] = File(...), current_user: User = Depends(get_current_user)):
    try:
        processed_data = await process_uploaded_files(files)
        result = calculate_technical_metrics(processed_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from typing import List
from app.services.predictor import run_predictor
from app.services.auth import get_current_user
from app.models.user import User
from app.services.file_processing import process_uploaded_files

router = APIRouter()

@router.post("/predict")
async def predict_returns(files: List[UploadFile] = File(...), current_user: User = Depends(get_current_user)):
    try:
        processed_data = await process_uploaded_files(files)
        result = run_predictor(processed_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

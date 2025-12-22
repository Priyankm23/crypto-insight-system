from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, status
from typing import List
from app.services.metrics import calculate_technical_metrics
from app.models.portfolio import CryptoData
from app.services.auth import get_current_user
from app.models.user import UserInDB # Import UserInDB
from app.services.database import get_metrics, get_latest_portfolio_analysis, get_latest_investment_strategy, get_latest_prediction
from app.services.file_processing import process_uploaded_files, save_uploaded_files
from app.services.database import update_user_uploaded_file_paths

router = APIRouter()

@router.get("/")
async def get_latest_metrics(current_user: UserInDB = Depends(get_current_user)):
    try:
        metrics = get_metrics(current_user.id) # Access id using dot notation
        return metrics
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/")
async def get_technical_metrics(files: List[UploadFile] | None = File(None), current_user: UserInDB = Depends(get_current_user)):
    user_id = current_user.id
    file_paths_to_process = []

    if files:
        # New files uploaded, save them and update user's stored paths
        saved_paths = await save_uploaded_files(files, user_id)
        update_user_uploaded_file_paths(user_id, saved_paths)
        file_paths_to_process = saved_paths
    else:
        # No new files, use previously uploaded files
        if current_user.uploaded_file_paths:
            file_paths_to_process = current_user.uploaded_file_paths
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No files provided and no previously uploaded files found for this user."
            )
    try:
        processed_data = await process_uploaded_files(file_paths_to_process)
        result = calculate_technical_metrics(processed_data, user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/dashboard")
async def get_dashboard_data(current_user: UserInDB = Depends(get_current_user)):
    user_id = current_user.id
    try:
        latest_metrics = get_metrics(user_id, limit=5)
        latest_portfolio_analysis = get_latest_portfolio_analysis(user_id, limit=5)
        latest_investment_strategy = get_latest_investment_strategy(user_id, limit=5)
        latest_prediction = get_latest_prediction(user_id, limit=5)

        return {
            "metrics": latest_metrics,
            "portfolio_analysis": latest_portfolio_analysis,
            "investment_strategy": latest_investment_strategy,
            "prediction": latest_prediction
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

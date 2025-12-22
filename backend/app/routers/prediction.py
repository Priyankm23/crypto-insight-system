from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, status
from typing import List, Optional
from app.services.predictor import run_predictor
from app.services.auth import get_current_user
from app.models.user import UserInDB # Import UserInDB
from app.services.file_processing import process_uploaded_files, save_uploaded_files
from app.services.database import add_prediction_data, update_user_uploaded_file_paths

router = APIRouter()

@router.post("/predict")
async def predict_returns(files: List[UploadFile] | None = File(None), current_user: UserInDB = Depends(get_current_user)):
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
        result = run_predictor(processed_data)
        
        # Store prediction results in the database
        add_prediction_data(user_id, result)

        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

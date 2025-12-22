from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, status
from typing import List, Optional
from app.services.portfolio_math import run_and_plot_strategy
from app.services.investment_rule import run_investment_strategy
from app.services.risk_checker import run_risk_check
from app.services.auth import get_current_user
from app.models.user import UserInDB
from app.services.file_processing import process_uploaded_files, save_uploaded_files
from app.services.database import add_metric, add_portfolio_data, update_user_uploaded_file_paths, add_investment_strategy_data
import base64
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/analysis")
async def portfolio_analysis(rule: str, files: List[UploadFile] | None = File(None), current_user: UserInDB = Depends(get_current_user)):
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
        
        # Flatten data for database insertion
        db_data = []
        for crypto in processed_data:
            for row in crypto['data']:
                db_data.append({
                    "user_id": user_id,
                    "symbol": crypto['symbol'],
                    "date": row['date'],
                    "close": row['close']
                })
        add_portfolio_data(db_data)
        
        comparison_df, insights, weights, plot_path = run_and_plot_strategy(rule, processed_data, user_id)
        for w in weights:
            add_metric(f"{rule}_weight_{w}", weights[w], user_id)

        # Store analysis results in the database
        analysis_result = {
            "rule": rule,
            "insights": insights,
            "weights": weights,
            # We don't store plot_path directly, but the insights/weights are key results
        }
        add_investment_strategy_data(user_id, analysis_result) # Re-using this table for analysis results

        with open(plot_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode("utf-8")

        return JSONResponse(content={
            "plot": encoded_string,
            "comparison_data": comparison_df,
            "insights": insights
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/investment-strategy")
async def investment_strategy(files: List[UploadFile] | None = File(None), current_user: UserInDB = Depends(get_current_user)):
    user_id = current_user.id
    file_paths_to_process = []

    if files:
        saved_paths = await save_uploaded_files(files, user_id)
        update_user_uploaded_file_paths(user_id, saved_paths)
        file_paths_to_process = saved_paths
    else:
        if current_user.uploaded_file_paths:
            file_paths_to_process = current_user.uploaded_file_paths
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No files provided and no previously uploaded files found for this user."
            )
    try:
        processed_data = await process_uploaded_files(file_paths_to_process)
        result = run_investment_strategy(processed_data)
        add_metric("investment_strategy_return", result["portfolio_return"], user_id)
        for w in result['weights']:
            add_metric(f"investment_strategy_weight_{w}", result['weights'][w], user_id)
        
        # Store investment strategy results in the database
        add_investment_strategy_data(user_id, result)

        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/risk-check")
async def risk_check(files: List[UploadFile] | None = File(None), current_user: UserInDB = Depends(get_current_user)):
    user_id = current_user.id
    file_paths_to_process = []

    if files:
        saved_paths = await save_uploaded_files(files, user_id)
        update_user_uploaded_file_paths(user_id, saved_paths)
        file_paths_to_process = saved_paths
    else:
        if current_user.uploaded_file_paths:
            file_paths_to_process = current_user.uploaded_file_paths
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No files provided and no previously uploaded files found for this user."
            )
    try:
        processed_data = await process_uploaded_files(file_paths_to_process)
        metrics, alert_message = run_risk_check(current_user.email, processed_data)
        for m in metrics:
            add_metric(f"risk_check_{m}", metrics[m], user_id)
        return {
            "metrics": metrics,
            "alert_message": alert_message
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

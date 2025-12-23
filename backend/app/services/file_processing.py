import io
import os
from typing import List, Union
from fastapi import UploadFile
import pandas as pd
import aiofiles

# Get the base directory (backend folder)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOAD_DIR = os.path.join(BASE_DIR, "data", "user_uploads")

async def save_uploaded_files(files: List[UploadFile], user_id: int) -> List[str]:
    """Saves uploaded files to a user-specific directory."""
    user_upload_dir = os.path.join(UPLOAD_DIR, str(user_id))
    os.makedirs(user_upload_dir, exist_ok=True)
    saved_file_paths = []
    for file in files:
        file_path = os.path.join(user_upload_dir, file.filename)
        async with aiofiles.open(file_path, 'wb') as out_file:
            while content := await file.read(1024):  # async read file in chunks
                await out_file.write(content)
        saved_file_paths.append(file_path)
    return saved_file_paths

async def process_uploaded_files(files_or_paths: List[Union[UploadFile, str]]):
    processed_data = []
    for item in files_or_paths:
        if isinstance(item, UploadFile):
            contents = await item.read()
            df = pd.read_csv(io.BytesIO(contents))
            filename = item.filename
        elif isinstance(item, str):
            with open(item, 'rb') as f:
                contents = f.read()
            df = pd.read_csv(io.BytesIO(contents))
            filename = os.path.basename(item)
        else:
            raise ValueError("Invalid item type provided to process_uploaded_files. Expected UploadFile or str (file path).")

        df.columns = [col.strip().lower() for col in df.columns]
        # Check for required columns
        required_columns = {'date', 'symbol', 'open', 'high', 'low', 'close', 'unix'}
        if not required_columns.issubset(df.columns):
            raise ValueError(f"File {filename} is missing one or more required columns: {required_columns}")
        
        # Extract symbol and data
        symbol = df['symbol'].iloc[0]
        data = df.to_dict(orient='records')
        processed_data.append({"symbol": symbol, "data": data})
    return processed_data


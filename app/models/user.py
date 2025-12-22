from pydantic import BaseModel, EmailStr
from typing import List, Optional

class User(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserInDB(BaseModel): # Changed to inherit from BaseModel directly
    id: int # Added id field
    name: str
    email: EmailStr
    hashed_password: str # Changed from 'password' to 'hashed_password'
    uploaded_file_paths: List[str] = []

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: EmailStr | None = None

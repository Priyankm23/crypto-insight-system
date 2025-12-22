from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from app.services.auth import authenticate_user, create_access_token
from app.services.database import add_user as add_user_service
from app.models.user import User, Token, UserInDB # Import UserInDB

router = APIRouter()

ACCESS_TOKEN_EXPIRE_MINUTES = 30

@router.post("/signup", response_model=User) # This should remain User for input validation
async def signup(user: User):
    if not add_user_service(user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    # Return a User object that matches the input, not UserInDB which has hashed password and file paths
    return user

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires # Access email using dot notation
    )
    return {"access_token": access_token, "token_type": "bearer"}

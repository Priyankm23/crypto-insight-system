from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.routers import authentication, portfolio, prediction, metrics

app = FastAPI()

# Configure CORS middleware
origins = [
    "http://localhost",
    "http://localhost:3000", # Assuming your frontend might run on port 3000
    "http://localhost:8000", # Assuming your frontend might run on port 8000
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
    # Add other frontend origins if necessary, e.g., your deployed frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"], # Allow all headers
)

app.include_router(authentication.router, prefix="/auth", tags=["authentication"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])
app.include_router(prediction.router, prefix="/predict", tags=["prediction"])
app.include_router(metrics.router, prefix="/metrics", tags=["metrics"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Crypto Investment Manager API"}

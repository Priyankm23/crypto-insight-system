from fastapi import FastAPI
from app.routers import authentication, portfolio, prediction, metrics

app = FastAPI()

app.include_router(authentication.router, prefix="/auth", tags=["authentication"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])
app.include_router(prediction.router, prefix="/predict", tags=["prediction"])
app.include_router(metrics.router, prefix="/metrics", tags=["metrics"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Crypto Investment Manager API"}

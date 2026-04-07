from fastapi import FastAPI
from app.routers import user

app = FastAPI()

# include router
app.include_router(user.router)

@app.get("/")
def root():
    return {"message": "API is running"}
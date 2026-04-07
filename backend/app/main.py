from fastapi import FastAPI
from app.database import engine, SessionLocal
from app.models.user import User
from app.database import Base

app = FastAPI()

# Tạo bảng trong DB
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "API is running"}

#API test query đơn giản (đúng yêu cầu Day 2)
@app.get("/test-users")
def test_users():
    db = SessionLocal()

    # # --- TEST THỬ THÌ BỎ COMMENT ĐOẠN CODE NÀY
    # new_user = User(
    #     username="khang",
    #     email="khang@example.com",
    #     password="123456",
    #     role="admin"
    # )
    # db.add(new_user)
    # db.commit()
    # #-----

    # Query tất cả user
    users = db.query(User).all()

    db.close()

    return users
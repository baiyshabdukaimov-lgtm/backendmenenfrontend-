import os
import datetime

import bcrypt
import jwt
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

# --------------- Database ---------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./users.db")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

JWT_SECRET = os.getenv("JWT_SECRET", "change-me-in-production")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)


Base.metadata.create_all(bind=engine)

# --------------- FastAPI app ---------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AuthRequest(BaseModel):
    email: str
    password: str


def create_token(email: str) -> str:
    payload = {
        "sub": email,
        "exp": datetime.datetime.now(datetime.timezone.utc)
        + datetime.timedelta(hours=24),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


@app.get("/")
def root():
    return {"status": "ok"}


@app.post("/api/register")
def register(body: AuthRequest):
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == body.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Бул email мурунтан катталган!")

        hashed = bcrypt.hashpw(body.password.encode(), bcrypt.gensalt())
        user = User(email=body.email, password_hash=hashed.decode())
        db.add(user)
        db.commit()

        return {"message": "Каттоо ийгиликтүү аяктады!", "token": create_token(body.email)}
    finally:
        db.close()


@app.post("/api/login")
def login(body: AuthRequest):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == body.email).first()
        if not user:
            raise HTTPException(status_code=401, detail="Gmail же пароль ката!")

        if not bcrypt.checkpw(body.password.encode(), user.password_hash.encode()):
            raise HTTPException(status_code=401, detail="Gmail же пароль ката!")

        return {"message": "Куш келиңиз!", "token": create_token(body.email)}
    finally:
        db.close()

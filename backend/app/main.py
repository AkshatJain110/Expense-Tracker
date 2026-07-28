from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

# import models so sqlalchemy registers them before create_all
from app.models import user, expense  # noqa

from app.routes import auth, expenses

# create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Expense Tracker API")

# cors so react frontend can talk to this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(expenses.router, prefix="/expenses", tags=["expenses"])


@app.get("/")
def root():
    return {"message": "Expense Tracker API is running"}

from pydantic import BaseModel
from typing import Optional


class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    date: str
    description: Optional[str] = None


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    date: Optional[str] = None
    description: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: int
    title: str
    amount: float
    category: str
    date: str
    description: Optional[str]
    user_id: int

    class Config:
        from_attributes = True

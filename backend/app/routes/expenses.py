from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from typing import List

from app.database import get_db
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from app.config import settings

router = APIRouter()
security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id = int(payload.get("sub"))
        return user_id
    except (JWTError, ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# IMPORTANT: this route must come before /{expense_id} route
# if it's after, fastapi reads "summary" as the expense_id value and it breaks
# spent way too long debugging this lol
@router.get("/summary/by-category")
def get_summary(db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    expenses = db.query(Expense).filter(Expense.user_id == user_id).all()

    summary = {}
    for exp in expenses:
        cat = exp.category
        summary[cat] = summary.get(cat, 0) + exp.amount

    result = [{"category": k, "total": round(v, 2)} for k, v in summary.items()]
    return result


@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    expenses = db.query(Expense).filter(Expense.user_id == user_id).order_by(Expense.created_at.desc()).all()
    return expenses


@router.post("/", response_model=ExpenseResponse, status_code=201)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    new_expense = Expense(**expense.dict(), user_id=user_id)
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(expense_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    expense = db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == user_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, updated: ExpenseUpdate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    expense = db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == user_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    for key, value in updated.dict(exclude_unset=True).items():
        setattr(expense, key, value)

    db.commit()
    db.refresh(expense)
    return expense


@router.delete("/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    expense = db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == user_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense)
    db.commit()
    return {"message": "deleted"}

# Expense Tracker

**Live Demo:** [https://expense-tracker-six-xi-77.vercel.app](https://expense-tracker-six-xi-77.vercel.app)

A full-stack expense tracking web app built with FastAPI (Python) and React.

## What it does

- Create an account and log in securely (JWT auth)
- Add, edit, and delete expense entries
- View all your expenses in a table
- See spending broken down by category in a bar chart

## Tech Stack

**Backend**
- FastAPI (Python)
- PostgreSQL (hosted on Neon)
- SQLAlchemy (ORM)
- Pydantic (input validation)
- JWT (python-jose) for authentication

**Frontend**
- React (Create React App)
- Axios for API calls
- Chart.js + react-chartjs-2 for the chart
- React Router v6

## Project Structure

```
expense-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   └── expense.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   └── expense.py
│   │   └── routes/
│   │       ├── auth.py
│   │       └── expenses.py
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.js
        ├── api.js
        ├── context/AuthContext.js
        ├── pages/
        │   ├── Login.js
        │   ├── Signup.js
        │   └── Dashboard.js
        └── components/
            ├── ExpenseForm.js
            ├── ExpenseList.js
            └── SpendingChart.js
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Health check |
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/expenses/` | Get all expenses |
| POST | `/expenses/` | Create expense |
| GET | `/expenses/{id}` | Get single expense |
| PUT | `/expenses/{id}` | Update expense |
| DELETE | `/expenses/{id}` | Delete expense |
| GET | `/expenses/summary/by-category` | Category totals for chart |

## Running Locally

### Backend

1. Create a virtual environment and install dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Create a `.env` file (copy from `.env.example`):
```
DATABASE_URL=your_postgresql_url
SECRET_KEY=any_random_string
```

3. Run the server:
```bash
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`. Swagger docs at `/docs`.

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:8000
```

```bash
npm start
```

Frontend runs at `http://localhost:3000`.

## Deployment

- **Backend**: Render (free tier) — set env vars `DATABASE_URL` and `SECRET_KEY` in Render dashboard
- **Frontend**: Vercel — set `REACT_APP_API_URL` to your Render backend URL
- **Database**: Neon (free tier PostgreSQL)

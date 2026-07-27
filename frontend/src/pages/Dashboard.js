import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import SpendingChart from '../components/SpendingChart'

function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState([])
  const [editingExpense, setEditingExpense] = useState(null)
  const [loading, setLoading] = useState(true)

  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchExpenses()
    fetchSummary()
  }, [])

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses/')
      setExpenses(res.data)
    } catch (err) {
      console.log('error fetching expenses', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const res = await api.get('/expenses/summary/by-category')
      setSummary(res.data)
    } catch (err) {
      console.log('error fetching summary', err)
    }
  }

  const handleExpenseAdded = (newExpense) => {
    setExpenses([newExpense, ...expenses])
    fetchSummary() // refresh chart
  }

  const handleExpenseUpdated = (updated) => {
    setExpenses(expenses.map((e) => (e.id === updated.id ? updated : e)))
    setEditingExpense(null)
    fetchSummary()
  }

  const handleDelete = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id))
    fetchSummary()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Expense Tracker</h1>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </header>

      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-label">Total Expenses</span>
          <span className="stat-value">{expenses.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Spent</span>
          <span className="stat-value">₹{totalSpent.toFixed(2)}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="left-col">
          <ExpenseForm
            onExpenseAdded={handleExpenseAdded}
            editingExpense={editingExpense}
            onCancelEdit={() => setEditingExpense(null)}
            onExpenseUpdated={handleExpenseUpdated}
          />
          <SpendingChart summaryData={summary} />
        </div>
        <div className="right-col">
          <h3>Your Expenses</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ExpenseList
              expenses={expenses}
              onDelete={handleDelete}
              onEdit={setEditingExpense}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

import { useState, useEffect, useMemo } from 'react'
import api from '../api'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'

function MonthlyReport() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingExpense, setEditingExpense] = useState(null)
  
  // Default to current month (YYYY-MM)
  const getCurrentMonth = () => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  }
  
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())

  useEffect(() => {
    fetchExpenses()
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

  // Filter expenses by selected month
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => expense.date.startsWith(selectedMonth))
  }, [expenses, selectedMonth])

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  const handleExpenseAdded = (newExpense) => {
    setExpenses([newExpense, ...expenses])
  }

  const handleExpenseUpdated = (updated) => {
    setExpenses(expenses.map((e) => (e.id === updated.id ? updated : e)))
    setEditingExpense(null)
  }

  const handleDelete = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  // When adding from a specific month view, default the date to the first of that month
  // unless it's the current month, then default to today.
  const getDefaultDate = () => {
    if (selectedMonth === getCurrentMonth()) return new Date().toISOString().split('T')[0]
    return `${selectedMonth}-01`
  }

  return (
    <div className="dashboard">
      <div className="report-header">
        <h2>Monthly Report</h2>
        <input 
          type="month" 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)} 
          className="month-picker"
        />
      </div>

      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-label">Total Expenses in {selectedMonth}</span>
          <span className="stat-value">{filteredExpenses.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Spent in {selectedMonth}</span>
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
            defaultDate={getDefaultDate()}
          />
        </div>
        <div className="right-col">
          <h3>Expenses for {selectedMonth}</h3>
          {loading ? (
            <p>Loading...</p>
          ) : filteredExpenses.length === 0 ? (
            <p className="empty-msg">No expenses found for this month.</p>
          ) : (
            <ExpenseList
              expenses={filteredExpenses}
              onDelete={handleDelete}
              onEdit={setEditingExpense}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default MonthlyReport

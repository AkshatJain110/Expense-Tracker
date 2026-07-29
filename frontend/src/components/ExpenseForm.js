import { useState } from 'react'
import api from '../api'

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other']

function ExpenseForm({ onExpenseAdded, editingExpense, onCancelEdit, onExpenseUpdated, defaultDate }) {
  const [title, setTitle] = useState(editingExpense?.title || '')
  const [amount, setAmount] = useState(editingExpense?.amount || '')
  const [category, setCategory] = useState(editingExpense?.category || 'Food')
  const [date, setDate] = useState(editingExpense?.date || defaultDate || new Date().toISOString().split('T')[0])
  const [description, setDescription] = useState(editingExpense?.description || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const data = { title, amount: parseFloat(amount), category, date, description }

    try {
      if (editingExpense) {
        const res = await api.put(`/expenses/${editingExpense.id}`, data)
        onExpenseUpdated(res.data)
      } else {
        const res = await api.post('/expenses/', data)
        onExpenseAdded(res.data)
        // reset form
        setTitle('')
        setAmount('')
        setCategory('Food')
        setDate(new Date().toISOString().split('T')[0])
        setDescription('')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-card">
      <h3>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Lunch, Uber"
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Description (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Any notes..."
          />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : editingExpense ? 'Update' : 'Add Expense'}
          </button>
          {editingExpense && (
            <button type="button" className="btn-cancel" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default ExpenseForm

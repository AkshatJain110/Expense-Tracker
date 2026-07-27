import api from '../api'

function ExpenseList({ expenses, onDelete, onEdit }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    try {
      await api.delete(`/expenses/${id}`)
      onDelete(id)
    } catch (err) {
      alert('Failed to delete')
    }
  }

  if (expenses.length === 0) {
    return <p className="empty-msg">No expenses yet. Add one above!</p>
  }

  return (
    <div className="table-wrapper">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.title}</td>
              <td><span className="badge">{exp.category}</span></td>
              <td>{exp.date}</td>
              <td className="amount">₹{exp.amount.toFixed(2)}</td>
              <td>
                <button className="btn-edit" onClick={() => onEdit(exp)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(exp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExpenseList

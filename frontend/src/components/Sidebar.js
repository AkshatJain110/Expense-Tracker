import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Sidebar() {
  const { userEmail, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Get first letter of email for avatar
  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U'

  return (
    <div className="sidebar">
      <div className="sidebar-profile">
        <div className="avatar">{initial}</div>
        <div className="user-info">
          <p className="user-email" title={userEmail || 'User'}>
            {userEmail ? userEmail.split('@')[0] : 'User'}
          </p>
          <p className="user-role">Free Plan</p>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          Overview
        </NavLink>
        <NavLink to="/report" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          Monthly Report
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="btn-sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar

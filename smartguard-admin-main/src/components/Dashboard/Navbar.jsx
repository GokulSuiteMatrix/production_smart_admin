"use client"
import { useMsal } from "@azure/msal-react"
import { Bell, User, ChevronDown } from "lucide-react"
import {  useNavigate } from "react-router-dom"
import PageHeader from "./PageHeader";


const Navbar = () => {
  const { instance, accounts } = useMsal()
 
  const user = accounts[0] || {}
  const navigate = useNavigate()

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin,
    })
  }

  const handleProfileClick = (e) => {
    e.preventDefault()
    navigate('/dashboard/profile')
  }

  return (
    <nav className="d-flex align-items-center justify-content-between p-3">
      <PageHeader />
      <div className="d-flex align-items-center">
        {/* Sidebar Toggle Removed */}
      </div>

      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-link" style={{ color: '#6c757d' }}>
          <Bell size={20} />
        </button>
        {/* <button className="btn btn-link" onClick={toggleTheme} style={{ color: '#6c757d' }}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button> */}
        
        <div className="dropdown">
          <button 
            className="btn btn-link text-decoration-none" 
            type="button" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
            style={{
              color: '#333',
              padding: '5px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div 
              className="rounded-circle bg-primary bg-opacity-10" 
              style={{ 
                width: '32px', 
                height: '32px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <User size={18} className="text-primary" />
            </div>
            <div className="d-none d-md-block" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>
                {user.name || 'User'}
              </div>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                {user.username || 'user@example.com'}
              </div>
            </div>
            <ChevronDown size={16} style={{ color: '#6c757d' }} />
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button 
                className="dropdown-item" 
                onClick={handleProfileClick}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 16px'
                }}
              >
                Profile Settings
              </button>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button 
                className="dropdown-item" 
                onClick={handleLogout}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 16px'
                }}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

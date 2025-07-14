// src/components/Dashboard/pages/Profile.jsx
import { useMsal } from "@azure/msal-react"
import { 
  User, 
  Mail, 
  Shield, 
  Calendar,
  Building,
  Globe,
  ArrowLeft,
  Settings
} from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"

const Profile = () => {
  const { accounts, instance } = useMsal()
  const navigate = useNavigate()
  const user = accounts[0] || {}

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin,
    })
  }

  if (!accounts.length) return <div>Loading...</div>

  return (
    <div className="container-fluid py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-link text-decoration-none p-0 me-3"
          >
            <ArrowLeft size={20} />
          </button>
          <h4 className="mb-0">Profile Settings</h4>
        </div>

        <div className="row g-4">
          {/* Profile Card */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                    <User size={24} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="mb-1">Account Information</h5>
                    <p className="text-muted mb-0">Manage your profile details</p>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label text-muted" htmlFor="fullName">Full Name</label>
                      <div className="d-flex align-items-center p-3 bg-light rounded">
                        <User size={18} className="text-primary me-3" />
                        <span className="fw-medium">{user.name || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label text-muted" htmlFor="emailAddress">Email Address</label>
                      <div className="d-flex align-items-center p-3 bg-light rounded">
                        <Mail size={18} className="text-primary me-3" />
                        <span className="fw-medium">{user.username || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label text-muted" htmlFor="accountType">Account Type</label>
                      <div className="d-flex align-items-center p-3 bg-light rounded">
                        <Shield size={18} className="text-primary me-3" />
                        <span className="fw-medium">Microsoft Account</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label text-muted" htmlFor="organization">Organization</label>
                      <div className="d-flex align-items-center p-3 bg-light rounded">
                        <Building size={18} className="text-primary me-3" />
                        <span className="fw-medium">
                          {user.tenantId ? 'Enterprise' : 'Personal'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-4">Quick Actions</h5>
                
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                    onClick={() => navigate('/dashboard/settings')}
                  >
                    <Settings size={18} className="me-2" />
                    Account Settings
                  </button>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="card border-0 shadow-sm mt-4">
              <div className="card-body p-4">
                <h5 className="mb-3">Session Info</h5>
                <div className="d-flex align-items-center mb-3">
                  <Globe size={18} className="text-primary me-3" />
                  <div>
                    <small className="text-muted d-block">Last Sign In</small>
                    <span className="fw-medium">Just Now</span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <Calendar size={18} className="text-primary me-3" />
                  <div>
                    <small className="text-muted d-block">Session Status</small>
                    <span className="fw-medium text-success">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Profile
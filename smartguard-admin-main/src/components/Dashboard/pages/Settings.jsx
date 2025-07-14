"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  User,
  Shield,
  Bell,
  Globe,
  Lock,
  Smartphone,
  Download,
  Trash2,
  Plus,
} from "lucide-react"

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile")
  

  const settingsTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    // { id: "billing", label: "Billing", icon: CreditCard },
    { id: "appearance", label: "Appearance", icon: Globe },
    { id: "privacy", label: "Privacy", icon: Lock },
  ]

  const renderProfileSettings = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 py-3">
        <h5 className="mb-0">Profile Settings</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4 text-center mb-4">
            <div className="position-relative d-inline-block">
              <div
                className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                style={{ width: "120px", height: "120px" }}
              >
                <User size={48} className="text-primary" />
              </div>
              <button className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0">
                <Plus size={16} />
              </button>
            </div>
            <h6 className="mt-3 mb-1">Admin User</h6>
            <p className="text-muted mb-0">admin@smartguard.com</p>
          </div>
          <div className="col-md-8">
            <form>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="firstname">First Name</label>
                  <input type="text" className="form-control" defaultValue="John" />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="lastname">Last Name</label>
                  <input type="text" className="form-control" defaultValue="Doe" />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input type="email" className="form-control" defaultValue="admin@smartguard.com" />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="phone">Phone</label>
                  <input type="tel" className="form-control" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="bio">Bio</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    defaultValue="System administrator with 5+ years of experience in managing family protection platforms."
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 py-3">
        <h5 className="mb-0">Security Settings</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <h6 className="mb-3">Password</h6>
          <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
            <div>
              <p className="mb-0">Last changed 30 days ago</p>
              <small className="text-muted">For security reasons, please change your password regularly</small>
            </div>
            <button className="btn btn-primary">Change Password</button>
          </div>
        </div>
        <div className="mb-4">
          <h6 className="mb-3">Two-Factor Authentication</h6>
          <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
            <div>
              <p className="mb-0">Not enabled</p>
              <small className="text-muted">Add an extra layer of security to your account</small>
            </div>
            <button className="btn btn-outline-primary">Enable 2FA</button>
          </div>
        </div>
        <div>
          <h6 className="mb-3">Active Sessions</h6>
          <div className="list-group">
            <div className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div className="d-flex align-items-center">
                  <Smartphone size={16} className="me-2 text-muted" />
                  <span>iPhone 12 Pro</span>
                </div>
                <small className="text-muted">Last active: 2 minutes ago</small>
              </div>
              <button className="btn btn-sm btn-outline-danger">End Session</button>
            </div>
            <div className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div className="d-flex align-items-center">
                  <Globe size={16} className="me-2 text-muted" />
                  <span>Chrome on Windows</span>
                </div>
                <small className="text-muted">Last active: 1 hour ago</small>
              </div>
              <button className="btn btn-sm btn-outline-danger">End Session</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 py-3">
        <h5 className="mb-0">Notification Settings</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <h6 className="mb-3">Email Notifications</h6>
          <div className="list-group">
            <div className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0">Security Alerts</p>
                <small className="text-muted">Get notified about security-related events</small>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </div>
            <div className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0">Subscription Updates</p>
                <small className="text-muted">Receive updates about subscription changes</small>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </div>
            <div className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0">System Updates</p>
                <small className="text-muted">Get notified about system maintenance and updates</small>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <h6 className="mb-3">Push Notifications</h6>
          <div className="list-group">
            <div className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0">New Messages</p>
                <small className="text-muted">Get notified about new messages</small>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </div>
            <div className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0">Task Updates</p>
                <small className="text-muted">Receive updates about task status changes</small>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  const renderAppearanceSettings = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 py-3">
        <h5 className="mb-0">Appearance Settings</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <h6 className="mb-3">Theme</h6>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card h-100 border-2 border-primary">
                <div className="card-body text-center">
                  <div className="bg-primary bg-opacity-10 p-3 rounded mb-3">
                    <Globe size={24} className="text-primary" />
                  </div>
                  <h6 className="mb-1">Light</h6>
                  <small className="text-muted">Default theme</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <div className="bg-dark bg-opacity-10 p-3 rounded mb-3">
                    <Globe size={24} className="text-dark" />
                  </div>
                  <h6 className="mb-1">Dark</h6>
                  <small className="text-muted">Dark mode</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <div className="bg-info bg-opacity-10 p-3 rounded mb-3">
                    <Globe size={24} className="text-info" />
                  </div>
                  <h6 className="mb-1">System</h6>
                  <small className="text-muted">Follow system theme</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h6 className="mb-3">Accent Color</h6>
          <div className="d-flex gap-2">
            <button className="btn btn-primary rounded-circle" style={{ width: "40px", height: "40px" }}></button>
            <button className="btn btn-success rounded-circle" style={{ width: "40px", height: "40px" }}></button>
            <button className="btn btn-info rounded-circle" style={{ width: "40px", height: "40px" }}></button>
            <button className="btn btn-warning rounded-circle" style={{ width: "40px", height: "40px" }}></button>
            <button className="btn btn-danger rounded-circle" style={{ width: "40px", height: "40px" }}></button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPrivacySettings = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 py-3">
        <h5 className="mb-0">Privacy Settings</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <h6 className="mb-3">Data Collection</h6>
          <div className="list-group">
            <div className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0">Usage Analytics</p>
                <small className="text-muted">Allow us to collect usage data to improve our services</small>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </div>
            <div className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0">Error Reporting</p>
                <small className="text-muted">Send error reports to help us fix issues</small>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h6 className="mb-3">Data Export</h6>
          <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
            <div>
              <p className="mb-0">Download your data</p>
              <small className="text-muted">Get a copy of all your personal data</small>
            </div>
            <button className="btn btn-primary">
              <Download size={16} className="me-2" />
              Export Data
            </button>
          </div>
        </div>
        <div>
          <h6 className="mb-3">Account Deletion</h6>
          <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
            <div>
              <p className="mb-0">Delete your account</p>
              <small className="text-muted">Permanently delete your account and all associated data</small>
            </div>
            <button className="btn btn-outline-danger">
              <Trash2 size={16} className="me-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileSettings()
      case "security":
        return renderSecuritySettings()
      case "notifications":
        return renderNotificationSettings()
      case "billing":
        return renderBillingSettings()
      case "appearance":
        return renderAppearanceSettings()
      case "privacy":
        return renderPrivacySettings()
      default:
        return renderProfileSettings()
    }
  }

  return (
    <div className="fade-in">
      {/* Fixed Header: title and description */}
      
      <div style={{ marginTop: 50 }} />

      <div className="row">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`list-group-item list-group-item-action d-flex align-items-center ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon size={20} className="me-3" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
"use client"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  Home, 
  Users, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  Shield,
} from "lucide-react"
import "./Sidebar.css"
import PropTypes from "prop-types"
import { useEffect } from "react";

const Sidebar = ({ onSidebarHover, onSidebarLeave }) => {
  const location = useLocation()
 

  const menuItems = [
    { path: "/dashboard", icon: Home, label: "Overview", roles: ["admin", "support", "user", "finance"] },
    { path: "/dashboard/tenants", icon: Users, label: "Tenant Management", roles: ["admin", "user"] },
    { path: "/dashboard/subscriptions", icon: CreditCard, label: "Subscriptions", roles: ["admin", "user", "finance"] },
    { path: "/dashboard/support", icon: MessageSquare, label: "Support Tickets", roles: ["admin", "support", "user"] },
    { path: "/dashboard/settings", icon: Settings, label: "Settings", roles: ["admin", "support"] },
  ]

  return (
    <motion.div
      className="sidebar sidebar-hover-expand position-fixed top-0 start-0 h-100 bg-white border-end shadow-sm"
      initial={{ width: 60 }}
      animate={{ width: 60 }}
      whileHover={{ width: 220 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      style={{ zIndex: 1001 }}
      onMouseEnter={onSidebarHover}
      onMouseLeave={onSidebarLeave}
    >
      <div className="d-flex flex-column h-100">
        {/* Header */}
        <div className="sidebar-header d-flex align-items-center justify-content-center py-4">
          <Shield size={32} className="text-primary" />
          <span className="sidebar-label ms-2 fw-bold">SP Parent Control</span>
        </div>
        {/* Navigation */}
        <div className="flex-grow-1 overflow-auto">
          <nav className="nav flex-column p-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link d-flex align-items-center gap-2 px-2 py-3 mb-1 rounded sidebar-link ${isActive ? "active" : ""}`}
                >
                  <Icon size={22} />
                  <span className="sidebar-label ms-2">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        {/* Footer - User Profile */}
       
      </div>
    </motion.div>
  )
}

Sidebar.propTypes = {
  onSidebarHover: PropTypes.func,
  onSidebarLeave: PropTypes.func,
};

export default Sidebar

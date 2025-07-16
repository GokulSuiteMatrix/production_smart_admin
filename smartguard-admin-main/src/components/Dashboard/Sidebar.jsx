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
import logo from "../../assescts/Logo.jpg";
import { useState } from "react";

const Sidebar = ({ isInitiallyOpen, setIsInitiallyOpen, onSidebarHover, onSidebarLeave }) => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  // const [isInitiallyOpen, setIsInitiallyOpen] = useState(true); // This line is removed as per the edit hint

  // No auto-timeout: collapse only on user action
 

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
      initial={{ width: isInitiallyOpen ? 220 : 60 }}
      animate={{ width: isInitiallyOpen ? 220 : 60 }}
      whileHover={isInitiallyOpen ? {} : { width: 220 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ zIndex: 1001 }}
      onMouseEnter={e => { if (!isInitiallyOpen) { setIsHovered(true); if (onSidebarHover) onSidebarHover(e); } }}
      onMouseLeave={e => { if (!isInitiallyOpen) { setIsHovered(false); if (onSidebarLeave) onSidebarLeave(e); } }}
    >
      <div className="d-flex flex-column h-100 " >
        {/* Header */}
        <div className="sidebar-header d-flex align-items-center justify-content-center py-3 ">
          {isInitiallyOpen ? (
            <img
              src={logo}
              alt="Logo"
              style={{
                width: 100,
                height: 50,
                objectFit: 'contain',
                marginLeft: 9,
                display: 'block',
                transition: 'transform 0.1s',
                transform: 'scale(1.08)'
              }}
            />
          ) : (
            isHovered ? (
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: 120,
                  height: 50,
                  objectFit: 'contain',
                  marginLeft: 1,
                  display: 'block',
                  transition: 'transform 0.2s',
                  transform: 'scale(1.08)'
                }}
              />
            ) : (
              <>
                <Shield size={32} className="text-primary" />
                
              </>
            )
          )}
        </div>
        {/* Navigation */}
        <div className="flex-grow-1 overflow-auto">
          <nav className="nav flex-column p-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link d-flex align-items-center gap-2 px-2 py-3 mb-1 rounded sidebar-link ${isActive ? "active" : ""}`}
                  onClick={() => setIsInitiallyOpen(false)}
                >
                  <Icon size={22} />
                  {(isInitiallyOpen || isHovered) && (
                    <span className="sidebar-label ms-2">{item.label}</span>
                  )}
                </Link>
              );
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
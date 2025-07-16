"use client"
 
import { useState, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import Overview from "./pages/Overview"
import TenantManagement from "./pages/TenantManagement"
import DeviceActivity from "./pages/DeviceActivity"
import Subscriptions from "./pages/Subscriptions"
import SupportTickets from "./pages/SupportTickets"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import "./Dashboard.css" // We'll create this file next
import ErrorBoundary from "./pages/ErrorBoundary"
 
const SIDEBAR_COLLAPSED = 60;
const SIDEBAR_EXPANDED = 220;
 
const Dashboard = () => {
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [isInitiallyOpen, setIsInitiallyOpen] = useState(true);
 
  useEffect(() => {
    if (sidebarHovered) {
      document.body.classList.add('sidebar-expanded');
    } else {
      document.body.classList.remove('sidebar-expanded');
    }
  }, [sidebarHovered]);
 
  const sidebarWidth = isInitiallyOpen ? SIDEBAR_EXPANDED : (sidebarHovered ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED);
 
  return (
    <div className="d-flex min-vh-100">
      <Sidebar
        isInitiallyOpen={isInitiallyOpen}
        setIsInitiallyOpen={setIsInitiallyOpen}
        onSidebarHover={() => setSidebarHovered(true)}
        onSidebarLeave={() => setSidebarHovered(false)}
      />
      <div
        className="dashboard-main-content"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100% - ${sidebarWidth}px)`,
          minWidth: 0,
          transition: 'margin-left 0.5s cubic-bezier(0.4,0,0.2,1), width 0.5s cubic-bezier(0.4,0,0.2,1)'
        }}
      >
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: sidebarWidth,
            right: 0,
            width: `calc(100% - ${sidebarWidth}px)`,
            backgroundColor: '#fff',
            zIndex: 999,
            transition: 'left 0.5s cubic-bezier(0.4,0,0.2,1), width 0.5s cubic-bezier(0.4,0,0.2,1)',
            borderBottom: '1px solid #e9ecef'
          }}
        >
          <Navbar />
        </div>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4"
          style={{ marginTop: '76px' }}
        >
          <Routes>
            <Route index element={<ErrorBoundary><Overview /></ErrorBoundary>} />
            <Route path="overview" element={<ErrorBoundary><Overview /></ErrorBoundary>} />
            <Route path="tenants" element={<TenantManagement />} />
            <Route path="devices" element={<DeviceActivity />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="support" element={<SupportTickets />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </motion.main>
      </div>
    </div>
  )
}
 
export default Dashboard
 
 
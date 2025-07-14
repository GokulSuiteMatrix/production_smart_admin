"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  FileText,
  FileSpreadsheet,
  MoreVertical,
  MessageSquare,
  User,
  Calendar,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  X,
} from "lucide-react"

const SupportTickets = () => {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const stats = [
    {
      title: "Open Tickets",
      value: "2",
      change: "+3",
      icon: Ticket,
      color: "warning",
      trend: "up",
    },
    {
      title: "In Progress",
      value: "1",
      change: "+1",
      icon: Clock,
      color: "info",
      trend: "up",
    },
    {
      title: "Resolved Today",
      value: "12",
      change: "+8",
      icon: CheckCircle,
      color: "success",
      trend: "up",
    },
    {
      title: "Avg Response Time",
      value: "2.5h",
      change: "-0.5h",
      icon: AlertCircle,
      color: "primary",
      trend: "down",
    },
  ]

  const tickets = [
    {
      id: 1,
      subject: "Cannot access parental controls",
      status: "Open",
      priority: "High",
      category: "Technical",
      assignedTo: "John Doe",
      createdAt: "2024-01-15T10:30:00Z",
      lastUpdated: "2024-01-15T11:45:00Z",
      messages: 3,
    },
    {
      id: 2,
      subject: "Billing inquiry for premium plan",
      status: "In Progress",
      priority: "Medium",
      category: "Billing",
      assignedTo: "Jane Smith",
      createdAt: "2024-01-14T15:20:00Z",
      lastUpdated: "2024-01-15T09:15:00Z",
      messages: 5,
    },
    {
      id: 3,
      subject: "Feature request: Additional device support",
      status: "Resolved",
      priority: "Low",
      category: "Feature Request",
      assignedTo: "Mike Johnson",
      createdAt: "2024-01-13T09:00:00Z",
      lastUpdated: "2024-01-14T16:30:00Z",
      messages: 8,
    },
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      Open: { class: "bg-warning", icon: Ticket },
      "In Progress": { class: "bg-info", icon: Clock },
      Resolved: { class: "bg-success", icon: CheckCircle },
    }
    const config = statusConfig[status] || { class: "bg-secondary", icon: AlertCircle }
    return (
      <span className={`badge ${config.class} d-flex align-items-center`}>
        <config.icon size={12} className="me-1" />
        {status}
      </span>
    )
  }

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      High: "bg-danger",
      Medium: "bg-warning",
      Low: "bg-info",
    }
    return <span className={`badge ${priorityConfig[priority]}`}>{priority}</span>
  }

  const filteredTickets = tickets
    .filter((ticket) => {
      const matchesSearch = searchTerm === "" || 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = selectedStatus === "all" || 
        ticket.status.toLowerCase() === selectedStatus.toLowerCase()

      return matchesSearch && matchesStatus
    })

  return (
    <div className="fade-in">
      {/* Fixed Header: title, description, and filter bar (if any) */}
      <div className="overview-header-fixed">
        
        {/* If you have a filter bar, include it here */}
      </div>
      <div style={{ marginTop: 50 }} />

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        {stats.map((stat, index) => (
          <div key={stat.title} className="col-md-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="card h-100 border-0 shadow-sm"
            >
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className={`bg-${stat.color} bg-opacity-10 p-3 rounded-3`}>
                      <stat.icon size={24} className={`text-${stat.color}`} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">{stat.title}</h6>
                    <div className="d-flex align-items-center">
                      <h3 className="mb-0 me-2">{stat.value}</h3>
                      <span className={`badge bg-${stat.color}`}>
                        {stat.trend === "up" ? (
                          <TrendingUp size={14} className="me-1" />
                        ) : (
                          <TrendingDown size={14} className="me-1" />
                        )}
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Tickets Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="card border-0 shadow-sm"
      >
        <div className="card-header bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Recent Tickets</h5>
            <div className="d-flex gap-2">
              <div className="input-group gap-2">

              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <div className="dropdown">
                  <button
                    className="btn btn-outline-primary dropdown-toggle"
                    type="button"
                    onClick={() => setShowExportOptions(!showExportOptions)}
                  >
                    <Download size={16} className="me-2" />
                    Export
                  </button>
                  {showExportOptions && (
                    <div className="dropdown-menu show" style={{ position: "absolute", right: 0, top: "100%" }}>
                      <button className="dropdown-item">
                        <FileText size={16} className="me-2" />
                        Export as PDF
                      </button>
                      <button className="dropdown-item">
                        <FileSpreadsheet size={16} className="me-2" />
                        Export as CSV
                      </button>
                    </div>
                  )}
                </div>
              </div>
                <span className="input-group-text bg-light border-0">
                  <Search size={16} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-light"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-light border-0"
                    onClick={() => setSearchTerm("")}
                  >
                    <X size={16} className="text-muted" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0">Subject</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Priority</th>
                  <th className="border-0">Category</th>
                  <th className="border-0">Assigned To</th>
                  <th className="border-0">Created</th>
                  <th className="border-0">Last Updated</th>
                  <th className="border-0">Messages</th>
                  <th className="border-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket, index) => (
                    <motion.tr
                      key={ticket.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                      className="position-relative"
                    >
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <MessageSquare size={20} className="text-primary" />
                          </div>
                          <div>
                            <div className="fw-medium">{ticket.subject}</div>
                            <small className="text-muted">#{ticket.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>{getStatusBadge(ticket.status)}</td>
                      <td>{getPriorityBadge(ticket.priority)}</td>
                      <td>
                        <span className="badge bg-light text-dark">{ticket.category}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <User size={14} className="me-2 text-muted" />
                          <span>{ticket.assignedTo}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={14} className="me-2 text-muted" />
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={14} className="me-2 text-muted" />
                          <span>{new Date(ticket.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <MessageSquare size={14} className="me-2 text-muted" />
                          <span>{ticket.messages}</span>
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-light dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            Actions
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <button className="dropdown-item">
                                <MessageSquare size={14} className="me-2" />
                                View Details
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item">
                                <User size={14} className="me-2" />
                                Assign
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item">
                                <Tag size={14} className="me-2" />
                                Change Status
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <div className="d-flex flex-column align-items-center">
                        <Search size={32} className="text-muted mb-2" />
                        <h6 className="text-muted mb-1">No tickets found</h6>
                        <p className="text-muted mb-0">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SupportTickets
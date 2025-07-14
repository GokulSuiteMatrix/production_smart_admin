"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Smartphone, Clock, Shield, Activity, Eye, Ban, Users, ChevronDown, Search } from "lucide-react"

const DeviceActivity = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFamily, setSelectedFamily] = useState(null)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // or any default page size
  const [totalPages, setTotalPages] = useState(1);

  const families = [
    {
      id: 1,
      familyName: "Johnson Family",
      parentName: "John Johnson",
      parentEmail: "john.johnson@email.com",
      children: [
        {
          id: 1,
          name: "Emma Johnson",
          age: 12,
          grade: "6th",
          devices: ["Emma's iPhone", "Emma's iPad"],
          activities: [
            {
              id: 1,
              deviceName: "Emma's iPhone",
              appName: "TikTok",
              action: "App Blocked",
              timestamp: "2023-12-15 14:30:25",
              duration: "0:00",
              category: "Social Media",
              status: "blocked",
              reason: "Inappropriate content detected",
            },
            {
              id: 5,
              deviceName: "Emma's iPhone",
              appName: "Khan Academy",
              action: "App Opened",
              timestamp: "2023-12-15 14:10:15",
              duration: "1:45:20",
              category: "Education",
              status: "allowed",
              reason: "Educational content",
            }
          ]
        }
      ]
    },
    {
      id: 2,
      familyName: "Smith Family",
      parentName: "Sarah Smith",
      parentEmail: "sarah.smith@email.com",
      children: [
        {
          id: 2,
          name: "Alex Smith",
          age: 10,
          grade: "5th",
          devices: ["Alex's iPad"],
          activities: [
            {
              id: 2,
              deviceName: "Alex's iPad",
              appName: "YouTube",
              action: "Screen Time Limit",
              timestamp: "2023-12-15 14:25:10",
              duration: "2:30:00",
              category: "Entertainment",
              status: "limited",
              reason: "Daily limit exceeded",
            }
          ]
        }
      ]
    }
  ]

  const filteredFamilies = families.filter(family => 
    family.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.parentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.children.some(child => child.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const stats = [
    {
      id: "total-families",
      title: "Total Families",
      value: families.length.toString(),
      icon: Users,
      color: "primary",
    },
    {
      id: "children-monitored",
      title: "Children Monitored",
      value: families.reduce((sum, family) => sum + family.children.length, 0).toString(),
      icon: Users,
      color: "info",
    },
    {
      id: "active-devices",
      title: "Active Devices",
      value: "15",
      icon: Smartphone,
      color: "success",
    },
    {
      id: "blocked-activities",
      title: "Blocked Activities",
      value: "47",
      icon: Ban,
      color: "danger",
    },
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      blocked: { class: "bg-danger", text: "Blocked" },
      limited: { class: "bg-warning", text: "Limited" },
      allowed: { class: "bg-success", text: "Allowed" },
    }
    const config = statusConfig[status] || { class: "bg-secondary", text: "Unknown" }
    return <span className={`badge ${config.class}`}>{config.text}</span>
  }

  const getActionIcon = (action) => {
    switch (action) {
      case "App Blocked":
        return <Ban size={16} className="text-danger" />
      case "Screen Time Limit":
        return <Clock size={16} className="text-warning" />
      case "App Opened":
        return <Eye size={16} className="text-success" />
      default:
        return <Activity size={16} className="text-muted" />
    }
  }

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="h3 mb-2">Family Monitoring</h1>
        <p className="text-muted">View and manage family device activities</p>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={stat.id} className="col-xl-3 col-md-6 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="stat-card h-100"
              >
                <div className="d-flex align-items-center">
                  <div className={`text-${stat.color} me-3`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="h4 mb-0">{stat.value}</h3>
                    <p className="text-muted mb-0">{stat.title}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="card mb-4"
      >
        <div className="card-body">
          <div className="position-relative">
            <Search className="position-absolute top-50 translate-middle-y ms-3" size={16} />
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search families, parents, or children..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {/* Family List */}
      {filteredFamilies.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="card"
        >
          <div className="card-body p-0">
            <div className="list-group list-group-flush">
              {filteredFamilies.map((family) => (
                <motion.div
                  key={family.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className={`list-group-item list-group-item-action ${selectedFamily?.id === family.id ? 'active' : ''}`}
                  onClick={() => setSelectedFamily(selectedFamily?.id === family.id ? null : family)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{family.familyName}</h6>
                      <small className="text-muted">
                        {family.parentName} • {family.parentEmail}
                      </small>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="badge bg-primary me-2">
                        {family.children.length} {family.children.length === 1 ? 'Child' : 'Children'}
                      </span>
                      <ChevronDown size={20} className={`transition ${selectedFamily?.id === family.id ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {selectedFamily?.id === family.id && (
                    <div className="mt-3 pt-3 border-top bg-light rounded-3  text-dark p-3">
                      <h6 className="mb-3">Children</h6>
                      {family.children.map((child) => (
                        <div key={child.id} className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <div className="bg-info rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "36px", height: "36px" }}>
                              <span className="text-white fw-bold">{child.name.charAt(0)}</span>
                            </div>
                            <div>
                              <h6 className="mb-0">{child.name}</h6>
                              <small className="text-muted">
                                Age {child.age} • {child.grade} • {child.devices.length} {child.devices.length === 1 ? 'Device' : 'Devices'}
                              </small>
                            </div>
                          </div>

                          {child.activities.length > 0 && (
                            <div className="ms-5">
                              <h6 className="mb-2">Recent Activities</h6>
                              <div className="table-responsive">
                                <table className="table table-sm mb-0">
                                  <thead>
                                    <tr>
                                      <th>App</th>
                                      <th>Action</th>
                                      <th>Status</th>
                                      <th>Time</th>
                                      <th>Reason</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {child.activities.map((activity) => (
                                      <tr key={activity.id}>
                                        <td>
                                          <div className="d-flex align-items-center">
                                            {getActionIcon(activity.action)}
                                            <span className="ms-2">{activity.appName}</span>
                                          </div>
                                        </td>
                                        <td>{activity.action}</td>
                                        <td>{getStatusBadge(activity.status)}</td>
                                        <td>
                                          <small className="text-muted">{activity.timestamp}</small>
                                        </td>
                                        <td>
                                          <small className="text-muted">{activity.reason}</small>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center py-5"
        >
          <Users size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No families found</h5>
          <p className="text-muted">
            Try adjusting your search criteria
          </p>
        </motion.div>
      )}

      {/* Real-time Monitoring Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="alert alert-info mt-4"
      >
        <div className="d-flex align-items-center">
          <Shield size={20} className="me-3" />
          <div>
            <strong>Real-time Monitoring Active</strong>
            <p className="mb-0">
              All connected devices are being monitored. New activities will appear here automatically.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DeviceActivity
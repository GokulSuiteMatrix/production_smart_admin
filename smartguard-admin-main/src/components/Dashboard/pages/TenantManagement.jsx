


"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

import {
  Search,
  Pause,
  Trash2,
  Plus,
  Users,
  Smartphone,
  Calendar,
  MoreVertical,
  X,
  User,
  CreditCard,
  Check,
  Wifi,
  Tablet,
  Laptop,
  Tv,
  ArrowLeft,
  Edit,
  Users2,

} from "lucide-react";
import { fetchTenants, updateTenant, fetchChildrenAndDevices, searchTenantsByFamilyName, deleteTenant } from "../../../api/tenants";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Overview.css";

function useEscapeKey(onEscape) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onEscape]);
}

const TenantManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [showAddFamilyForm, setShowAddFamilyForm] = useState(false);
  const [view, setView] = useState("list");
  const [newFamily, setNewFamily] = useState({
    familyName: "",
    parentEmail: "",
    parentName: "",
    address: "",
    phoneNumber: "",
    subscriptionPlan: "Free",
    children: [{ name: "", age: "", grade: "" }],
  });
  const [managedDeviceFamily, setManagedDeviceFamily] = useState(null);
  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "Phone",
    macAddress: "",
    status: "Active",
  });
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [childrenData, setChildrenData] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [childrenError, setChildrenError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [timePeriod, setTimePeriod] = useState('yearly');
  const [customDateRange, setCustomDateRange] = useState([null, null]);
  const [customStartDate, customEndDate] = customDateRange;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // or any default page size
  const [totalPages, setTotalPages] = useState(1);
  const [totalTenants, setTotalTenants] = useState(0);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState(null);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [timePeriod, customStartDate, customEndDate]);

  useEffect(() => {
    console.log('Fetching tenants for page:', page, 'with limit:', limit);
    if (tenants.length === 0) {
      setLoading(true);
    } else {
      setTableLoading(true);
    }

    // Only send date range if custom date is selected
    let start = null;
    let end = null;
    if (timePeriod === 'custom' && customStartDate && customEndDate) {
      start = customStartDate;
      end = customEndDate;
    }

    fetchTenants(start, end, page, limit)
      .then((data) => {
        console.log('API response data:', data);
        setTenants(data.tenants || []);
        if (data.pagination) {
          setTotalPages(data.pagination.total_pages);
          setTotalTenants(data.pagination.total);
        } else if (data.total) {
          setTotalPages(Math.ceil(data.total / limit));
          setTotalTenants(data.total);
        } else {
          setTotalPages(1);
          setTotalTenants(data.tenants ? data.tenants.length : 0);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setLoading(false);
        setTableLoading(false);
      });
  }, [timePeriod, customStartDate, customEndDate, page, limit]);

  useEffect(() => {
    if (!selectedFamily || !selectedFamily.id) {
      console.log('No selectedFamily or missing id:', selectedFamily);
      return;
    }
    setLoadingChildren(true);
    console.log('Fetching children/devices for tenant id:', selectedFamily.id);
    fetchChildrenAndDevices(selectedFamily.id)
      .then(data => {
        console.log('API children response:', data);
        setChildrenData(data.children);
      })
      .catch(err => setChildrenError(err.message))
      .finally(() => setLoadingChildren(false));
  }, [selectedFamily?.id]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    searchTenantsByFamilyName(searchTerm)
      .then(setSearchResults)
      .catch(() => setSearchResults([]))
      .finally(() => setSearchLoading(false));
  }, [searchTerm]);

  function isWithinRange(dateStr, start, end) {
    if (!dateStr) return false;
    const date = new Date(dateStr.split('T')[0]);
    // Set time to 0:00:00 for comparison
    date.setHours(0,0,0,0);
    if (start) {
      start = new Date(start);
      start.setHours(0,0,0,0);
    }
    if (end) {
      end = new Date(end);
      end.setHours(0,0,0,0);
    }
    return (!start || date >= start) && (!end || date <= end);
  }

  // For backend pagination, just use the tenants array from the API response
  let tenantsToDisplay = tenants;

  console.log('Tenants:', tenants);
  console.log('Filtered tenantsToDisplay:', tenantsToDisplay);

  const filteredTenants = tenantsToDisplay.filter((tenant) => {
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = searchTerm === "" || 
      (tenant.name && tenant.name.toLowerCase().includes(searchTermLower)) ||
      (tenant.parentEmail && tenant.parentEmail.toLowerCase().includes(searchTermLower)) ||
      (tenant.familyCode && tenant.familyCode.toLowerCase().includes(searchTermLower));

    const matchesFilter =
      filterStatus === "all" ||
      (tenant.status && tenant.status.toLowerCase() === filterStatus.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  console.log('Tenants:', tenants);
  console.log('Filtered tenantsToDisplay:', tenantsToDisplay);

  const getSummaryStats = () => {
    // let filtered = filteredTenants; // Remove date filtering for now
    return {
      activeFamilies: tenants.filter(t => t.subscription_status === 'active').length,
      totalFamilies: tenants.length,
      totalDevices: tenants.reduce((sum, t) => sum + (parseInt(t.device_count) || 0), 0),
    };
  };

  const summaryStats = getSummaryStats();

  const getStatusBadge = (status) => {
    const statusClasses = {
      Active: "bg-success text-white",
      Suspended: "bg-warning text-dark",
      Inactive: "bg-secondary text-white",
      "Trial Active": "bg-info text-white",
      "Trial": "bg-primary text-white",
      "Past Due": "bg-danger text-white",
    };
    return `badge ${statusClasses[status] || "bg-secondary text-white"}`;
  };

  const getPlanBadge = (plan) => {
    const planClasses = {
      Free: "bg-secondary text-white",
      Premium: "bg-gradient-primary text-white",
      Family: "bg-gradient-info text-white",
      Trial: "bg-gradient-warning text-dark",
    };
    return `badge ${planClasses[plan] || "bg-secondary text-white"}`;
  };

  const getDeviceStatusBadge = (status) => {
    const statusClasses = {
      Active: "bg-success",
      Inactive: "bg-secondary",
      Blocked: "bg-danger",
    };
    return `badge ${statusClasses[status] || "bg-secondary"}`;
  };

  const getDeviceIcon = (type) => {
    const icons = {
      Phone: <Smartphone size={16} />,
      Tablet: <Tablet size={16} />,
      Laptop: <Laptop size={16} />,
      TV: <Tv size={16} />,
    };
    return icons[type] || <Smartphone size={16} />;
  };

  const handleAddChild = () => {
    setNewFamily({
      ...newFamily,
      children: [...newFamily.children, { name: "", age: "", grade: "" }],
    });
  };

  const handleChildChange = (index, field, value) => {
    const updatedChildren = [...newFamily.children];
    updatedChildren[index][field] = value;
    setNewFamily({ ...newFamily, children: updatedChildren });
  };

  const handleRemoveChild = (index) => {
    if (newFamily.children.length <= 1) return;
    const updatedChildren = [...newFamily.children];
    updatedChildren.splice(index, 1);
    setNewFamily({ ...newFamily, children: updatedChildren });
  };

  // Secure random number generator function
  const getSecureRandomNumber = (min, max) => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return min + (array[0] % (max - min + 1));
  };

  const handleSubmitNewFamily = (e) => {
    e.preventDefault();
    
    const newFamilyObj = {
      id: tenants.length + 1,
      name: newFamily.familyName,
      familyCode: newFamily.familyName.substring(0, 2).toUpperCase() + getSecureRandomNumber(1000, 9999),
      parentEmail: newFamily.parentEmail,
      parentName: newFamily.parentName,
      address: newFamily.address,
      phoneNumber: newFamily.phoneNumber,
      childrenCount: newFamily.children.filter(c => c.name && c.age && c.grade).length,
      children: newFamily.children.filter(c => c.name && c.age && c.grade),
      devices: [],
      subscriptionPlan: newFamily.subscriptionPlan,
      status: "Active",
      joinDate: new Date().toISOString().split('T')[0],
      lastActivity: "Just now",
      paymentMethod: "Credit Card ****" + getSecureRandomNumber(1000, 9999),
      securityPin: getSecureRandomNumber(1000, 9999).toString(),
    };

    setTenants([...tenants, newFamilyObj]);
    setNewFamily({
      familyName: "",
      parentEmail: "",
      parentName: "",
      address: "",
      phoneNumber: "",
      subscriptionPlan: "Free",
      children: [{ name: "", age: "", grade: "" }],
    });
    setShowAddFamilyForm(false);
  };

  const handleSuspend = (tenantId) => {
    setTenants(tenants.map(tenant => 
      tenant.id === tenantId 
        ? { ...tenant, status: tenant.status === 'Suspended' ? 'Active' : 'Suspended' } 
        : tenant
    ));
  };

  const handleRemove = (tenantId) => {
    if (window.confirm('Are you sure you want to remove this family?')) {
      setTenants(tenants.filter(tenant => tenant.id !== tenantId));
      if (managedDeviceFamily && managedDeviceFamily.id === tenantId) {
        setManagedDeviceFamily(null);
      }
    }
  };

  const handleAddDevice = (e) => {
    e.preventDefault();
    if (!newDevice.name || !newDevice.macAddress) return;

    const updatedFamily = {
      ...managedDeviceFamily,
      devices: [
        ...managedDeviceFamily.devices,
        {
          id: managedDeviceFamily.devices.length + 1,
          ...newDevice,
          lastActive: "Just now"
        }
      ]
    };

    setTenants(tenants.map(t => t.id === managedDeviceFamily.id ? updatedFamily : t));
    setManagedDeviceFamily(updatedFamily);
    setNewDevice({
      name: "",
      type: "Phone",
      macAddress: "",
      status: "Active",
    });
  };

  const handleRemoveDevice = (deviceId) => {
    if (window.confirm('Are you sure you want to remove this device?')) {
      const updatedFamily = {
        ...managedDeviceFamily,
        devices: managedDeviceFamily.devices.filter(d => d.id !== deviceId)
      };

      setTenants(tenants.map(t => t.id === managedDeviceFamily.id ? updatedFamily : t));
      setManagedDeviceFamily(updatedFamily);
    }
  };

  const handleToggleDeviceStatus = (deviceId) => {
    const updatedFamily = {
      ...managedDeviceFamily,
      devices: managedDeviceFamily.devices.map(d => 
        d.id === deviceId 
          ? { ...d, status: d.status === "Active" ? "Inactive" : "Active" } 
          : d
      )
    };

    setTenants(tenants.map(t => t.id === managedDeviceFamily.id ? updatedFamily : t));
    setManagedDeviceFamily(updatedFamily);
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedFamily(null);
  };

  function calculateAge(birthdate) {
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  function calculateGrade(birthdate) {
    const age = calculateAge(birthdate);
    if (age < 5) return 'Pre-K';
    if (age === 5) return 'K';
    if (age > 18) return 'Graduated';
    return `${age - 5 + 1}`; // 1st grade at age 6, etc.
  }

  // Add global close overlays handler
  const closeAllOverlays = useCallback(() => {
    setSelectedFamily(null);
    setManagedDeviceFamily(null);
    setIsEditing(false);
  }, []);

  // Use ESC to close overlays
  useEscapeKey(() => {
    if (selectedFamily || managedDeviceFamily) closeAllOverlays();
  });

  // Only after all hooks, do early returns:
  if (loading) return <div>Loading tenants...</div>;
  if (error) return <div>Error: {error}</div>;

  // If we're in details view, show the details page
  if (view === "details" && selectedFamily) {
    console.log('Selected family:', selectedFamily);
    console.log('Children data:', childrenData);
    return (
      <div className="fade-in mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-secondary me-3"
              onClick={handleBackToList}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="h3 mb-0">Family Details</h1>
              <p className="text-muted mb-0">{selectedFamily.name}</p>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setIsEditing(true);
                setEditData(selectedFamily); // Pre-fill with current data
              }}
            >
              <Edit size={16} className="me-2" />
              Edit Details
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={async () => {
                if (window.confirm("Are you sure you want to delete this family? This action cannot be undone.")) {
                  try {
                    await deleteTenant(selectedFamily.id);
                    alert("Family deleted successfully.");
                    setView("list");
                    setSelectedFamily(null);
                    // Optionally, refresh the tenants list:
                    setTenants(tenants.filter(t => t.id !== selectedFamily.id));
                  } catch (err) {
                    alert("Failed to delete family. Please try again.");
                  }
                }
              }}
            >
              <Trash2 size={16} className="me-2" />
              Delete Family
            </button>
          </div>
        </div>

        {isEditing ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              console.log("Payload to backend:", editData);
              try {
                await updateTenant(selectedFamily.id, editData);
                alert("Family details updated successfully.");
                setSelectedFamily({ ...selectedFamily, ...editData });
                setIsEditing(false);
                // Optionally, update the tenants list as well
                setTenants(tenants.map(t => t.id === selectedFamily.id ? { ...t, ...editData } : t));
              } catch (err) {
                alert("Failed to update family details. Please try again.");
              }
            }}
          >
            <div className="mb-2">
              <label htmlFor="FamilyName">Family Name:</label>
              <input
                type="text"
                value={editData.name || ""}
                onChange={e => setEditData({ ...editData, name: e.target.value })}
                className="form-control"
              />
            </div>
            {/* Add more fields as needed, matching your backend payload */}
            <button type="submit" className="btn btn-success me-2">Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        ) : (
          <div className="d-flex flex-wrap gap-3 justify-content-center my-4">
            <div className="card shadow-sm border-0" style={{ minWidth: 260, maxWidth: 320 }}>
              <div className="card-body d-flex align-items-center">
                <User className="me-3 text-primary" size={28} />
                <div>
                  <div className="fw-bold">Family Name:</div>
                  <div className="fs-5 text-primary">{selectedFamily.name || "N/A"}</div>
                </div>
                </div>
              </div>
            <div className="card shadow-sm border-0" style={{ minWidth: 260, maxWidth: 320 }}>
              <div className="card-body d-flex align-items-center">
                <Users className="me-3 text-info" size={28} />
                <div>
                  <div className="fw-bold">User Count:</div>
                  <div className="fs-5">{selectedFamily.user_count || "N/A"}</div>
            </div>
                </div>
                  </div>
            <div className="card shadow-sm border-0" style={{ minWidth: 260, maxWidth: 320 }}>
              <div className="card-body d-flex align-items-center">
                <Smartphone className="me-3 text-success" size={28} />
                <div>
                  <div className="fw-bold">Device Count:</div>
                  <div className="fs-5">{selectedFamily.device_count || "N/A"}</div>
                    </div>
                  </div>
                    </div>
            <div className="card shadow-sm border-0" style={{ minWidth: 260, maxWidth: 320 }}>
              <div className="card-body d-flex align-items-center">
                <Calendar className="me-3 text-warning" size={28} />
                <div>
                  <div className="fw-bold">Created At:</div>
                  <div className="fs-5">{selectedFamily.created_at ? new Date(selectedFamily.created_at).toLocaleString() : "N/A"}</div>
                  </div>
              </div>
            </div>
            <div className="card shadow-sm border-0" style={{ minWidth: 260, maxWidth: 320 }}>
              <div className="card-body d-flex align-items-center">
                <CreditCard className="me-3 text-danger" size={28} />
                <div>
                  <div className="fw-bold">Payment Method:</div>
                  <div className="fs-5">{selectedFamily.paymentMethod || "N/A"}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Children Table */}
        <div className="card mb-4 mt-4">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Children & Devices</h5>
            <span className="badge bg-info">
              {childrenData.reduce((acc, child) => acc + (child.devices?.length || 0), 0)} Devices
            </span>
          </div>
          <div className="card-body p-0">
            {loadingChildren ? (
              <div className="text-center p-4">Loading...</div>
            ) : childrenError ? (
              <div className="text-center text-danger p-4">{childrenError}</div>
            ) : (
            <div className="advanced-table-container">
              <table className="advanced-table table table-hover mb-0">
                <thead>
                  <tr>
                    <th className="border-0">Name</th>
                    <th className="border-0">Device Name</th>
                    <th className="border-0">Device Type</th>
                  </tr>
                </thead>
                <tbody>
                    {Array.isArray(childrenData) && childrenData.length > 0 ? (
                      childrenData.map((child, childIdx) =>
                        (child.devices && child.devices.length > 0
                          ? child.devices
                          : [{ name: 'No Device', type: '-' }]
                        ).map((device, idx) => (
                          <tr key={child.id + '-' + (device.id || idx)}
                            style={{ background: (childIdx + idx) % 2 === 0 ? '#fff' : '#f3f4f6', height: 56 }}>
                            {idx === 0 && (
                              <td rowSpan={child.devices?.length || 1} style={{ verticalAlign: 'middle', fontWeight: 500 }}>{child.name}</td>
                            )}
                            {idx !== 0 && null}
                            <td>{device.name}</td>
                            <td>{device.type}</td>
                          </tr>
                        ))
                      )
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center text-muted py-4">
                          <span className="d-flex flex-column align-items-center">
                            <span style={{ fontSize: '1.5rem', marginBottom: 8 }}>👶</span>
                            <span>No children found for this family.</span>
                          </span>
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>

        {/* Devices Section - Full Width */}
        {/* <div className="card mt-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">Connected Devices</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Type</th>
                    <th>MAC Address</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFamily.devices?.map((device) => (
                    <tr key={device.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="me-2">
                            {getDeviceIcon(device.type)}
                          </span>
                          <span>{device.name}</span>
                        </div>
                      </td>
                      <td>{device.type}</td>
                      <td>{device.macAddress}</td>
                      <td>
                        <span className={getDeviceStatusBadge(device.status)}>
                          {device.status}
                        </span>
                      </td>
                      <td>{device.lastActive}</td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-primary">
                            <Edit size={14} />
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div> */}
      </div>
    );
  }

  // If we're in add family view, show the form page
  if (view === "add" && showAddFamilyForm) {
    return (
      <div className="fade-in">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-secondary me-3"
              onClick={() => {
                setView("list")
                setShowAddFamilyForm(false)
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="h3 mb-0">Add New Family</h1>
              <p className="text-muted mb-0">Create a new family account</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmitNewFamily}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="name">Family Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newFamily.familyName}
                    onChange={(e) => setNewFamily({ ...newFamily, familyName: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="parentname">Parent Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newFamily.parentName}
                    onChange={(e) => setNewFamily({ ...newFamily, parentName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="pemail">Parent Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newFamily.parentEmail}
                    onChange={(e) => setNewFamily({ ...newFamily, parentEmail: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="pn">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={newFamily.phoneNumber}
                    onChange={(e) => setNewFamily({ ...newFamily, phoneNumber: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label"htmlFor="address">Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={newFamily.address}
                  onChange={(e) => setNewFamily({ ...newFamily, address: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="subplan">Subscription Plan</label>
                <select
                  className="form-select"
                  value={newFamily.subscriptionPlan}
                  onChange={(e) => setNewFamily({ ...newFamily, subscriptionPlan: e.target.value })}
                >
                  <option value="Free">Free</option>
                  <option value="Family">Family</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Children</h5>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleAddChild}
                  >
                    <Plus size={16} className="me-1" />
                    Add Child
                  </button>
                </div>

                {newFamily.children.map((child, index) => (
                  <div key={index} className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Child {index + 1}</h6>
                        {newFamily.children.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveChild(index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label className="form-label" htmlFor="name" >Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={child.name}
                            onChange={(e) => handleChildChange(index, "name", e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label" htmlFor="age">Age</label>
                          <input
                            type="number"
                            className="form-control"
                            value={child.age}
                            onChange={(e) => handleChildChange(index, "age", e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label" htmlFor="grade">Grade</label>
                          <input
                            type="text"
                            className="form-control"
                            value={child.grade}
                            onChange={(e) => handleChildChange(index, "grade", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setView("list")
                    setShowAddFamilyForm(false)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Family
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Main list view
  return (
    <div className="fade-in">
      {/* Fixed Header: title, description, and filter bar */}
      <div className=" shadow-sm mt-5 mb-0">
  {/* Filter Bar */}
        <div className="filter-bar-container bg-white rounded-4 p-3 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          
          {/* Right: Search */}
          <div className="input-group" style={{ minWidth: 250, maxWidth: 300 }}>
            <span className="input-group-text bg-light border-0">
              <Search size={16} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-0 bg-light"
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="btn btn-light border-0" onClick={() => setSearchTerm("")}>
                <X size={16} className="text-muted" />
              </button>
            )}
          </div>

          {/* Left: Filters */}
          <div className="d-flex flex-wrap align-items-center gap-3">
            <label className="fw-bold mb-0 me-2" htmlFor="filter">Filter</label>

            <select
              className="form-select form-select-sm w-auto"
              value={timePeriod}
              onChange={e => setTimePeriod(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Date</option>
            </select>

            {timePeriod === 'custom' && (
              <DatePicker
                selectsRange
                startDate={customStartDate}
                endDate={customEndDate}
                onChange={update => setCustomDateRange(update)}
                isClearable={true}
                className="form-control form-control-sm w-auto"
                placeholderText="Select date range"
                maxDate={new Date()}
              />
            )}

            <select
              className="form-select form-select-sm w-auto"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Status/Loading */}
            <div className="d-flex align-items-center gap-2 ms-2">
              {tableLoading ? (
                <div className="d-flex align-items-center gap-2">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span className="text-muted small">Updating data...</span>
                </div>
              ) : (
                <>
                  {timePeriod === 'custom' && customStartDate && customEndDate ? (
                    <div className="text-muted small">
                      Showing data from <b>{customStartDate.toLocaleDateString()}</b> to <b>{customEndDate.toLocaleDateString()}</b>
                    </div>
                  ) : (
                    <div className="badge bg-primary text-white px-3 py-2">
                      <Calendar size={14} className="me-1" />
                      {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} View
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      
      <div style={{ marginTop: window.innerWidth < 600 ? 20 : 20 }} /> {/* Adjust this value to match the new header height */}

      {/* Summary Cards */}
      <div className="row mb-4" style={{ marginTop: 24 }}>
        <div className="col-md-4">
          <div className="card text-center shadow-sm border-0 position-relative" style={{ background: '#22c55e', color: '#fff', borderRadius: 16 }}>
            {tableLoading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(34, 197, 94, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                borderRadius: 16
              }}>
                <div className="spinner-border spinner-border-sm text-white" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <div className="card-body">
              <Users2 size={32} className="mb-2" color="#fff" />
              <h6 className="fw-bold mb-1" style={{ color: '#fff' }}>Active Families</h6>
              <div className="fs-3 mb-1" style={{ color: '#fff' }}>{summaryStats.activeFamilies}</div>
              <span className="badge bg-light text-success">Active</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm border-0 position-relative" style={{ background: '#3b82f6', color: '#fff', borderRadius: 16 }}>
            {tableLoading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(59, 130, 246, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                borderRadius: 16
              }}>
                <div className="spinner-border spinner-border-sm text-white" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <div className="card-body">
              <Users size={32} className="mb-2" color="#fff" />
              <h6 className="fw-bold mb-1" style={{ color: '#fff' }}>Total Families</h6>
              <div className="fs-3 mb-1" style={{ color: '#fff' }}>{summaryStats.totalFamilies}</div>
              <span className="badge bg-light text-primary">Total</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm border-0 position-relative" style={{ background: '#a21caf', color: '#fff', borderRadius: 16 }}>
            {tableLoading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(162, 28, 175, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                borderRadius: 16
              }}>
                <div className="spinner-border spinner-border-sm text-white" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <div className="card-body">
              <Smartphone size={32} className="mb-2" color="#fff" />
              <h6 className="fw-bold mb-1" style={{ color: '#fff' }}>Total Devices</h6>
              <div className="fs-3 mb-1" style={{ color: '#fff' }}>{summaryStats.totalDevices}</div>
              <span className="badge bg-light " style={{ color: '#a21caf' }}>Devices</span>
            </div>
          </div>
        </div>
      </div>

      {/* After metrics cards, add extra margin before table controls */}
      <div style={{ marginBottom: 24 }} />

      

      {/* Family Details Modal */}
      {selectedFamily && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay mt-5 pt-5"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelectedFamily(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="modal-content bg-white rounded-3 p-4 mt-5"
            style={{ width: "90%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <div
                  className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: "50px", height: "50px "}}
                >
                  <span className="text-white fw-bold fs-4">
                    {selectedFamily.name ? selectedFamily.name.charAt(0) : ""}
                  </span>
                </div>
                <div>
                  <h3 className="mb-0">{selectedFamily.name || "No Name"}</h3>
                  <small className="text-muted">Family Code: {selectedFamily.familyCode}</small>
                </div>
              </div>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSelectedFamily(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">Parent Information</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-2"><User className="me-2" size={16} /><strong>Family Name:</strong></div>
                    <p className="mb-2">{selectedFamily.name || "N/A"}</p>
                    <div className="mb-2"><Users className="me-2" size={16} /><strong>User Count:</strong></div>
                    <p className="mb-2">{selectedFamily.user_count || "N/A"}</p>
                    <div className="mb-2"><Smartphone className="me-2" size={16} /><strong>Device Count:</strong></div>
                    <p className="mb-2">{selectedFamily.device_count || "N/A"}</p>
                    <div className="mb-2"><Calendar className="me-2" size={16} /><strong>Created At:</strong></div>
                    <p className="mb-2">{selectedFamily.created_at ? new Date(selectedFamily.created_at).toLocaleString() : "N/A"}</p>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">Subscription Details</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <span className={getPlanBadge(selectedFamily.subscriptionPlan)}>
                        {selectedFamily.subscriptionPlan}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <CreditCard className="me-2" size={16} />
                        <strong>Security PIN:</strong>
                      </div>
                      <p>{selectedFamily.securityPin}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card mb-4">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Children & Devices</h5>
                    <span className="badge bg-info">
                      {childrenData.reduce((acc, child) => acc + (child.devices?.length || 0), 0)} Devices
                    </span>
                  </div>
                  <div className="card-body p-0">
                    {loadingChildren ? (
                      <div className="text-center p-4">Loading...</div>
                    ) : childrenError ? (
                      <div className="text-center text-danger p-4">{childrenError}</div>
                    ) : (
                      <div className="advanced-table-container">
                        <table className="advanced-table table table-hover mb-0">
                          <thead>
                            <tr>
                              <th className="border-0">Name</th>
                              <th className="border-0">Device Name</th>
                              <th className="border-0">Device Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(childrenData) && childrenData.length > 0 ? (
                              childrenData.map((child, childIdx) =>
                                (child.devices && child.devices.length > 0
                                  ? child.devices
                                  : [{ name: 'No Device', type: '-' }]
                                ).map((device, idx) => (
                                  <tr key={child.id + '-' + (device.id || idx)}
                                    style={{ background: (childIdx + idx) % 2 === 0 ? '#fff' : '#f3f4f6', height: 56 }}>
                                    {idx === 0 && (
                                      <td rowSpan={child.devices?.length || 1} style={{ verticalAlign: 'middle', fontWeight: 500 }}>{child.name}</td>
                                    )}
                                    {idx !== 0 && null}
                                    <td>{device.name}</td>
                                    <td>{device.type}</td>
                                  </tr>
                                ))
                              )
                            ) : (
                              <tr>
                                <td colSpan={3} className="text-center text-muted py-4">
                                  <span className="d-block mb-2" style={{ fontSize: '1.5rem' }}>👶</span>
                                  <span>No children found for this family. </span>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">Devices</h5>
                  </div>
                  <div className="card-body">
                    {selectedFamily.devices?.map((device) => (
                      <div key={device.id} className="mb-3 pb-3 border-bottom">
                        <div className="d-flex align-items-center mb-2">
                          <span className="me-2">
                            {getDeviceIcon(device.type)}
                          </span>
                          <div>
                            <h6 className="mb-0">{device.name}</h6>
                            <small className="text-muted">{device.macAddress}</small>
                          </div>
                          <span className={`ms-auto ${getDeviceStatusBadge(device.status)}`}>
                            {device.status}
                          </span>
                        </div>
                        <small className="text-muted">
                          Last active: {device.lastActive}
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Device Management Panel */}
      {managedDeviceFamily && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="device-management-panel"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "400px",
            backgroundColor: "white",
            zIndex: 999,
            boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
            overflowY: "auto",
          }}
        >
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">
                <Smartphone className="me-2" size={20} />
                {managedDeviceFamily.name} Devices
              </h4>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setManagedDeviceFamily(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Add New Device</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddDevice}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="device name">Device Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newDevice.name}
                      onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="devicetype">Device Type</label>
                    <select
                      className="form-select"
                      value={newDevice.type}
                      onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                    >
                      <option value="Phone">Phone</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Laptop">Laptop</option>
                      <option value="TV">TV</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="Mac address">MAC Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newDevice.macAddress}
                      onChange={(e) => setNewDevice({ ...newDevice, macAddress: e.target.value })}
                      required
                      placeholder="00:1A:2B:3C:4D:5E"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="status">Status</label>
                    <select
                      className="form-select"
                      value={newDevice.status}
                      onChange={(e) => setNewDevice({ ...newDevice, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    <Plus size={16} className="me-2" />
                    Add Device
                  </button>
                </form>
              </div>
            </div>

            <div className="card">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Registered Devices</h5>
                <span className="badge bg-primary">
                  {managedDeviceFamily.devices?.length || 0} Devices
                </span>
              </div>
              <div className="card-body">
                {managedDeviceFamily.devices?.length > 0 ? (
                  <div className="list-group">
                    {managedDeviceFamily.devices.map((device) => (
                      <div key={device.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <span className="me-3">
                              {getDeviceIcon(device.type)}
                            </span>
                            <div>
                              <h6 className="mb-0">{device.name}</h6>
                              <small className="text-muted">{device.macAddress}</small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className={getDeviceStatusBadge(device.status) + " me-2"}>
                              {device.status}
                            </span>
                            <div className="dropdown">
                              <button
                                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <MoreVertical size={14} />
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleToggleDeviceStatus(device.id)}
                                  >
                                    {device.status === "Active" ? (
                                      <>
                                        <Pause size={14} className="me-2" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <Check size={14} className="me-2" />
                                        Activate
                                      </>
                                    )}
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() => handleRemoveDevice(device.id)}
                                  >
                                    <Trash2 size={14} className="me-2" />
                                    Remove
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">
                            Last active: {device.lastActive}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Wifi size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">No devices registered</h5>
                    <p className="text-muted">
                      Add devices to manage their access
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add global close overlays button (visible if any overlay is open) */}
      {(selectedFamily || managedDeviceFamily) && (
        <button
          style={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 2000,
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          onClick={closeAllOverlays}
        >
          Close All Overlays
        </button>
      )}

      {/* Tenants Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="card border-0 shadow-sm"
      >
        <div className="card-header bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Tenant Details</h5>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setView("add");
                  setShowAddFamilyForm(true);
                }}
              >
                <Plus size={16} className="me-2" />
                Add Family
              </button>
            </div>
          </div>
        </div>

        {/* Table Controls: Status Filter & Search Bar */}
      
        
        {/* Loading and Status Display */}
        {/* <div className="mb-3 d-flex align-items-center gap-2 px-3 pt-3">
          {tableLoading && (
            <div className="d-flex align-items-center gap-2">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="text-muted small">Updating data...</span>
            </div>
          )}
          {!tableLoading && (
            <>
              {timePeriod === 'custom' && customStartDate && customEndDate ? (
                <div className="text-muted small">
                  Showing data from <b>{customStartDate.toLocaleDateString()}</b> to <b>{customEndDate.toLocaleDateString()}</b>
                </div>
              ) : (
                <div className="badge bg-primary text-white px-3 py-2">
                  <Calendar size={14} className="me-1" />
                  {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} View
                </div>
              )}
            </>
          )}
        </div> */}
        
        <div className="card-body p-0 position-relative">
                      <div className="advanced-table-container table-responsive">
              <table className="advanced-table table table-hover align-middle mb-0">
                <thead className="bg-light  custom-sticky-thead">
                  <tr>
                    <th className="border-0">Family</th>
                    <th className="border-0">Plan</th>
                    <th className="border-0">Status</th>
                    <th className="border-0">Users</th>
                    <th className="border-0">Devices</th>
                    <th className="border-0">Created</th>
                  </tr>
                </thead>
              <tbody>
                {filteredTenants.length > 0 ? (
                  filteredTenants.map((tenant, index) => (
                    <motion.tr
                      key={tenant.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                      className="position-relative cursor-pointer"
                      style={{ 
                        background: index % 2 === 0 ? '#fff' : '#f8f9fa',
                        height: 64,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e3f2fd';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? '#fff' : '#f8f9fa';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                      onClick={() => {
                        setSelectedFamily(tenant);
                        setView("details");
                      }}
                    >
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <span className="text-primary fw-bold">{tenant.name ? tenant.name.charAt(0) : ""}</span>
                          </div>
                          <div>
                            <div className="fw-medium">{tenant.name || "No Name"}</div>
                            {/* <small className="text-muted">{tenant.familyCode || "N/A"}</small> */}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={getPlanBadge(tenant.plan_name)}>{tenant.plan_name || 'N/A'}</span>
                      </td>
                      <td>
                        <span className={getStatusBadge(tenant.subscription_status)}>{tenant.subscription_status || 'N/A'}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Users size={16} className="me-2 text-muted" />
                          <span className="fw-medium">{tenant.user_count || 0}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Smartphone size={16} className="me-2 text-muted" />
                          <span className="fw-medium">{tenant.device_count || 0}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={16} className="me-2 text-muted" />
                          <span className="fw-medium">{tenant.created_at ? new Date(tenant.created_at).toLocaleDateString() : "N/A"}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                          <Search size={32} className="text-muted" />
                        </div>
                        <h5 className="text-muted mb-2">No tenants found</h5>
                        <p className="text-muted mb-0">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
                {searchLoading && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="text-muted">Searching...</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-white rounded-4 shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <label className="me-2 mb-0 small">Show</label>
          <select
            className="form-select form-select-sm w-auto"
            value={limit}
            onChange={e => {
              setLimit(Number(e.target.value));
              setPage(1); // Reset to first page when limit changes
            }}
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="ms-2 small">per page</span>
        </div>
        <div className="text-muted small">
          Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalTenants)} of {totalTenants} tenants
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="mx-2">{page}</span>
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantManagement;
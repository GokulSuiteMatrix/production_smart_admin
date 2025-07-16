

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  CreditCard,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  X,
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Shield,
  Check,
  Search,
  Filter,
  Pause,
  Plus,
  Users,
  Smartphone,
  MoreVertical,
  Mail,
  Wifi,
  Tablet,
  Laptop,
  Tv,
  FileText,
  FileSpreadsheet,
  Users2,
  LineChart,
} from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from 'jspdf-autotable'
import DatePicker from "react-datepicker"
import { fetchSubscriptions } from "../../../api/subscriptions"
import { searchTenantsByFamilyName } from "../../../api/tenants"

const PLAN_FEATURES = {
  Premium: [
    "Unlimited Devices",
    "Priority Support",
    "Advanced Analytics",
    "Parental Controls",
    "Custom Alerts",
    "Family Sharing"
  ],
  Family: [
    "Up to 10 Devices",
    "Standard Support",
    "Basic Analytics",
    "Parental Controls"
  ],
  Basic: [
    "Up to 3 Devices",
    "Email Support",
    "Basic Analytics"
  ]
  // Add more plans as needed
};

const Subscriptions = () => {
  const [selectedPlan, setSelectedPlan] = useState("all")
  const [selectedSubscription, setSelectedSubscription] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  })
  const [view, setView] = useState("list")
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [timePeriod, setTimePeriod] = useState("yearly");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);

  const handlePaymentChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    // Add your payment update logic here
    setShowPaymentModal(false)
    // Reset form
    setPaymentDetails({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      billingAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States"
    })
  }

  useEffect(() => {
    setLoading(true);
    fetchSubscriptions({
      page,
      limit,
      timePeriod,
      startDate: timePeriod === 'custom' && startDate ? startDate.toISOString().split('T')[0] : undefined,
      endDate: timePeriod === 'custom' && endDate ? endDate.toISOString().split('T')[0] : undefined,
    })
      .then(data => {
        setSubscriptions(data.subscriptions || []);
        if (data.pagination) {
          setTotalPages(data.pagination.total_pages);
          setTotalSubscriptions(data.pagination.total);
        } else {
          setTotalPages(1);
          setTotalSubscriptions(data.subscriptions ? data.subscriptions.length : 0);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, limit, timePeriod, startDate, endDate]);

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

  // Add a customStartDate and customEndDate for custom period
  useEffect(() => {
    setPage(1); // Reset to first page when filters change
  }, [timePeriod, startDate, endDate]);

  // Helper to check if a date is within the selected time period
  function isWithinTimePeriod(dateStr) {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    if (timePeriod === "weekly") {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return date >= weekAgo && date <= now;
    } else if (timePeriod === "monthly") {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    } else if (timePeriod === "yearly") {
      return date.getFullYear() === now.getFullYear();
    }
    return true;
  }

  // Combine all filters into one function
  const getFilteredSubscriptions = () => {
    return subscriptions.filter(sub => {
      // Search filter
      const searchTermLower = searchTerm.toLowerCase();
      let matchesSearch = true;
      if (searchTerm.trim() !== "") {
        if (searchResults.length > 0) {
          matchesSearch = searchResults.some(
            (tenant) =>
              tenant.name &&
              sub.family_name &&
              tenant.name.toLowerCase() === sub.family_name.toLowerCase()
          );
        } else if (!searchLoading) {
          matchesSearch =
            (sub.family_name && sub.family_name.toLowerCase().includes(searchTermLower)) ||
            (sub.plan && sub.plan.name && sub.plan.name.toLowerCase().includes(searchTermLower)) ||
            (sub.status && sub.status.toLowerCase().includes(searchTermLower)) ||
            (sub.payment_method && sub.payment_method.toLowerCase().includes(searchTermLower));
        }
      }

      // Plan filter (null/empty plan names are treated as 'N/A')
      let planName = sub.plan && sub.plan.name ? sub.plan.name.toLowerCase() : "n/a";
      let matchesPlan = selectedPlan === "all" || planName === selectedPlan;

      // Date range filter
      let matchesDateRange = true;
      if (startDate && endDate) {
        const subDate = new Date(sub.start_date);
        matchesDateRange = subDate >= startDate && subDate <= endDate;
      }

      // Time period filter
      let matchesTimePeriod = isWithinTimePeriod(sub.start_date);

      return matchesSearch && matchesPlan && matchesDateRange && matchesTimePeriod;
    });
  };

  const filteredSubscriptions = getFilteredSubscriptions();

  // Calculate statistics from filteredSubscriptions
  const totalRevenue = filteredSubscriptions.reduce((sum, sub) => sum + (Number(sub.amount) || 0), 0);
  const activeSubscriptions = filteredSubscriptions.filter(sub => sub.status && sub.status.toLowerCase() === 'active').length;
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const expiredThisMonth = filteredSubscriptions.filter(sub => {
    if (!sub.status || sub.status.toLowerCase() !== 'expired' || !sub.end_date) return false;
    const end = new Date(sub.end_date);
    return end.getMonth() === thisMonth && end.getFullYear() === thisYear;
  }).length;
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  const activeThisMonth = filteredSubscriptions.filter(sub => {
    if (!sub.start_date) return false;
    const start = new Date(sub.start_date);
    return start.getMonth() === thisMonth && start.getFullYear() === thisYear;
  }).length;
  const activeLastMonth = filteredSubscriptions.filter(sub => {
    if (!sub.start_date) return false;
    const start = new Date(sub.start_date);
    return start.getMonth() === lastMonth && start.getFullYear() === lastMonthYear;
  }).length;
  const growthRate = activeLastMonth === 0 ? 0 : (((activeThisMonth - activeLastMonth) / activeLastMonth) * 100).toFixed(2);

  // Function to export data as PDF
  const exportAsPDF = () => {
    try {
      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(16)
      doc.text('Subscription Report', 14, 15)
      doc.setFontSize(10)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22)
      
      // Prepare table data
      const tableData = filteredSubscriptions.map(sub => [
        sub.family_name,
        sub.plan && sub.plan.name ? sub.plan.name : "",
        sub.status,
        `$${sub.amount}`,
        sub.plan && sub.plan.billing_cycle ? sub.plan.billing_cycle : sub.billing_cycle || "",
        sub.next_billing,
        sub.payment_method,
        sub.plan && sub.plan.device_limit ? sub.plan.device_limit : "",
        sub.plan && Array.isArray(sub.plan.features)
          ? sub.plan.features.join(", ")
          : (sub.plan && typeof sub.plan.features === "object" && sub.plan.features !== null)
            ? Object.values(sub.plan.features).join(", ")
            : ""
      ])
      
      // Add table
      autoTable(doc, {
        head: [['Family', 'Plan', 'Status', 'Amount', 'Billing Cycle', 'Next Billing', 'Payment Method', 'Device Limit', 'Features']],
        body: tableData,
        startY: 30,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
        margin: { top: 30 }
      })
      
      // Save the PDF
      doc.save('subscription-report.pdf')
      setShowExportOptions(false)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  // Function to export data as CSV
  const exportAsCSV = () => {
    // Prepare headers
    const headers = ['Family', 'Plan', 'Status', 'Amount', 'Billing Cycle', 'Next Billing', 'Payment Method', 'Device Limit', 'Features']
    
    // Prepare data rows
    const csvData = filteredSubscriptions.map(sub => [
      sub.family_name,
      sub.plan && sub.plan.name ? sub.plan.name : "",
      sub.status,
      sub.amount,
      sub.plan && sub.plan.billing_cycle ? sub.plan.billing_cycle : sub.billing_cycle || "",
      sub.next_billing,
      sub.payment_method,
      sub.plan && sub.plan.device_limit ? sub.plan.device_limit : "",
      sub.plan && Array.isArray(sub.plan.features)
        ? sub.plan.features.join(", ")
        : (sub.plan && typeof sub.plan.features === "object" && sub.plan.features !== null)
          ? Object.values(sub.plan.features).join(", ")
          : ""
    ])
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'subscription-report.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowExportOptions(false)
  }

  // Export a single subscription as PDF
  const exportSubscriptionAsPDF = (subscription) => {
    // Dynamically import jsPDF and autoTable
    import('jspdf').then(({ jsPDF }) => {
      import('jspdf-autotable').then((autoTableModule) => {
        const doc = new jsPDF();
        let y = 10;
        doc.setFontSize(16);
        doc.text('Subscription Report', 14, y);
        y += 8;
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, y);
        y += 8;
        // Subscription Information
        doc.setFontSize(12);
        doc.text('Subscription Information', 14, y);
        y += 6;
        doc.setFontSize(10);
        doc.text(`Family Name: ${subscription.family_name}`, 14, y); y += 6;
        doc.text(`Plan: ${subscription.plan}`, 14, y); y += 6;
        doc.text(`Start Date: ${subscription.start_date}`, 14, y); y += 6;
        doc.text(`Billing Cycle: ${subscription.billingCycle}`, 14, y); y += 6;
        doc.text(`Next Billing: ${subscription.next_billing}`, 14, y); y += 8;
        // Subscription Status
        doc.setFontSize(12);
        doc.text('Subscription Status', 14, y); y += 6;
        doc.setFontSize(10);
        doc.text(`Status: ${subscription.status}`, 14, y); y += 6;
        doc.text(`Stripe Subscription ID: ${subscription.stripeSubscriptionId || 'N/A'}`, 14, y); y += 6;
        doc.text(`Current Period End: ${subscription.currentPeriodEnd || 'N/A'}`, 14, y); y += 8;
        // Payment Details
        doc.setFontSize(12);
        doc.text('Payment Details', 14, y); y += 6;
        doc.setFontSize(10);
        doc.text(`Amount: $${subscription.amount}`, 14, y); y += 6;
        doc.text(`Payment Method: ${subscription.payment_method}`, 14, y); y += 8;
        doc.text(`Stripe Subscription ID: ${subscription.stripeSubscriptionId || 'N/A'}`, 14, y); y += 8;
        // Features
        doc.setFontSize(12);
        doc.text('Features', 14, y); y += 6;
        doc.setFontSize(10);
        {Array.isArray(subscription.features) && subscription.features.map((feature, idx) => (
          <li key={idx}>{feature}</li>
        ))}
        doc.save(`${subscription.family_name}-subscription-report.pdf`);
      });
    });
  };

  // Export a single subscription as CSV
  const exportSubscriptionAsCSV = (subscription) => {
    const lines = [
      'Subscription Report',
      `Generated on: ${new Date().toLocaleDateString()}`,
      '',
      'Subscription Information',
      `Family Name,${subscription.family_name}`,
      `Plan,${subscription.plan}`,
      `Start Date,${subscription.start_date}`,
      `Billing Cycle,${subscription.billingCycle}`,
      `Next Billing,${subscription.next_billing}`,
      '',
      'Subscription Status',
      `Status,${subscription.status}`,
      `Stripe Subscription ID,${subscription.stripeSubscriptionId || 'N/A'}`,
      `Current Period End,${subscription.currentPeriodEnd || 'N/A'}`,
      '',
      'Payment Details',
      `Amount,$${subscription.amount}`,
      `Payment Method,${subscription.payment_method}`,
      `Stripe Subscription ID,${subscription.stripeSubscriptionId || 'N/A'}`,
      '',
      'Features',
      ...(subscription.features || []).map((feature) => `Feature,${feature}`)
    ];
    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${subscription.family_name}-subscription-report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const planName = selectedSubscription?.plan?.name || "Basic";
  const features = PLAN_FEATURES[planName] || [];

  function getSubscriptionForTenant(tenantId) {
    return subscriptions.find(sub => sub.tenant_id === tenantId || sub.family_id === tenantId);
  }

  if (loading) return <div>Loading subscriptions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="fade-in">
      {/* Fixed Header: title, description, and filter bar (if any) */}
      
      
      {view === "list" && (
        <>
         <div className=" shadow-sm mt-5 mb-0 bg-white   rounded-4 p-2 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3" >
      <div className="mb-3 d-flex align-items-center gap-3">
        <label className="mb-0 fw-bold" htmlFor="filter">Filter</label>
                      <select
          className="form-select w-auto"
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
            startDate={startDate}
            endDate={endDate}
            onChange={update => setDateRange(update)}
            isClearable={true}
            className="form-control form-control-sm w-auto"
            placeholderText="Select date range"
            maxDate={new Date()}
          />
        )}
      </div>
      {/* Status/Loading */}
      <div className="d-flex align-items-center gap-2 ms-2">
        {loading ? (
          <div className="d-flex align-items-center gap-2">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="text-muted small">Updating data...</span>
          </div>
        ) : (
          <>
            {timePeriod === 'custom' && startDate && endDate ? (
              <div className="text-muted small">
                Showing data from <b>{startDate.toLocaleDateString()}</b> to <b>{endDate.toLocaleDateString()}</b>
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
        
        {/* If you have a filter bar, include it here */}
      </div>   
      
      <div style={{ marginTop: 20}} />
      {/* Statistics Cards */}
      <div className="row g-3 mb-4 ">
        <div className="col-md-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card h-100 border-0 shadow-lg" style={{ background: '#22c55e', color: '#fff', borderRadius: 16 }}>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.18)' }}>
                    <DollarSign size={28} color="#fff" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="fw-bold mb-1" style={{ color: '#fff' }}>Total Revenue</h6>
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0 me-2" style={{ color: '#fff' }}>${totalRevenue.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="col-md-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card h-100 border-0 shadow-lg" style={{ background: '#3b82f6', color: '#fff', borderRadius: 16 }}>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.18)' }}>
                    <Users2 size={28} color="#fff" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="fw-bold mb-1" style={{ color: '#fff' }}>Active Subscriptions</h6>
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0 me-2" style={{ color: '#fff' }}>{activeSubscriptions}</h3>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="col-md-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card h-100 border-0 shadow-lg" style={{ background: '#f59e0b', color: '#fff', borderRadius: 16 }}>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.18)' }}>
                    <AlertCircle size={28} color="#fff" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="fw-bold mb-1" style={{ color: '#fff' }}>Expired This Month</h6>
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0 me-2" style={{ color: '#fff' }}>{expiredThisMonth}</h3>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="col-md-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card h-100 border-0 shadow-lg" style={{ background: '#a21caf', color: '#fff', borderRadius: 16 }}>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.18)' }}>
                    <LineChart size={28} color="#fff" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="fw-bold mb-1" style={{ color: '#fff' }}>Growth Rate</h6>
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0 me-2" style={{ color: '#fff' }}>{growthRate}%</h3>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="card border-0 shadow-sm"
      >
        <div className="card-header bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Subscription Details</h5>
            <div className="d-flex gap-2">
              
              <div className="input-group gap-2">
              <div className="d-flex align-items-center gap-2 ">
                <label className="mb-0" htmlFor="filter by sd">Filter by Start Date:</label>
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  isClearable
                  className="form-control"
                  placeholderText="Select date range"
                />
              </div>
                
              <div className="d-flex gap-2">
                
                <select className="form-select" value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
                  <option value="all">All Plans</option>
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  <option value="family">Family</option>
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
                    <div className="dropdown-menu show" style={{ position: 'absolute', right: 0, top: '100%' }}>
                      <button 
                        className="dropdown-item" 
                        onClick={exportAsPDF}
                      >
                        <FileText size={16} className="me-2" />
                        Export as PDF
                      </button>
                      <button 
                        className="dropdown-item" 
                        onClick={exportAsCSV}
                      >
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
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
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
          
          <div className="advanced-table-container">
            <table className="advanced-table table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th className="border-0">Family</th>
                  <th className="border-0">Plan</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Amount</th>
                  <th className="border-0">Billing Cycle</th>
                  <th className="border-0">Next Billing</th>
                  <th className="border-0">Payment Method</th>
                  <th className="border-0">Features</th>
                  <th className="border-0">Device Limit</th>
                  <th className="border-0">Export</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.length > 0 ? (
                  filteredSubscriptions.map((sub, idx) => (
                    <tr
                      key={sub.id}
                      style={{ cursor: 'pointer', background: idx % 2 === 0 ? '#fff' : '#f3f4f6', height: 56 }}
                      onClick={() => {
                        setSelectedSubscription(sub);
                        setView("details");
                      }}
                    >
                      <td>{sub.family_name}</td>
                      <td>
                        <button type="button" className={`btn btn-sm text-white ${sub.plan?.name === 'Premium' ? 'bg-success' : sub.plan?.name === 'Family' ? 'bg-info' : 'bg-secondary'}`}
                          style={{ pointerEvents: 'none', minWidth: 90 }}>
                          {sub.plan?.name || "N/A"}
                        </button>
                      </td>
                      <td>
                        <button type="button" className={`btn btn-sm text-white ${sub.status === 'active' ? 'bg-success' : sub.status === 'past_due' ? 'bg-danger' : 'bg-secondary'}`}
                          style={{ pointerEvents: 'none', minWidth: 90 }}>
                          {sub.status || "N/A"}
                        </button>
                      </td>
                      <td>{sub.amount}</td>
                      <td>{sub.plan && sub.plan.billing_cycle ? sub.plan.billing_cycle : sub.billing_cycle || ""}</td>
                      <td>
                        {sub.next_billing
                          ? new Date(sub.next_billing).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit'
                            })
                          : 'N/A'}
                      </td>
                      <td>{sub.payment_method}</td>
                      <td>
                        {sub.plan && Array.isArray(sub.plan.features)
                          ? sub.plan.features.join(", ")
                          : (sub.plan && typeof sub.plan.features === "object" && sub.plan.features !== null)
                            ? Object.values(sub.plan.features).join(", ")
                            : ""}
                      </td>
                      <td>{sub.plan && sub.plan.device_limit ? sub.plan.device_limit : ""}</td>
                      <td>
                          <button
                          className="btn btn-link p-0 me-2"
                          title="Export as PDF"
                          onClick={(e) => {
                            e.stopPropagation();
                            exportSubscriptionAsPDF(sub);
                          }}
                        >
                          <FileText size={18} className="text-danger" />
                          </button>
                              <button
                          className="btn btn-link p-0"
                          title="Export as CSV"
                                onClick={(e) => {
                                  e.stopPropagation();
                            exportSubscriptionAsCSV(sub);
                                }}
                              >
                          <FileSpreadsheet size={18} className="text-success" />
                              </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <div className="d-flex flex-column align-items-center">
                        <Search size={32} className="text-muted mb-2" />
                        <h6 className="text-muted mb-1">No subscriptions found</h6>
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
          Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalSubscriptions)} of {totalSubscriptions} subscriptions
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
        </>
      )}
      {view === "details" && selectedSubscription && (
        <div className="mt-5">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => setView("list")}
          >
            <ArrowLeft size={20} className="me-2" />
            Back to List
          </button>
          <div className="row justify-content-center align-items-stretch my-4 gap-0">
            {/* Info Table Card */}
            <div className="col-12 col-md-6 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-primary text-white d-flex align-items-center">
                  <User className="me-2" size={22} />
                  <h5 className="mb-0">Subscription Details</h5>
              </div>
                <div className="card-body p-0">
                  <table className="table mb-0 align-middle">
                    <tbody>
                      <tr>
                        <th className="fw-bold">Family Name:</th>
                        <td>{selectedSubscription.family_name || "N/A"}</td>
                      </tr>
                      <tr>
                        <th className="fw-bold">Plan:</th>
                        <td>
                          <button type="button" className={`btn btn-sm text-white ${selectedSubscription.plan?.name === 'Premium' ? 'bg-success' : selectedSubscription.plan?.name === 'Family' ? 'bg-info' : 'bg-secondary'}`}
                            style={{ pointerEvents: 'none', minWidth: 90 }}>
                            {selectedSubscription.plan?.name || "N/A"}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-bold">Status:</th>
                        <td>
                          <button type="button" className={`btn btn-sm text-white ${selectedSubscription.status === 'active' ? 'bg-success' : selectedSubscription.status === 'past_due' ? 'bg-danger' : 'bg-secondary'}`}
                            style={{ pointerEvents: 'none', minWidth: 90 }}>
                            {selectedSubscription.status || "N/A"}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-bold">Amount:</th>
                        <td>${selectedSubscription.amount || "N/A"}</td>
                      </tr>
                      <tr>
                        <th className="fw-bold">Billing Cycle:</th>
                        <td>{selectedSubscription.billing_cycle || selectedSubscription.plan?.billing_cycle || "N/A"}</td>
                      </tr>
                      <tr>
                        <th className="fw-bold">Next Billing:</th>
                        <td>{selectedSubscription.next_billing ? new Date(selectedSubscription.next_billing).toLocaleString() : "N/A"}</td>
                      </tr>
                      <tr>
                        <th className="fw-bold">Device Limit:</th>
                        <td>{selectedSubscription.plan?.device_limit || "N/A"}</td>
                      </tr>
                      <tr>
                        <th className="fw-bold">Payment Method:</th>
                        <td>{selectedSubscription.payment_method || "N/A"}</td>
                      </tr>
                      <tr>
                        <th className="fw-bold">Stripe Subscription ID:</th>
                        <td><code className="bg-light px-2 py-1 rounded">{selectedSubscription.stripe_subscription_id || 'N/A'}</code></td>
                      </tr>
                    </tbody>
                  </table>
            </div>
            </div>
          </div>
            {/* Features Table Card */}
            <div className="col-12 col-md-6 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-success text-white d-flex align-items-center">
                  <CheckCircle className="me-2" size={22} />
                  <h5 className="mb-0">Plan Features</h5>
        </div>
                <div className="card-body p-0">
                  <table className="table mb-0 align-middle">
                    <tbody>
                      {(() => {
                        const planName = selectedSubscription.plan?.name;
                        const features = PLAN_FEATURES[planName] || [];
                        return features.length > 0 ? (
                          features.map((feature, idx) => (
                            <tr key={idx}>
                              <td className="text-success"><CheckCircle size={16} className="me-2" /></td>
                              <td>{feature}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="2" className="text-muted">No features listed.</td></tr>
                        );
                      })()}
                    </tbody>
                  </table>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Subscriptions
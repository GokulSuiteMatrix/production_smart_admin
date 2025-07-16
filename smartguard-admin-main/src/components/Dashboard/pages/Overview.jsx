"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import {
  Users,
  Smartphone,
  CreditCard,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  UserPlus,
  Settings,
  ShieldCheck,
  Activity as ActivityIcon,
  Trash2,
  RefreshCw,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Overview.css";
import { fetchDashboardStats, fetchGrowthRate, fetchRecentActivity, fetchFamilyGrowth, fetchSubscriptionDistribution, fetchDeviceCounts } from "../../../api/dashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement
);

const Overview = () => {
  // State for dashboard stats
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for growth rate data
  const [growthRateData, setGrowthRateData] = useState(null);
  const [growthRateLoading, setGrowthRateLoading] = useState(true);
  const [growthRateError, setGrowthRateError] = useState(null);

  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState(null);
  // State for recent activity
  const [recentActivity, setRecentActivity] = useState([]);
  const [recentActivityLoading, setRecentActivityLoading] = useState(true);
  const [recentActivityError, setRecentActivityError] = useState(null);

  // State for family growth data
  const [familyGrowthData, setFamilyGrowthData] = useState(null);
  const [familyGrowthLoading, setFamilyGrowthLoading] = useState(true);
  const [familyGrowthError, setFamilyGrowthError] = useState(null);

  // State for subscription distribution
  const [subscriptionData, setSubscriptionData] = useState([]);

  // State for showing all activities
  const [showAllActivities, setShowAllActivities] = useState(false);

  // Main filter state - this will control all sections
  const [overviewFilter, setOverviewFilter] = useState('monthly');
  const [customDateRange, setCustomDateRange] = useState([null, null]);
  const [customStartDate, customEndDate] = customDateRange;
  
  // Loading state for filter changes
  const [filterLoading, setFilterLoading] = useState(false);

  // Add mock device data at the top of the component if not available
  const mockDevices = [
    { type: 'Android', status: 'Active' },
    { type: 'Android', status: 'Inactive' },
    { type: 'Windows', status: 'Active' },
    { type: 'Android', status: 'Active' },
    { type: 'Windows', status: 'Inactive' },
  ];

  // State for device counts
  const [deviceCounts, setDeviceCounts] = useState({ android: 0, ios: 0, other: 0 });
  const [deviceCountsLoading, setDeviceCountsLoading] = useState(true);
  const [deviceCountsError, setDeviceCountsError] = useState(null);

  // Helper function to get the time period for API calls
  const getTimePeriodForAPI = () => {
    if (overviewFilter === 'custom' && customStartDate && customEndDate) {
      return 'custom';
    }
    return overviewFilter;
  };

  // Helper function to get the time period and dates for API calls
  const getTimePeriodAndDates = () => {
    if (overviewFilter === 'custom' && customStartDate && customEndDate) {
      return {
        period: 'custom',
        start_date: customStartDate.toISOString().split('T')[0],
        end_date: customEndDate.toISOString().split('T')[0],
      };
    }
    return { period: overviewFilter };
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      const { period, start_date, end_date } = getTimePeriodAndDates();
      const data = await fetchDashboardStats(period, start_date, end_date);
      // Transform API data to match the stats format
      const transformedStats = [
        {
          title: "Total Families",
          value: data.totalFamilies?.toString() || "0",
          change: data.growthRate ? `+${data.growthRate}%` : "+0%",
          icon: Users,
          color: "primary",
          trend: "up",
        },
        {
          title: "Connected Devices",
          value: data.connectedDevices?.toString() || "0",
          change: data.monthlyGrowth ? `+${data.monthlyGrowth}%` : "+0%",
          icon: Smartphone,
          color: "success",
          trend: "up",
        },
        {
          title: "Active Subscriptions",
          value: data.activeSubscriptions?.toString() || "0",
          change: data.growthRate ? `+${data.growthRate}%` : "+0%",
          icon: CreditCard,
          color: "info",
          trend: "up",
        },
        {
          title: "Pending Alerts",
          value: data.pendingAlerts?.toString() || "0",
          change: "0%",
          icon: AlertTriangle,
          color: "warning",
          trend: "down",
        },
      ];
      setStats(transformedStats);
    } catch (err) {
      setError(err.message);
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch growth rate data
  const getGrowthRate = async () => {
    try {
      setGrowthRateLoading(true);
      const { period, start_date, end_date } = getTimePeriodAndDates();
      console.log('Fetching Growth Rate:', { period, start_date, end_date });
      const data = await fetchGrowthRate(period, start_date, end_date);
      setGrowthRateData(data);
    } catch (err) {
      setGrowthRateError(err.message);
    } finally {
      setGrowthRateLoading(false);
    }
  };

  // Fetch recent activity data
  const getRecentActivity = async () => {
    try {
      setRecentActivityLoading(true);
      // No custom date support for recent activity in API, keep as is
      const timePeriod = getTimePeriodForAPI();
      const data = await fetchRecentActivity(timePeriod);
      setRecentActivity(data.activities || data);
    } catch (err) {
      setRecentActivityError(err.message);
    } finally {
      setRecentActivityLoading(false);
    }
  };

  // Fetch family growth data
  const getFamilyGrowth = async () => {
    try {
      setFamilyGrowthLoading(true);
      const { period, start_date, end_date } = getTimePeriodAndDates();
      console.log('Fetching Family Growth:', { period, start_date, end_date });
      const data = await fetchFamilyGrowth(period, start_date, end_date);
      setFamilyGrowthData(data);
    } catch (err) {
      setFamilyGrowthError(err.message);
    } finally {
      setFamilyGrowthLoading(false);
    }
  };

  // Fetch subscription distribution data
  const getSubscriptionDistribution = async () => {
    try {
      setSubscriptionLoading(true);
      const { period, start_date, end_date } = getTimePeriodAndDates();
      console.log('Fetching Subscription Distribution:', { period, start_date, end_date });
      const data = await fetchSubscriptionDistribution(period, start_date, end_date);
      setSubscriptionData(data);
    } catch (err) {
      setSubscriptionError(err.message);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Effect to refetch all data when filter changes
  useEffect(() => {
    const refetchAllData = async () => {
      setFilterLoading(true);
      try {
        await Promise.all([
          fetchStats(),
          getGrowthRate(),
          getRecentActivity(),
          getFamilyGrowth(),
          getSubscriptionDistribution()
        ]);
      } finally {
        setFilterLoading(false);
      }
    };
    
    refetchAllData();
  }, [overviewFilter, customStartDate, customEndDate]);

  useEffect(() => {
    const getDeviceCounts = async () => {
      setDeviceCountsLoading(true);
      try {
        const data = await fetchDeviceCounts();
        setDeviceCounts(data.device_counts || { android: 0, ios: 0, other: 0 });
      } catch (err) {
        setDeviceCountsError(err.message);
        setDeviceCounts({ android: 0, ios: 0, other: 0 });
      } finally {
        setDeviceCountsLoading(false);
      }
    };
    getDeviceCounts();
  }, []);

  // Function to generate chart data based on time period
 

  // Function to get icon component based on activity type or icon string
  const getActivityIcon = (type, icon) => {
    const iconKey = (icon || type || '').toLowerCase();
    const iconMap = {
      registration: UserPlus,
      insert: UserPlus,
      update: RefreshCw,
      delete: Trash2,
      alert: AlertTriangle,
      security: ShieldCheck,
      shield: ShieldCheck,
      subscription: CreditCard,
      device: Smartphone,
      smartphone: Smartphone,
      settings: Settings,
      clock: Clock,
      time: Clock,
      activity: ActivityIcon,
    };
    return iconMap[iconKey] || ActivityIcon;
  };

  // Function to get color based on activity type
  const getActivityColor = (type) => {
    const colorMap = {
      'registration': 'bg-green-100 text-green-800',
      'block': 'bg-red-100 text-red-800',
      'screentime': 'bg-yellow-100 text-yellow-800',
      'subscription': 'bg-blue-100 text-blue-800',
      'alert': 'bg-purple-100 text-purple-800',
      'setting': 'bg-gray-100 text-gray-800',
      'activity': 'bg-indigo-100 text-indigo-800',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  };

  const getFamilyGrowthChartData = () => {
    if (
      !familyGrowthData ||
      !familyGrowthData.labels ||
      !familyGrowthData.newFamilies ||
      !familyGrowthData.activeFamilies
    ) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            label: "New Families",
            data: [0],
            borderColor: "#6366f1",
            backgroundColor: "#6366f1",
            tension: 0.4,
          },
          {
            label: "Active Families",
            data: [0],
            borderColor: "#10b981",
            backgroundColor: "#10b981",
            tension: 0.4,
          }
        ],
      };
    }

    return {
      labels: familyGrowthData.labels,
      datasets: [
        {
          label: "New Families",
          data: familyGrowthData.newFamilies,
          borderColor: "#6366f1",
          backgroundColor: "#6366f1",
          tension: 0.4,
        },
        {
          label: "Active Families",
          data: familyGrowthData.activeFamilies,
          borderColor: "#10b981",
          backgroundColor: "#10b981",
          tension: 0.4,
        }
      ],
    };
  };

  // Function to generate chart data for Growth Rate Analysis
  const getGrowthRateChartData = () => {
    if (
      !growthRateData ||
      !growthRateData.labels ||
      !growthRateData.growthRate ||
      !growthRateData.activeUsers
    ) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            label: "Growth Rate (%)",
            data: [0],
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            yAxisID: 'y',
          },
          {
            label: "Active Users",
            data: [0],
            borderColor: "rgb(16, 185, 129)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            tension: 0.4,
            yAxisID: 'y1',
          }
        ],
      };
    }

    return {
      labels: growthRateData.labels,
      datasets: [
        {
          label: "Growth Rate (%)",
          data: growthRateData.growthRate,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: "Active Users",
          data: growthRateData.activeUsers,
          borderColor: "rgb(16, 185, 129)",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
          yAxisID: 'y1',
        }
      ],
    };
  };

  // Function to get gauge chart data for Subscription Distribution
  const getSubscriptionGaugeChartData = () => {
    if (!subscriptionData || subscriptionData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e5e7eb'],
          borderWidth: 0,
        }],
      };
    }
    const planCounts = {};
    subscriptionData.forEach(sub => {
      const planName = sub.plan && sub.plan.name ? sub.plan.name : "Unknown";
      planCounts[planName] = (planCounts[planName] || 0) + 1;
    });
    return {
      labels: Object.keys(planCounts),
      datasets: [{
        data: Object.values(planCounts),
        backgroundColor: [
          '#22c55e', // Green
          '#3b82f6', // Blue
          '#f59e0b', // Amber
          '#ef4444', // Red
          '#a21caf', // Purple
          '#fbbf24', // Yellow
          '#e5e7eb', // Gray for Unknown
        ],
        borderWidth: 0,
      }],
    };
  };

  // Device Types Pie Chart Data
  const getDeviceTypePieChartData = () => {
    return {
      labels: ["Android", "iOS", "Windows"],
      datasets: [{
        data: [deviceCounts.android, deviceCounts.ios, deviceCounts.other],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
        borderWidth: 0,
      }],
    };
  };

  // Device Status Bar Data
  const getDeviceStatusBarData = () => {
    const statusCounts = { Active: 0, Inactive: 0 };
    (mockDevices || []).forEach(device => {
      if (device.status === 'Active' || device.status === 'Inactive') {
        statusCounts[device.status]++;
      }
    });
    return statusCounts;
  };

  return (
    <div className="fade-in">
      <div className="header-fixed shadow-sm mt-5">
        
        <div className="d-flex flex-wrap align-items-center justify-content-between  p-3 bg-white rounded-4" style={{ gap: 16 }}>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <label
              className="fw-bold me-2 mb-0"
              style={{ fontSize: 16 }}
              htmlFor="overview-filter"
            >
              Filter Overview:
            </label>
            <select
              id="overview-filter"
              className="form-select form-select-sm w-auto"
              value={overviewFilter}
              onChange={e => setOverviewFilter(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Date</option>
            </select>
            {overviewFilter === 'custom' && (
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
          </div>
          <div className="d-flex align-items-center gap-2">
            {filterLoading && (
              <div className="d-flex align-items-center gap-2">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span className="text-muted small">Updating data...</span>
              </div>
            )}
            {!filterLoading && (
              <>
                {overviewFilter === 'custom' && customStartDate && customEndDate ? (
                  <div className="text-muted small">
                    Showing data from <b>{customStartDate.toLocaleDateString()}</b> to <b>{customEndDate.toLocaleDateString()}</b>
                  </div>
                ) : (
                  <div className="badge bg-primary text-white px-3 py-2">
                    <Calendar size={14} className="me-1" />
                    {overviewFilter.charAt(0).toUpperCase() + overviewFilter.slice(1)} View
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20 }} /> {/* 76px (navbar) + 110px (dashboard header) */}

      {/* Statistics Cards */}
      <div className="row g-2 mb-3 align-items-stretch">
        {(loading || filterLoading) ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="col-6 col-md-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="card h-100 border-0 shadow-sm d-flex flex-row align-items-center px-2 py-2"
                style={{ background: ["#2563eb", "#f59e0b", "#a21caf", "#10b981"][index], color: "#fff", borderRadius: 12, minHeight: 64, minWidth: 0 }}
              >
                <div className="d-flex align-items-center justify-content-center me-2" style={{ width: 38, height: 38, background: "rgba(255,255,255,0.18)", borderRadius: 8 }}>
                  <div className="spinner-border spinner-border-sm text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div className="placeholder-glow">
                    <div className="placeholder col-6 mb-1"></div>
                    <div className="placeholder col-4"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))
        ) : error ? (
          <div className="col-12">
            <div className="alert alert-warning" role="alert">
              <strong>Warning:</strong> Unable to load dashboard statistics. {error}
            </div>
          </div>
        ) : (
          stats.map((stat, index) => (
            <div key={stat.title} className="col-6 col-md-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="card h-100 border-0 shadow-sm d-flex flex-row align-items-center px-4 py-4"
                style={{ background: ["#2563eb", "#f59e0b", "#a21caf", "#10b981"][index], color: "#fff", borderRadius: 16, minHeight: 110, minWidth: 0, cursor: "pointer" }}
              >
                <div className="d-flex align-items-center justify-content-center me-3" style={{ width: 56, height: 56, background: "rgba(255,255,255,0.18)", borderRadius: 12 }}>
                  <stat.icon size={32} className="text-white" />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex flex-column align-items-start">
                    <span className="fw-semibold" style={{ fontSize: 17, opacity: 0.92, marginLeft: 8 }}>{stat.title}</span>
                    <span className="d-flex align-items-center" style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginLeft: 8 }}>{stat.value}
                      <span className="badge ms-3" style={{ background: "rgba(255,255,255,0.22)", color: "#fff", fontSize: 14, fontWeight: 500 }}>
                        {stat.trend === "up" ? (
                          <TrendingUp size={16} className="me-1" />
                        ) : (
                          <TrendingDown size={16} className="me-1" />
                        )}
                        {stat.change}
                      </span>
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          ))
        )}
      </div>

      {/* Add extra space below metrics */}
      <div style={{ marginBottom: 80 }} />

      {/* 2x2 Grid Layout */}
      <div className="row g-3 mb-3">
        {/* Top Row: Growth Rate Analysis & Family Growth */}
        <div className="col-12 col-lg-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="chart-container bg-white p-3 rounded shadow-sm h-100 d-flex flex-column"
            style={{ minHeight: 340 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0 fw-bold">Growth Rate Analysis</h6>
            </div>
            <div style={{ flex: 1, minHeight: 220, position: 'relative' }}>
              {filterLoading && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  borderRadius: 8
                }}>
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <Line
                data={getGrowthRateChartData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: { mode: 'index', intersect: false },
                    legend: { position: 'top' },
                  },
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      title: { display: true, text: 'Growth Rate (%)' }
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      grid: { drawOnChartArea: false },
                      title: { display: true, text: 'Active Users' }
                    }
                  }
                }}
              />
            </div>
          </motion.div>
        </div>
        <div className="col-12 col-lg-6">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="chart-container bg-white p-3 rounded shadow-sm h-100 d-flex flex-column"
            style={{ minHeight: 340, maxWidth: 540, margin: '0 auto' }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0 fw-bold">Family Growth</h6>
            </div>
            <div style={{ flex: 1, minHeight: 220, position: 'relative' }}>
              {filterLoading && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  borderRadius: 8
                }}>
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <Bar
                data={getFamilyGrowthChartData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  barPercentage: 0.4, // Make bars thinner
                  categoryPercentage: 0.7,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: { beginAtZero: true, grid: { color: "#f3f4f6" } },
                    y: { beginAtZero: true, ticks: { precision: 0 } },
                  },
                }}
              />
            </div>
            <div className="d-flex gap-3 mt-2 justify-content-center">
              <span className="d-flex align-items-center"><span style={{ width: 12, height: 12, background: "#6366f1", borderRadius: 2, display: "inline-block", marginRight: 6 }}></span><span style={{ color: '#6366f1', fontWeight: 500 }}>New Families</span></span>
              <span className="d-flex align-items-center"><span style={{ width: 12, height: 12, background: "#10b981", borderRadius: 2, display: "inline-block", marginRight: 6 }}></span><span style={{ color: '#10b981', fontWeight: 500 }}>Active Families</span></span>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="row g-4 mb-3 align-items-stretch">
        {/* Combined Block: Subscription Distribution & Device Types */}
        <div className="col-12 col-lg-8 d-flex">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="chart-container bg-white p-4 rounded-4 shadow-lg h-100 w-100 d-flex flex-row align-items-center justify-content-center card-hover"
            style={{ minHeight: 300, maxHeight: 360, transition: 'box-shadow 0.2s, transform 0.2s', gap: 24, border: '1.5px solid #e5e7eb', boxShadow: '0 6px 32px rgba(56,189,248,0.10), 0 1.5px 6px rgba(0,0,0,0.04)' }}
          >
            {/* Subscription Distribution Chart */}
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ flex: 1, minWidth: 0 }}>
              <div className="w-100 mb-1 text-center">
                <h6 className="fw-bold mb-0" style={{ fontSize: 17, color: '#2563eb', letterSpacing: 0.2 }}>Subscription Distribution</h6>
              </div>
              <div className="d-flex flex-column align-items-center justify-content-center position-relative" style={{ width: '100%', minHeight: 140 }}>
                <Doughnut
                  data={getSubscriptionGaugeChartData()}
                  options={{
                    cutout: '72%',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: true },
                    },
                  }}
                  style={{ maxHeight: 110, maxWidth: 110 }}
                />
                {/* Center value and label */}
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 3 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -1 }}>
                    {subscriptionData && subscriptionData.length > 0 ? subscriptionData.length : 0}
                  </div>
                  <div style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Subscriptions</div>
                </div>
              </div>
              {/* Legend below pie chart */}
              <div className="d-flex flex-wrap gap-2 justify-content-center mt-2" style={{ width: '100%' }}>
                {(() => {
                  const planCounts = {};
                  subscriptionData.forEach(sub => {
                    const planName = sub.plan && sub.plan.name ? sub.plan.name : "Unknown";
                    planCounts[planName] = (planCounts[planName] || 0) + 1;
                  });
                  const colors = [
                    '#22c55e', // Green
                    '#3b82f6', // Blue
                    '#f59e0b', // Amber
                    '#ef4444', // Red
                    '#a21caf', // Purple
                    '#fbbf24', // Yellow
                    '#e5e7eb', // Gray for Unknown
                  ];
                  return Object.entries(planCounts).map(([plan, count], idx) => (
                    <div key={plan} className="d-flex align-items-center" style={{ fontSize: 14 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 5, background: colors[idx % colors.length], display: 'inline-block', marginRight: 6 }}></span>
                      <span style={{ fontWeight: 500 }}>{plan}</span>
                      <span className="ms-2 text-muted" style={{ fontSize: 12 }}>({count})</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
            {/* Vertical Divider */}
            <div style={{ width: 1.5, height: 120, background: '#e5e7eb', margin: '0 18px', borderRadius: 1 }}></div>
            {/* Device Types Chart */}
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ flex: 1, minWidth: 0 }}>
              <div className="w-100 mb-1 text-center">
                <h6 className="fw-bold mb-0" style={{ fontSize: 17, color: '#a21caf', letterSpacing: 0.2 }}>Device Types</h6>
              </div>
              <div className="d-flex flex-column align-items-center">
                <Doughnut
                  data={getDeviceTypePieChartData()}
                  options={{
                    cutout: '72%',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: true },
                    },
                  }}
                  style={{ maxHeight: 90, maxWidth: 90 }}
                />
                <div style={{ fontSize: 14, color: '#6b7280', fontWeight: 500, marginTop: 6 }}>Device Types</div>
                <div className="d-flex gap-2 mt-1">
                  <span style={{ width: 10, height: 10, borderRadius: 5, background: '#3b82f6', display: 'inline-block' }}></span>
                  <span style={{ fontSize: 13 }}>Android</span>
                  <span style={{ width: 10, height: 10, borderRadius: 5, background: '#f59e0b', display: 'inline-block', marginLeft: 8 }}></span>
                  <span style={{ fontSize: 13 }}>Windows</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Recent Activity - visually distinct, more padding and space */}
        <div className="col-12 col-lg-4 d-flex">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="p-4 rounded-4 shadow-lg h-100 w-100 d-flex flex-column card-hover"
            style={{ minHeight: 300, maxHeight: 360, background: '#f1f6fb', borderLeft: '5px solid #3b82f6', transition: 'box-shadow 0.2s, transform 0.2s' }}
          >
            <h6 className="mb-3 fw-bold" style={{ color: '#2563eb', letterSpacing: 0.5, fontSize: 20 }}>Recent Activity</h6>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <small className="text-muted">{recentActivity.length} recent activities</small>
              <button
                className="btn btn-link p-0 text-primary"
                style={{ textDecoration: "none", fontWeight: 500 }}
                onClick={() => setShowAllActivities(true)}
              >
                View All
              </button>
            </div>
            <div className="activity-feed" style={{ flex: 1, minHeight: 140, maxHeight: 220, overflowY: "auto", position: 'relative', paddingRight: 8 }}>
              {recentActivityLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : recentActivityError ? (
                <div className="alert alert-warning" role="alert">
                  {recentActivityError}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <p>No recent activity</p>
                </div>
              ) : (
                recentActivity.map((activity, index) => {
                  const IconComponent = getActivityIcon(activity.type, activity.icon);
                  return (
                    <div key={activity.id || index} className="activity-item mb-4 d-flex align-items-start position-relative" style={{ paddingLeft: 32 }}>
                      {/* Timeline dot */}
                      <span style={{ position: 'absolute', left: 0, top: 24, width: 18, height: 18, borderRadius: 9, background: '#3b82f6', boxShadow: '0 0 0 2px #fff' }}></span>
                      <div className="flex-shrink-0 me-3">
                        <div className={`${getActivityColor(activity.type)} p-3 rounded-circle d-flex align-items-center justify-content-center`} style={{ width: 48, height: 48 }}>
                          <IconComponent size={32} />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold" style={{ fontSize: 17 }}>{activity.action}</div>
                        {activity.family && (
                          <div className="small text-muted mb-1" style={{ fontSize: 15 }}>{activity.family}</div>
                        )}
                        <div className="small text-muted" style={{ fontSize: 14 }}>
                          {new Date(activity.time).toLocaleDateString()} {new Date(activity.time).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {showAllActivities && (
        <div className="modal-backdrop" style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.3)", zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="bg-white rounded shadow p-4" style={{ maxWidth: 600, width: "90vw", maxHeight: "80vh", overflowY: "auto" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">All Activities</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowAllActivities(false)}>Close</button>
            </div>
            {recentActivity.length === 0 ? (
              <div className="text-center text-muted">No activities</div>
            ) : (
              <ul className="list-unstyled">
                {recentActivity.map((activity, index) => {
                  console.log("Activity:", activity);
                  const IconComponent = getActivityIcon(activity.type, activity.icon);
                  return (
                    <li key={activity.id || index} className="mb-3 d-flex align-items-start">
                      <div className="me-3">
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <div className="fw-semibold">{activity.action}</div>
                        {activity.family && (
                          <div className="small text-muted mb-1">{activity.family}</div>
                        )}
                        <div className="small text-muted">
                          {new Date(activity.time).toLocaleDateString()}{" "}
                          {new Date(activity.time).toLocaleTimeString()}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
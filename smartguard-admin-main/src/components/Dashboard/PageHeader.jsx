import React from "react";
import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

const PAGE_HEADERS = {
  "/dashboard": {
    title: "Dashboard Overview",
    description: "Monitor your family protection platform metrics",
    actions: <Bell size={22} className="me-3" />,
  },
  "/dashboard/tenants": {
    title: "Tenant Management",
    description: "Manage tenants, families, and devices",
    actions: <Bell size={22} className="me-3" />,
  },
  "/dashboard/subscriptions": {
    title: "Subscriptions",
    description: "View and manage all active and past subscriptions",
    actions: <Bell size={22} className="me-3" />,
  },
  "/dashboard/support": {
    title: "Support Tickets",
    description: "Track and resolve support requests from users",
    actions: <Bell size={22} className="me-3" />,
  },
  "/dashboard/settings": {
    title: "Settings",
    description: "Configure platform and user preferences",
    actions: <Bell size={22} className="me-3" />,
  },
};

export default function PageHeader() {
  const { pathname } = useLocation();
  // Find the best match for the current path
  const header = PAGE_HEADERS[pathname] || {};

  return (
    <div className=" px-4 py-3 d-flex align-items-center justify-content-between" style={{  top: 0, zIndex: 1050, minHeight: 80 }}>
      <div>
        <h1 className="h3 mb-1">{header.title}</h1>
        <div className="text-muted">{header.description}</div>
      </div>
      
    </div>
  );
}

// Layout.jsx

import React from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <AdminNavbar />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex-1 px-4 py-10 md:px-10 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

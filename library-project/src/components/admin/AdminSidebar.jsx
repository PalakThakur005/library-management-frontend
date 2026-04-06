import React from "react";
import logo from "../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";

import { FaThLarge, FaCog, FaBook, FaSignOutAlt } from "react-icons/fa";

const AdminSidebar = ({ handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="sticky top-0 h-screen">
      <div className="w-16 md:w-64 shrink-0 h-screen bg-white border-r border-gray-300 flex flex-col p-3 md:p-5 transition-all duration-300">

        {/* LOGO */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src={logo} alt="logo" className="w-9 h-9" />
          <h2 className="text-sm font-bold text-blue-700 hidden md:block">
            LibraSync
          </h2>
        </div>

        {/* MENU */}
        <ul className="flex-1 space-y-2">

          <li
            onClick={() => navigate("/admin/dashboard")}
            className={`flex items-center md:justify-start justify-center gap-3 p-3 rounded-lg cursor-pointer text-sm transition 
            ${
              location.pathname === "/admin/dashboard"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaThLarge />
            <span className="hidden md:block">Dashboard</span>
          </li>

          <li
            onClick={() => navigate("/admin/ManageRoles")}
            className={`flex items-center md:justify-start justify-center gap-3 p-3 rounded-lg cursor-pointer text-sm transition 
            ${
              location.pathname === "/admin/ManageRoles"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaBook />
            <span className="hidden md:block">User Management</span>
          </li>

          <li
            onClick={() => navigate("/admin/setting")}
            className={`flex items-center md:justify-start justify-center gap-3 p-3 rounded-lg cursor-pointer text-sm transition 
            ${
              location.pathname === "/admin/setting"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaCog />
            <span className="hidden md:block">Setting</span>
          </li>

        </ul>

        {/* LOGOUT */}
        <div
          onClick={handleLogout}
          className="flex items-center md:justify-start justify-center gap-3 p-3 rounded-lg cursor-pointer text-red-600 hover:bg-gray-100 text-sm"
        >
          <FaSignOutAlt />
          <span className="hidden md:block">Logout</span>
        </div>

      </div>
    </div>
  );
};

export default AdminSidebar;
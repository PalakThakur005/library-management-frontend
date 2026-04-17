import React from "react";
import logo from "../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { sidebarConfig } from "./SidebarConfig";

const Sidebar = ({ role, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();


  const menuItems = sidebarConfig[role] || [];

  return (
    <div className="sticky top-0 h-screen">
      <div className="w-16 md:w-60 h-screen bg-white border-r border-gray-300 flex flex-col p-3 md:p-5">

        {/* LOGO */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src={logo} alt="logo" className="w-9 h-9" />
          <h2 className="text-sm font-bold text-blue-700 hidden md:block">
            LibraSync
          </h2>
        </div>

        {/* MENU */}
        <ul className="flex-1 space-y-2">
          {menuItems.map((item, index) => (
              <li
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex items-center md:justify-start justify-center gap-3 p-3 rounded-lg cursor-pointer text-sm transition 
                ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon/>
                <span className="hidden md:block">{item.label}</span>
              </li>
            )
          )}
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

export default Sidebar;
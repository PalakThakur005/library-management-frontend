import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { sidebarConfig } from "./SidebarConfig";

const Sidebar = ({ role, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 767);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 767);

      if (window.innerWidth >= 767) setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = sidebarConfig[role] || [];

  return (
    <>
      {isMobile && (
  <div className="fixed top-0 left-0 w-full h-16 bg-[#2d6c93]  flex items-center justify-between px-4 z-[1000] shadow-md">

    {/* 🔹 LEFT (Logo + Name) */}
    <div className="flex items-center gap-2">
      <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
      <h2 className="font-semibold text-white tracking-wide text-lg">
        LibraSync
      </h2>
    </div>

    <button
      onClick={() => setIsOpen(true)}
      className="p-2 rounded-md cursor-pointer hover:bg-white/20 active:scale-95 transition-all"
    >
      <FaBars className="text-xl text-white" />
    </button>

  </div>
)}

      {/* 🔹 OVERLAY */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[999]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen z-1000 transform transition-transform duration-300
        ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
      `}
      >
        <div className="w-64 h-full bg-white border-r border-gray-300 flex flex-col p-5">

          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4  cursor-pointer right-4 text-gray-700"
            >
              <FaTimes />
            </button>
          )}

          <div className="flex items-center gap-2 mb-8">
            <img src={logo} alt="logo" className="w-9 h-9" />
            <h2 className="text-sm font-bold text-[#2d6c93] ">
              LibraSync
            </h2>
          </div>

          <ul className="flex-1 space-y-2">
            {menuItems.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setIsOpen(false); // close on mobile
                }}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer text-sm transition 
                ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-[#2d6c93] "
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <item.icon />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>

          <div
            onClick={() => {
              handleLogout();
              if (isMobile) setIsOpen(false);
            }}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-red-600 hover:bg-gray-100 text-sm"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </div>

        </div>
      </div>
    </>
  );
};

export default Sidebar;
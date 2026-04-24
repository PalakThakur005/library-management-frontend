import React, { useState } from "react";
import Sidebar from "../components/CommonPages/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import ConfirmationLog from "../components/CommonPages/ConfirmationLog";
import toast from "react-hot-toast";
import MiniLoader from "../components/CommonPages/Minloader";
import { decryptData } from "../components/utils/Crypto";

const CommonLayout = () => {
  const [showConfirmLog, setshowConfirmLog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const role =decryptData(localStorage.getItem("role"));
  const navigate = useNavigate();

  const handleLogout = () => setshowConfirmLog(true);
  const handleCross = () => setshowConfirmLog(false);
  const handleCancel = () => setshowConfirmLog(false);

  const handleConfirm = () => {
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logout successfully");

    setshowConfirmLog(false);
      setShowLoader(true);

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen ">

      <Sidebar role={role} handleLogout={handleLogout} />
      <div
        className="
          flex-1 w-full min-w-0
          bg-gray-100
          pt-20 md:pt-6
           px-3 sm:px-4 md:ml-64  md:px-6
           sm:mt-18 lg:mt-0 md:mt-0 sm:py-2
          transition-all duration-300
        "
      >
          <Outlet />
        </div>

      {showConfirmLog && (
        <ConfirmationLog
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
          handleCross={handleCross}
          loading={loading}
        />
      )}

      {showLoader && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[1100]">
          <MiniLoader size="w-12 h-12" />
        </div>
      )}
    </div>
  );
};

export default CommonLayout;
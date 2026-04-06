import StudentSidebar from '../components/student/StudentSidebar';
import { useNavigate,Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationLog from '../pages/admin/ConfirmationLog';
import ResetPassword from '../pages/admin/ResetPassword';

 const StudentLayout = () => {

    const [showConfirmLog, setshowConfirmLog] = useState(false);
    const [showReset , setShowReset]  = useState(false)

    const navigate = useNavigate();

  const handleLogout = () => {
    setshowConfirmLog(true)
  }
  const handleCross = () => {
    setshowConfirmLog(false)
  }
  const handleCancel = () => {
    setshowConfirmLog(false)
  }

  const handleConfirm = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    toast.info("Logout successfully")
    setTimeout(() => {
      setshowConfirmLog(false)
    }, 3000)
    setTimeout(() => {
      navigate("/login")
    }, 2000)


  }

  

  return (
   <div className="flex h-screen">
      <StudentSidebar
      handleLogout={handleLogout}
      />
       <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      {showConfirmLog &&
        <ConfirmationLog
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
          handleCross={handleCross}
        />
      }


      
    </div>
  )
}
export default StudentLayout;

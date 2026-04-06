import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import ConfirmationLog from "../pages/admin/ConfirmationLog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import DeleteConformation from "../pages/admin/DeleteConfirmation";
import ResetPassword from "../pages/admin/ResetPassword";


const AdminLayout = () => {
  const [showConfirmLog, setshowConfirmLog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
   const [showReset , setShowReset]  = useState(false)
   const [loading, setLoading] = useState(false);
  
  const [userID, setUserID] = useState("")

  const [roles, setRoles] = useState([]);

    const backenduri = import.meta.env.VITE_BACKEND_URI;


  useEffect(() => {
    getUser();
  }, [])




  const getUser = async () => {
    try {
      const response = await axios.get(
        `${backenduri}/api/auth/getRoles`
      )
      setRoles(response.data)
    } catch (error) {
      console.log(error)
    }
  }





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

  //delete user 

  const handleDelete = (id) => {
    setConfirmDelete(true)
    setUserID(id)

  }
  const handleNo = () => {
    setConfirmDelete(false)
  }

  const handleCut = () => {
    setConfirmDelete(false)
  }

  const handleYes = async () => {
    setLoading(true)
    try {
      await axios.delete(
        `${backenduri}/api/auth/deleteUser/${userID}`
      )
      const restUser = roles.filter((items) => items._id !== userID);
      setRoles(restUser)
      toast.success("User deleted successfully")
    } catch (error) {
      toast.error("Failed to delete item")
    }
    finally {
    setLoading(false);
  }
        setConfirmDelete(false)
  }


 const onCut = ()=>{
    setShowReset(false);
  }
  const onCancel= ()=>{
    setShowReset(false);
  }
 
 const handleResetPassword = (id) => {
  setShowReset(true)
  setUserID(id)
 }
  const onConfirm = async () => {
    setLoading(true);
  try {
    await axios.put(`${backenduri}/api/auth/reset-password/${userID}`);
    toast.success("New password sent to email");

    setShowReset(false);
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  finally {
    setLoading(false);
  }
};

  

  return (
    <div className="flex h-screen">
      <AdminSidebar
        handleLogout={handleLogout}
      />


      <div className="flex-1 overflow-auto">
        <Outlet context={{ roles, getUser, handleDelete , handleResetPassword  }} />
      </div>

      {showConfirmLog &&
        <ConfirmationLog
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
          handleCross={handleCross}
          loading={loading}
        />
      }
      {
        confirmDelete &&
        <DeleteConformation
          handleCut={handleCut}
          handleNo={handleNo}
          handleYes={handleYes}
          loading={loading}
        />
      }

      {showReset && 
            <ResetPassword
            user={roles.find((u)=>u._id ===userID)}          
               onCut={onCut}
            onCancel={onCancel}
            onConfirm={onConfirm}
            loading={loading}
            />
            }

    </div>

  );
};

export default AdminLayout;
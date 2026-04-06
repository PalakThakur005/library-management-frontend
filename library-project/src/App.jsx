import React from "react";
import { BrowserRouter, Routes, Route,Navigate} from "react-router-dom";

import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoutes from "./routes/ProtectedRoutes";
import AdminLayout from "./Layout/AdminLayout";
import ManageRoles from "./pages/admin/ManageRoles";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./pages/auth/ForgotPassword";
import StudentLayout from "./Layout/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Redirect root to login */}
        <Route path="/" element={<Login />}/>

        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoutes/>}>
           <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<Navigate to='dashboard' replace/>}/>
           <Route path="dashboard" element={<AdminDashboard/>}/>
           <Route path="ManageRoles" element={<ManageRoles/>}/>
            
           </Route>
  
         <Route path="/student" element={<StudentLayout />}>
         <Route index element={<Navigate to='dashboard' replace/>}/>
           <Route path="dashboard" element={<StudentDashboard/>}/>
          
         </Route>
           
        </Route>

      

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
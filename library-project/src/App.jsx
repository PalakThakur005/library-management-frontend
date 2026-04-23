import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/auth/Login";

import ProtectedRoutes from "./routes/ProtectedRoutes";

import CommonLayout from "./Layout/CommonLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageRoles from "./pages/admin/ManageRoles";
import Books from "./pages/admin/Books";
import CardIssue from "./pages/admin/CardIssue";
import Department from "./pages/admin/Department";
import IssueBook from "./pages/admin/IssueBook";
import AdminProfile from "./pages/admin/AdminProfile";


import ForgotPassword from "./pages/auth/ForgotPassword";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import IssuedBooks from "./pages/student/IssuedBooks";
import LibraryCard from "./pages/student/LibraryCard";


import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import Issuedbooks from "./pages/teacher/IssuedBooks";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import MyLibraryCard from "./pages/teacher/MyLibraryCard";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect root to login */}
        <Route path="/" element={<Login />} />

        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/admin" element={<CommonLayout />}>
            <Route index element={<Navigate to='dashboard' replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="department" element={<Department />} />
            <Route path="ManageRoles" element={<ManageRoles />} />
            <Route path="Books" element={<Books />} />
            <Route path="cardIssue" element={<CardIssue />} />
            <Route path="issuebook" element={<IssueBook />} />
            <Route path="profile" element={<AdminProfile />} />

          </Route>

          <Route path="/student" element={<CommonLayout />}>
            <Route index element={<Navigate to='dashboard' replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="Issued" element={<IssuedBooks />} />
            <Route path="profile" element={<StudentProfile />} />
             <Route path="card" element={<LibraryCard />} />

          </Route>

          <Route path="/teacher" element={<CommonLayout />}>
            <Route index element={<Navigate to='dashboard' replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="books" element={<Issuedbooks />} />
            <Route path="profile" element={<TeacherProfile />} />
              <Route path="card" element={<MyLibraryCard />} />
          </Route>

        </Route>



      </Routes>



      <Toaster
  position="top-center"
  reverseOrder={false}
/>

    </BrowserRouter>
  );
}

export default App;
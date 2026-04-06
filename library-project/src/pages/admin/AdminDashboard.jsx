import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminCard from "../../components/admin/AdminCard";

import {
  FaUsers,
  FaChalkboardTeacher,
  FaUserGraduate
} from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

const AdminDashboard = () => {
const {roles}=useOutletContext();


const teacher=roles.filter(item=>item.role==="teacher").length;
const student=roles.filter(item=>item.role==="student").length;

const totalUser = roles.filter(item=>item.role!="admin").length;


  
  
  return (
    <div className="p-8 bg-white min-h-screen">
      
       <div className="flex flex-col">
            <h1 className="font-[Poppins] text-[25px] font-bold italic">
              <span className="text-black">SUPER </span>
              <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                ADMIN
              </span>
              <span className="text-[#4a6a8a] font-semibold text-[22px]">
                {" "}DASHBOARD
              </span>
            </h1>

            <p className="text-sm font-semibold text-gray-500 pb-10">
              Welcome back, Palak Thakur. Here's what's happening in your platform.
            </p>
          </div>

      <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        
        <AdminCard
          icon={<FaUsers />}
          title="Total Users"
          value={totalUser}
          color="#6366f1"
        />

        <AdminCard
          icon={<FaChalkboardTeacher />}
          title="Teachers"
          value={teacher}
          color="#22c55e"
        />

        <AdminCard
          icon={<FaUserGraduate />}
          title="Students"
          value={student}
          color="#f59e0b"
         />

      </div>

    </div>
  );
};

export default AdminDashboard;
import React, { useEffect, useState } from "react";
import api from "../../components/Api/Axios";
import DashboardCard from "../../components/CommonPages/DashboardCard";
import DashboardCharts from "./DashboardCharts";

import {
  FaUsers,
  FaBuilding,
  FaBook,
  FaIdCard

} from "react-icons/fa";


const AdminDashboard = ({ users }) => {


  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDepartments: 0,
    totalCards: 0,
    totalBooks: 0,
  });


  useEffect(() => {
    getStats();
  }, []);

  const getStats = async () => {
    try {
      const res = await api.get("/api/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };



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

  {/* TOTAL USERS */}
  <DashboardCard
    icon={<FaUsers />}
    title="Total Users"
    count={stats.users}
    color="#6366f1"
  />

  {/* TOTAL DEPARTMENTS */}
  <DashboardCard
    icon={<FaBuilding />}
    title="Total Departments"
    count={stats.departments}
    color="#0ea5e9"
  />

  {/* TOTAL cards */}
 <DashboardCard
  icon={<FaIdCard />}
  title="Total Cards"
  count={stats.cards}
  color="#a855f7"
  bgColor="bg-purple-50"
/>

  
  {/* TOTAL BOOKS */}
  <DashboardCard
    icon={<FaBook />}
    title="Total Books"
    count={stats.books}
    color="#10b981"
  />


      </div>



      <DashboardCharts users={users} />

    </div>
  );
};

export default AdminDashboard;
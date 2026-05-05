import React, { useEffect, useState } from "react";
import api from "../../components/Api/Axios";
import DashboardCard from "../../components/CommonPages/DashboardCard";
import DashboardCharts from "./DashboardCharts";
import useTitle from "../../components/hooks/useTitle";

import {
  FaUsers,
  FaBuilding,
  FaBook,
  FaIdCard

} from "react-icons/fa";


const AdminDashboard = ({ users }) => {

  useTitle("Admin Dashboard")


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
    <div className="  min-h-screen">
          <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center lg:gap-4   ">
            <div>

            <h1 className="font-[Poppins] lg:text-[25px] md:text-[20px]  text-[20px] font-bold italic">
          <span className="text-black">SUPER </span>
          <span className="bg-linear-to-r from-[#2d6c93] to-[#3d799f]  bg-clip-text text-transparent">
            ADMIN
          </span>
          <span className="text-[#4a6a8a] font-semibold  lg:text-[25px] text-[20px]">
            {" "}DASHBOARD
          </span>
        </h1>

            <p className="lg:text-sm  text-xs font-semibold  text-gray-500 pb-5 lg:pb-10">
          Welcome back, Palak Thakur. Here's what's happening in your platform.
        </p>
      </div>
      </div>
<div className="grid gap-4 grid-cols-1 md:grid-cols-2  sm:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
};

export default AdminDashboard;
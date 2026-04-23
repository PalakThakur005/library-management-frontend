import React, { useState , useEffect } from 'react'
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import api from '../../components/Api/Axios';
import useTitle from '../../components/hooks/useTitle';

function StudentDashboard() {

  useTitle("Student Dashboard");

  const [user, setUser] = useState(null);
  const [mybook , setMyBook] = useState([])
    const [stats, setStats] = useState({
      totalIssued: 0,
      activeIssued: 0,
      returned: 0,
      overdue: 0,
    });
  



  const fetchUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
    } catch (error) {
      toast.error("Failed to fetch this user");
    }
  };

  useEffect(() => {
    fetchUser();
    getbooks();
  }, []);




   const getbooks = async (pageNumber = 1) => {
    try {
      const res = await api.get(
        "/api/mybooks/getmyissuedbooks"
      );
      setMyBook(res.data.data)
      setStats(res.data.stats);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };


    const chartData = [
  { name: "Total ", value: stats.totalIssued },
  { name: "Active", value: stats.activeIssued },
  { name: "Returned", value: stats.returned },
  { name: "Overdue", value: stats.overdue }
];

const COLORS = [
  "#93C5FD", // light sky blue
  "#86EFAC", // soft green
  "#A78BFA", // light purple
  "#FCA5A5", // soft red
];



  return (
  <div className="max-w-7xl mx-auto ">

        <div className="relative overflow-hidden rounded-2xl max-w-full shadow-[0_0_20px_rgba(0,0,0,0.25)] p-6 bg-white border border-gray-100">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-blue-100 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-gray-200 opacity-20 rounded-full blur-3xl"></div>

       {!user ? (
  <p className="text-gray-500">Loading...</p>
) : (
  <div className="space-y-3">
    
    {/* Greeting */}
    <h2 className="text-2xl  sm:text-3xl font-bold text-gray-800">
      Hello{" "}
      <span className="text-blue-400 capitalize">
        {user.name}
      </span>{" "}
      👋
    </h2>

    {/* Description */}
    <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl mt-3">
  Glad to see you back in your dashboard.  
  <span className="text-gray-800 font-medium">
   {""} Manage your activities, Track issued and Returned books,
  </span>{" "}
  and stay updated with your department details — continue your work smoothly from here..
</p>

  </div>
)}
        </div>

        
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2 gap-6 mt-6">

  {/* 👤 USER CARD */}
  <div className="relative group bg-white border border-blue-200 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">

    <div className="absolute inset-0 bg-linear-to-br from-[#00304e]/5 via-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition duration-500"></div>
    <div className="absolute left-0 top-0 h-full w-0.75 bg-[#2d6c93] group-hover:w-1.5 transition-all duration-300"></div>

    <div className="p-5 relative z-10">

      <h3 className="text-lg font-bold text-[#00304e] mb-4 group-hover:text-black transition">
        👤 User Details
      </h3>

      <div className="space-y-2 text-sm text-gray-600">
        <p className="capitalize"><span className="font-semibold ">Name:</span > {user?.name}</p>
        <p><span className="font-semibold">Email:</span> {user?.email}</p>
        <p><span className="font-semibold">Role:</span> {user?.role?.toUpperCase()}</p>
      </div>

    </div>
  </div>

  {/* 🏫 DEPARTMENT CARD */}
  <div className="relative group bg-white border border-blue-200 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">

    <div className="absolute inset-0 bg-linear-to-br from-[#00304e]/5 via-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition duration-500"></div>
    <div className="absolute left-0 top-0 h-full w-0.75 bg-[#2d6c93] group-hover:w-1.5 transition-all duration-300"></div>

    <div className="p-5 relative z-10">

      <h3 className="text-lg font-bold text-[#00304e] mb-4 group-hover:text-black transition">
        🏫 My Department
      </h3>

      {!user?.department ? (
        <p className="text-gray-500 text-sm">No department assigned</p>
      ) : (
        <div className="space-y-2 text-sm transform-content text-gray-600">
          <p><span className="font-semibold">Name:</span> {user?.department?.name.toUpperCase()}</p>
          <p><span className="font-semibold">Code:</span> {user?.department?.code.toUpperCase()}</p>
          <p><span className="font-semibold">Location:</span> {user?.department?.location.toUpperCase()}</p>
        </div>
      )}

    </div>
  </div>

  <div className="relative group bg-white border border-blue-200 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">

    <div className="absolute inset-0 bg-linear-to-br from-[#00304e]/5 via-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition duration-500"></div>
    <div className="absolute left-0 top-0 h-full w-0.75 bg-[#2d6c93] group-hover:w-1.5 transition-all duration-300"></div>

    <div className="p-5 relative z-10">

      <h3 className="text-lg font-bold text-[#00304e] mb-4 group-hover:text-black transition">
        📅 Current Date
      </h3>

      <p className="text-sm text-gray-600">
        {new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

    </div>
  </div>

</div>



<div className="w-full px-1 sm:px-2 mt-6 sm:mt-10">

       <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

    {/* 📊 BAR CHART */}
    <div className="rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition bg-white p-4 sm:p-6">

      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
        Issued Books Overview
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-4">
        Total, Active, Returned & Overdue
      </p>

      <div className="w-full h-65 sm:h-72">
       {stats.totalIssued === 0 &&
 stats.activeIssued === 0 &&
 stats.returned === 0 &&
 stats.overdue === 0 ? (
 <div className="flex items-center justify-center h-50">
  <p className="text-sm text-gray-400 text-center">
    No data available at the moment,
    <br />
    data will appear here once it is added.
  </p>
</div>
):(
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="25%">

            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 0 15px rgba(0,0,0,0.2)"
              }}
            />

            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
)}
      </div>
    </div>

    {/* 🍩 DONUT CHART */}
    <div className="rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition bg-white p-4 sm:p-6">

      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
        Distribution Overview
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-4">
        Books Status Distribution
      </p>

      <div className="w-full h-65 sm:h-72">
         {stats.totalIssued === 0 &&
 stats.activeIssued === 0 &&
 stats.returned === 0 &&
 stats.overdue === 0 ? (
 <div className="flex items-center justify-center h-50">
  <p className="text-sm text-gray-400 text-center">
    No data available at the moment,
    <br />
    data will appear here once it is added.
  </p>
</div>
):(
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />

          </PieChart>
        </ResponsiveContainer>
)}
      </div>
    </div>

  </div>
</div>

</div>
    
  );
}

export default StudentDashboard;
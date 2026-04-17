import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from "recharts";
import api from "../../components/Api/Axios";

const DashboardCharts = () => {

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [books, setBooks] = useState([]);
  const [cards, setCards] = useState([]);

  const getAllData = async () => {
    try {
      const [userRes, deptRes, bookRes, cardRes] = await Promise.all([
        api.get("/api/auth/getRoles"),
        api.get("/api/dept/get-dep"),
        api.get("/api/book/books"),
        api.get("/api/card/cards"),
      ])
      setUsers(userRes.data);
      setDepartments(deptRes.data);
      setBooks(bookRes.data);
      setCards(cardRes.data);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  const totalUsers = users.length;
  const totalDepartments = departments.length;
  const totalBooks = books.length;
  const totalCards = cards.length;

  const barData = [
    { name: "Users", value: totalUsers },
    { name: "Departments", value: totalDepartments },
    { name: "Books", value: totalBooks },
    { name: "Cards", value: totalCards },
  ];

  const pieData = [...barData];

  const COLORS_MAP = {
    Users: "#93C5FD",
    Departments: "#86EFAC",
    Books: "#A78BFA",
    Cards: "#FCA5A5",
  };

    const PIE_COLORS = [
  "#93C5FD", 
  "#86EFAC", 
  "#A78BFA", 
  "#FCA5A5", 
];

  return (
    <div className="w-full px-3 sm:px-6 mt-6 sm:mt-10">

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

        {/* 📊 BAR CHART */}
        <div className="rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition bg-white p-4 sm:p-6">

          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
            System Overview
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            Users, Departments, Books & Cards
          </p>

          {/* ✅ ONLY HEIGHT FIX */}

          
          <div className="w-full h-65 sm:h-72 md:h-72">
             {totalUsers==0 && totalBooks == 0 && totalDepartments === 0 && totalCards ?(
 <div className="flex items-center justify-center h-50">
  <p className="text-sm text-gray-400 text-center">
    No data available at the moment,
    <br />
    data will appear here once it is added.
  </p>

</div>
):(
            
          
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barCategoryGap="25%">
                
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />

                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 0 15px rgba(0,0,0,0.2)"
                  }}
                />

                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS_MAP[entry.name]}
                    />
                  ))}
                </Bar>

              </BarChart>
            </ResponsiveContainer>
)}
          </div>
        </div>

        {/* 🥧 DONUT CHART */}
        <div className="rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition bg-white p-4 sm:p-6">

          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
            Distribution Overview
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            System Data Distribution
          </p>

         
          <div className="w-full h-65 sm:h-72 md:h-72"> 
             {totalUsers==0 && totalBooks == 0 && totalDepartments === 0 && totalCards == 0 ?(
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
                  data={pieData}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} />
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
  );
};

export default DashboardCharts;
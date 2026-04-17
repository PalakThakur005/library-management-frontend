import React, { useEffect, useState } from "react";
import axios from "axios";
import resetimage from "../../assets/resetimage.jpg";

const StudentProfile = () => {
  const [user, setUser] = useState(null);
  const backenduri = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${backenduri}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user)
    return (
      <div className="text-center mt-10 text-lg text-gray-500">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
     <div className="relative h-72 w-full">
           <img
             src={resetimage}
             alt="cover"
             className="w-full h-full object-cover"
           />
   
           {/* overlay */}
           <div className="absolute inset-0 bg-black/40"></div>
   
           {/* profile */}
           <div className="absolute left-1/2 transform -translate-x-1/2 top-44">
             <img
               src={resetimage}
               alt="profile"
               className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover"
             />
           </div>
         </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 mt-15">

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">

          {/* NAME */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 capitalize">
              {user?.name}
            </h1>

            <p className="text-gray-500 mt-1">
              Student Profile
            </p>

          </div>

          {/* INFO GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

            <div className="p-6 rounded-2xl bg-linear-to-br from-purple-50 to-white shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <p className="text-sm text-gray-500">Department</p>
              <h3 className="text-lg font-semibold text-gray-800 capitalize">
                {user?.department?.name || "N/A"}
              </h3>
            </div>

            <div className="p-6 rounded-2xl bg-linear-to-br from-indigo-50 to-white shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <p className="text-sm text-gray-500">Department Code</p>
              <h3 className="text-lg font-semibold text-gray-800 uppercase">
                {user?.department?.code || "N/A"}
              </h3>
            </div>

            <div className="p-6 rounded-2xl bg-linear-to-br from-green-50 to-white shadow-sm hover:shadow-md transition hover:-translate-y-1 md:col-span-2 lg:col-span-1">
              <p className="text-sm text-gray-500">Email</p>
              <h3 className="text-lg font-semibold text-gray-800 break-all">
                {user?.email}
              </h3>
            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">

            <button className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition hover:scale-105">
              Edit Profile
            </button>

            <button className="px-6 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition hover:scale-105">
              View Activity
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
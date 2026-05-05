import React, { useState, useEffect } from "react";
import api from "../../components/Api/Axios";
import toast from "react-hot-toast";
import DashboardCard from "../../components/CommonPages/DashboardCard";
import { FaArrowLeft,FaBook,FaEdit,FaUndo, FaArrowRight , FaBookReader } from "react-icons/fa";
import useTitle from "../../components/hooks/useTitle";

function Issuedbooks() {

  useTitle("Issued Library Books")


  // ✅ STATS
  const [stats, setStats] = useState({
    totalIssued: 0,
    activeIssued: 0,
    returned: 0,
    overdue: 0,
  });


  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [myBooks, setMyBooks] = useState([]);
  const limit = 4;

  const getPaginatedbooks = async (pageNumber = 1) => {
    try {
      const res = await api.get(
        `/api/mybooks/getmyissuedbooks?page=${pageNumber}&limit=${limit}` 
      );

      setMyBooks(res.data.data);
setStats(res.data?.stats);

setPage(res.data.pagination?.page);
setTotalPages(res.data.pagination?.totalPages)
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getPaginatedbooks(page);
  }, [page]);



  const formatDate = (date) => {
    if (!date) return "N/A";

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };


  return (
    <div className="max-w-7xl mx-auto ">

      {/* HEADER */}
<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-6 px-5 bg-white rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.20)] hover:shadow-[0_0_2px_rgba(0,0,0,0.18)] transition-all duration-300 border border-gray-100">
  <div>
    <h1 className="font-[Poppins] text-[25px] font-bold italic">
      MY{" "}
      <span className="bg-linear-to-r from-[#2d6c93] to-[#1e5272]  bg-clip-text text-transparent">
        Issued Books
      </span>
    </h1>

    <p className="text-sm font-semibold text-gray-500 mt-1">
      Monitor All Books Issued to You with Return Dates and Status Updates
    </p>
  </div>

</div>

      {/* STATS  */}
<div className="grid gap-4 my-10 grid-cols-1 md:grid-cols-2  sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          icon={<FaBook />}
          title="Total Issued"
          count={stats.totalIssued}
          color="#3b82f6"
          bgColor="bg-blue-50"
        />
        <DashboardCard
          icon={<FaEdit />}
          title="Active Issued"
          count={stats.activeIssued}
          color="#22c55e"
          bgColor="bg-green-50"
        />
        <DashboardCard
          icon={<FaUndo />}
          title="Returned"
          count={stats.returned}
          color="#6366f1"
          bgColor="bg-indigo-50"
        />
        <DashboardCard
          icon={<FaArrowRight />}
          title="Overdue"
          count={stats.overdue}
          color="#ef4444"
          bgColor="bg-red-50"
        />
      </div>

     {/* CARDS */}
<div className="mt-6">

  {/* SCROLL CONTAINER */}
  <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white">

    <table className="min-w-175 w-full text-sm border-collapse">

      {/* HEADER */}
      <thead className="bg-[#2d6c93]  text-white sticky top-0 z-10">
        <tr>
          <th className="p-3 text-left font-semibold">ISBN</th>
          <th className="p-3 text-left font-semibold">Author</th>
          <th className="p-3 text-left font-semibold">Book</th>
          <th className="p-3 text-left font-semibold">Issue Date</th>
          <th className="p-3 text-left font-semibold">Return Date</th>
          <th className="p-3 text-left font-semibold">Status</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody className="divide-y divide-gray-200">
        

        {myBooks.length === 0 ? (
           <tr>
             <td colSpan="10" className="p-8">
               
               <div className="flex flex-col items-center justify-center text-center 
                               bg-white rounded-2xl py-10 px-6 
                                border border-gray-100">
         
                 <div className="bg-gray-200 p-4 rounded-full mb-3">
                         <FaBookReader className="text-3xl text-gray-400" />
                       </div>
         
                 {/* Title */}
                 <h2 className="text-xl font-semibold text-gray-700">
                   No Issued Books Found
                 </h2>
         
                 {/* Description */}
                 <p className="text-md text-gray-400 mt-2">
                   No books have been issued yet.
                 </p>
         
                 <p className="text-sm text-gray-400 mt-1">
                   Data will appear once books are issued.
                 </p>
         
               </div>
         
             </td>
           </tr>
         ) : (
          myBooks.map((item) => (
            <tr
              key={item._id}
              className="hover:bg-blue-50 transition duration-200"
            >

              
              {/* ISBN */}
              <td className="p-3 text-gray-700 whitespace-nowrap">
                {item.book?.isbn || "N/A"}
              </td>

                <td className="p-3 font-medium text-gray-900 capitalize whitespace-nowrap">
                 {item.book?.author || "Unknown author"}
              </td>

             
              {/* BOOK */}
              <td className="p-3 font-medium text-gray-900 capitalize whitespace-nowrap">
                 {item.book?.title || "Unknown Book"}
              </td>


              <td className="p-3 text-gray-800 whitespace-nowrap">
                {formatDate(item.issueDate)}
              </td>

              <td className="p-3 text-gray-800 whitespace-nowrap">
                {item.returnDate
                  ? formatDate(item.returnDate)
                  : "Not Returned"}
              </td>

              <td className="p-3">
                <span
                  className={`px-3 py-1 text-xs capitalize font-medium rounded-full
                  ${
                    item.status === "issued"
                      ? "bg-green-100 text-green-700"
                      : item.status === "overdue"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {item.status}
                </span>
              </td>

            </tr>
          ))
        )}

      </tbody>
    </table>
  </div>
</div>



       {totalPages > 1 && (
  <div className="flex justify-end items-center gap-3 mt-6 pb-6">

    {/* Prev Button */}
    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className="flex items-center gap-1 px-4 py-1.5 rounded-md border border-gray-300 text-gray-600
      bg-white hover:bg-gray-100 hover:text-[#00455c]
      active:scale-95 transition-all duration-200
      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
    >
      <FaArrowLeft className="text-sm" />
      <span className="text-sm font-medium">Prev</span>
    </button>

    {/* Page Info */}
    <span className="text-sm font-semibold text-gray-700 px-2">
      {page} <span className="text-gray-400">of</span> {totalPages}
    </span>

    {/* Next Button */}
    <button
      disabled={page === totalPages}
      onClick={() => setPage(page + 1)}
      className="flex items-center gap-1 px-4 py-1.5 rounded-md border border-gray-300 text-gray-600
      bg-white hover:bg-gray-100 hover:text-[#00455c]
      active:scale-95 transition-all duration-200
      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
    >
      <span className="text-sm font-medium">Next</span>
      <FaArrowRight className="text-sm" />
    </button>

  </div>
)}


    </div>
  );
}

export default Issuedbooks;
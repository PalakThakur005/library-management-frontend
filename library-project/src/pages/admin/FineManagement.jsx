import React from 'react'
import { useState,useEffect } from 'react';
import api from '../../components/Api/Axios';
import { FaBookReader , FaArrowLeft,FaArrowRight} from 'react-icons/fa';
import toast from 'react-hot-toast';

const FineManagement = () => {

  const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
const [issuedBooks, setIssuedBooks] = useState([]);    
  

const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

const getPaginatedbooks = async (pageNumber = 1) => {
  try {
    setLoading(true);

    const res = await api.get(
      `/api/issue/fined-books?page=${pageNumber}&limit=${limit}&search=${search}`
    );

    setIssuedBooks(res.data.data);
    setPage(res.data.page);
    setTotalPages(res.data.totalPages);

  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const delay = setTimeout(() => {
      getPaginatedbooks(1);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    getPaginatedbooks(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [search]);


  const formatDate = (date) => {
    if (!date) return "N/A";

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
        <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8 sm:mb-10">

  <div className="w-full lg:w-2/3">
    <h1 className="font-[Poppins] lg:text-[25px] md:text-[20px] text-[20px] font-bold italic">
      FINE{" "}
      <span className="bg-linear-to-r from-[#2d6c93] to-[#3d799f] bg-clip-text text-transparent">
        MANAGEMENT
      </span>
    </h1>

    <p className="lg:text-sm text-xs font-semibold text-gray-500 mt-1 lg:mt-2">
      Manage and track fines for students and teachers based on overdue book returns.
    </p>
  </div>

  <div className="w-full lg:w-1/3 flex lg:justify-end">
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="🔍 Search by title, name or email..."
      className="w-full sm:w-64  md:w-72 px-3 py-2 text-sm outline-none border border-gray-400 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-500"
    />
  </div>

</div>   


           <div className="mt-4 lg:mt-2">

        <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white">
          <table className="min-w-200 w-full text-sm border-collapse">
            <thead className="bg-[#2d6c93] text-white sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left font-semibold">User Name</th>
                <th className="p-3 text-left font-semibold">Email</th>
                <th className="p-3 text-left font-semibold">Book</th>
                 <th className="p-3 text-left font-semibold">Return Date</th>
                <th className="p-3 text-left font-semibold">Status</th>
                <th className="p-3 text-left font-semibold">Fine (₹)</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">

                 {loading ? (
                  <tr>
                    <td colSpan="5" className="p-5 text-center">
                      Loading...
                    </td>
                  </tr>
                ) :
             issuedBooks?.length === 0 ? (
  <tr>
    <td colSpan="10" className="p-8">
      
      <div className="flex flex-col items-center justify-center text-center 
                      bg-white rounded-2xl py-10 px-6 
                       border border-gray-100">

        <div className="bg-gray-200 p-4 rounded-full mb-3">
                <FaBookReader className="text-3xl text-gray-400" />
              </div>

        <h2 className="text-xl font-semibold text-gray-700">
          No Fined Books Found
        </h2>

        <p className="text-md text-gray-400 mt-2">
          No books have been fined yet.
        </p>

        <p className="text-sm text-gray-400 mt-1">
          Data will appear once books are fined.
        </p>

      </div>

    </td>
  </tr>
) : (
                issuedBooks?.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50 transition duration-200"
                  >
                    <td className="p-3 capitalize font-medium text-gray-900 whitespace-nowrap">
                      {item?.user?.name}
                    </td>

                   <td className="p-3 text-gray-800 whitespace-nowrap">
                      {item?.user?.email}
                    </td>

                    <td className="p-3 font-medium capitalize text-gray-900 whitespace-nowrap">
                      {item?.book?.title}
                    </td>
                    <td className="p-3 font-medium capitalize text-gray-900 whitespace-nowrap">
                      {formatDate(item?.returnDate)}
                    </td>

                    <td className="p-3">
                                               <div className="flex items-center gap-2">
                          <span
  className={`w-2.5 h-2.5 rounded-full
    ${item?.status === "issued"
      ? "bg-green-500"
      : item?.status === "returned"
        ? "bg-blue-500"
        : "bg-red-500"
    }`}
/>

<span
  className={`text-xs font-medium capitalize
    ${item?.status === "issued"
      ? "text-green-600"
      : item?.status === "returned"
        ? "text-blue-600"
        : "text-red-600"
    }`}
>
  {item?.status}
</span>
                          </div>
                     
                    </td>

                    <td className="p-3 font-medium capitalize text-gray-900 whitespace-nowrap">
                      {item?.fine}
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
              <span className="text-sm  font-medium">Next</span>
              <FaArrowRight className="text-sm" />
            </button>

          </div>
        )}
          

          </div>
          </div>
  )
}

export default FineManagement

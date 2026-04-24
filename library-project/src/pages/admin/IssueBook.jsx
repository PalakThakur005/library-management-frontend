import React, { useState, useEffect } from "react";
import { FaBook, FaEdit, FaUndo, FaArrowLeft, FaArrowRight, FaBookOpen, FaBookReader } from "react-icons/fa";
import api from "../../components/Api/Axios";
import toast from "react-hot-toast";
import MiniLoader from "../../components/CommonPages/Minloader";
import DashboardCard from "../../components/CommonPages/DashboardCard";
import CustomToolTip from "../../components/CommonPages/CustomToolTip";
import useTitle from "../../components/hooks/useTitle";

const IssueBook = () => {

  useTitle("Issue Library Books")


  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const [issueDate, setIssueDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState("all");
  const [search, setSearch] = useState("");
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [errors, setErrors] = useState({});
  const [editID, setEditId] = useState(null);



  //card

  const [stats, setStats] = useState({
    totalIssued: 0,
    issued: 0,
    returned: 0,
    overdue: 0
  });


  useEffect(() => {
    getStats();
  }, []);

  const getStats = async () => {
    try {
      const res = await api.get("/api/issue/statscard");
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };


  // pagination


  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4;

  const getPaginatedbooks = async (pageNumber = 1) => {
    try {
      const res = await api.get(
        `/api/issue/all?page=${pageNumber}&limit=${limit}&role=${selectedRole}&search=${search}`
      );

      setIssuedBooks(res.data.data);
      getStats();
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      getPaginatedbooks(1);
    }, 400);

    return () => clearTimeout(delay);
  }, [search, selectedRole]);

  useEffect(() => {
    getPaginatedbooks(page);
  }, [page, selectedRole]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedRole]);

  // for status

  const getStatus = (item) => {
    if (item.status === "returned") return "returned";

    const today = new Date();
    const due = new Date(item.returnDate); // ✅ FIXED

    if (today > due) return "overdue";

    return "issued";
  };


  // update issue book



  const handleEdit = (item) => {
    setShowForm(true);
    setEditMode(true);
    setEditId(item._id);

    setSelectedUser(item.user);
    setSelectedBook(item.book);

    setIssueDate(item.issueDate?.split("T")[0]);
    setReturnDate(item.returnDate?.split("T")[0]);
    setErrors({});
  };



  // return book
  const handleReturn = async () => {
    setLoading(true)
    try {
      await api.put(
        `/api/issue/return-book/${selectedIssue._id}`
      );

      toast.success("Book returned successfully");
      getPaginatedbooks(page);
      getStats();
      setShowReturnModal(false);
      setSelectedIssue(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Return failed");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
    fetchBooks();

  }, []);

  const fetchUsers = async () => {
    const res = await api.get("/api/auth/getRoles");
    setUsers(res.data);
  };


  const fetchBooks = async () => {
    const res = await api.get("/api/book/books");
    setBooks(res.data);
  };

  const handleUsers = (e) => {
    const user = users.find((u) => u._id === e.target.value);
    setSelectedUser(user);

    if (!user) return;

    const today = new Date();
    const issue = today.toISOString().split("T")[0];

    const expiry = new Date();

    if (user.role === "teacher") {
      expiry.setDate(today.getDate() + 14);
    } else {
      expiry.setDate(today.getDate() + 7);
    }

    setIssueDate(issue);
    setReturnDate(expiry.toISOString().split("T")[0]);
  };

  const handleBooks = (e) => {
    const book = books.find((b) => b._id === e.target.value);
    setSelectedBook(book);
  };


  // error empty
  useEffect(() => {
    if (showForm) {
      setErrors({});
    }
  }, [showForm]);




  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!selectedUser?._id) {
      newErrors.user = "User email is required";
    }

    if (!selectedBook?._id) {
      newErrors.book = "Book title is required";
    }


    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      if (editID) {
        await api.put(`/api/issue/update/${editID}`, {
          returnDate: returnDate
        })
        toast.success("Issue book updated Successfully");
      } else {
        await api.post(`/api/issue/issue-book`, {
          userId: selectedUser._id,
          bookId: selectedBook._id,
          department: selectedUser?.department?._id,
          returnDate: returnDate,
        });
        toast.success("Issued book successfully");
      }

      getPaginatedbooks(page);
      getStats();
      setEditMode(false)
      setShowForm(false);
      setSelectedUser(null);
      setSelectedBook(null);
      setIssueDate("");
      setReturnDate("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to issue book");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center lg:gap-4   ">
                    <div>
            <h1 className="font-[Poppins] lg:text-[25px] md:text-[20px]  text-[20px] font-bold italic">
            ISSUE <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
             {" "}BOOKS</span>
          </h1>
            <p className="lg:text-sm  text-xs font-semibold  text-gray-500 pb-5 lg:pb-10">
            Assign and manage books for students and teachers with ease.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
            className="w-auto cursor-pointer mb-5 text-[10px] sm:text-[13px] lg:text-[15px] sm:w-auto self-start flex items-center gap-2 bg-blue-600 text-white lg:px-4   py-2 px-2 text-sm rounded-lg hover:bg-blue-700 transition"
        >
          <FaBook />
          Issue Book
        </button>
      </div>



      <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">

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
          count={stats.issued}
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


 

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 lg:mt-10 mt-7 lg:mb-8 mb-6 ">
        <div className="flex flex-wrap gap-2">
          {/* ALL */}
          <button
            onClick={() => setSelectedRole("all")}
            className={`px-4 py-2 cursor-pointer rounded transition ${selectedRole === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
          >
            All
          </button>

          {/* TEACHER */}
          <button
            onClick={() => setSelectedRole("teacher")}
            className={`px-4 py-2 cursor-pointer rounded transition ${selectedRole === "teacher"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
          >
            Teacher
          </button>

          {/* STUDENT */}
          <button
            onClick={() => setSelectedRole("student")}
            className={`px-4 py-2 cursor-pointer rounded transition ${selectedRole === "student"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
          >
            Student
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search by name or email..."
          className="w-auto sm:w-56 md:w-64 px-3 py-2 text-sm outline-none border border-gray-400 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-500 self-start"
        />
      </div>

      {/* FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm  flex justify-center items-center z-1100 ">
          <div
            className="bg-white w-[92%] sm:w-[80%] md:w-[60%] lg:w-[45%]
                          max-h-[75vh] lg-max-h-[90vh] overflow-y-auto
                          rounded-2xl shadow-xl p-6 md:p-8"
          >
            <div className="flex justify-between items-center border-b pb-3 mb-5">
              <h2 className="text-xl font-semibold">
                {isEditMode ? "Edit Issue Book" : "Issue Book"}
              </h2>

              <button
                onClick={() => {

                  setShowForm(false);
                  setSelectedUser(null);
                  setSelectedBook(null);
                  setIssueDate("");
                  setReturnDate("");
                  setErrors({});
                }}
                className="text-2xl cursor-pointer text-gray-500 hover:text-red-500"
              >
                &times;
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <select
                    disabled={isEditMode}
                    value={selectedUser?._id || ""}
                    onChange={(e) => {
                      handleUsers(e);
                      setErrors((prev) => ({ ...prev, user: "" }));
                    }}

                    className={`w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100
                      ${isEditMode ? "text-gray-500 cursor-not-allowed" : ""}
                      `}
                  >
                    <option value="">Select Email</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.email}
                      </option>
                    ))}
                  </select>
                  {errors.user && (
                    <p className="text-red-500   text-start text-sm">{errors.user}</p>
                  )}
                </div>


                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <input
                    value={selectedUser?.name || ""}
                    readOnly
                    className="w-full mt-1 p-2.5 border-2 cursor-not-allowed text-gray-600 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="text-sm text-gray-600">Role</label>
                  <input
                    value={selectedUser?.role || ""}
                    readOnly
                    className="w-full mt-1 p-2.5 border-2 cursor-not-allowed text-gray-600 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>


                <div>
                  <label className="text-sm text-gray-600">Department</label>
                  <input
                    value={selectedUser?.department?.name || ""}
                    readOnly
                    className="w-full mt-1 p-2.5 border-2 cursor-not-allowed text-gray-600 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>


              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Book Title</label>
                  <select
                    disabled={isEditMode}
                    value={selectedBook?._id || ""}
                    onChange={(e) => {
                      handleBooks(e);
                      setErrors((prev) => ({ ...prev, book: "" }));
                    }}
                    className={`w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100
                      ${isEditMode ? "text-gray-500 cursor-not-allowed" : ""}
                      `}
                  >
                    <option value="">Select Book</option>
                    {books.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                  {errors.book && (
                    <p className="text-red-500   text-start text-sm">{errors.book}</p>
                  )}
                </div>


                <div>
                  <label className="text-sm text-gray-600">ISBN</label>
                  <input
                    value={selectedBook?.isbn || ""}
                    readOnly
                    className="w-full mt-1 p-2.5 border-2 cursor-not-allowed text-gray-600 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Issue Date</label>
                  <input
                    value={issueDate}
                    readOnly
                    className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Return Date</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) =>
                      setReturnDate(e.target.value)
                    }
                    className="w-full mt-1 p-2.5 border-2  border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>


              {/* BUTTONS RIGHT */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditMode(false);
                    setEditId(null);

                    setSelectedUser(null);
                    setSelectedBook(null);
                    setIssueDate("");
                    setReturnDate("");
                    setErrors({});
                  }}
                  className="px-4 py-2 cursor-pointer  bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 cursor-pointer py-2 rounded-lg text-white flex items-center gap-2
                    ${loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                    }`}
                >
                  {loading ? (
                    <>
                      <MiniLoader size="w-5 h-5" />
                      {isEditMode ? "Updating..." : "Issuing..."}
                    </>
                  ) : isEditMode ? (
                    "Update Book"
                  ) : (
                    "Issue Book"
                  )}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="mt-4 lg:mt-2">
        <h3 className="text-lg font-semibold mb-4">Issued Books</h3>

        <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white">
          <table className="min-w-200 w-full text-sm border-collapse">
            <thead className="bg-blue-600 text-white sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left font-semibold">User Name</th>
                <th className="p-3 text-left font-semibold">Email</th>
                <th className="p-3 text-left font-semibold">Department</th>
                <th className="p-3 text-left font-semibold">Title</th>
                <th className="p-3 text-left font-semibold">ISBN</th>
                <th className="p-3 text-left font-semibold">Role</th>
                <th className="p-3 text-left font-semibold">Issue Date</th>
                <th className="p-3 text-left font-semibold">Due Date</th>
                <th className="p-3 text-left font-semibold">Status</th>
                <th className="p-3 text-left font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
             {issuedBooks?.length === 0 ? (
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
         <button
        onClick={() => setShowForm(true)}
        className="mt-6 inline-flex items-center gap-2 bg-blue-500 text-white 
                   px-6 py-2.5 rounded-lg font-medium shadow-md 
                   hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
      >
         Issue Book
      </button>

      </div>

    </td>
  </tr>
) : (
                issuedBooks?.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50 transition duration-200"
                  >
                    {/* USER NAME */}
                    <td className="p-3 capitalize font-medium text-gray-900 whitespace-nowrap">
                      {item.user?.name}
                    </td>

                    {/* EMAIL */}
                    <td className="p-3 text-gray-800 whitespace-nowrap">
                      {item.user?.email}
                    </td>

                    {/* DEPARTMENT */}
                    <td className="p-3 font-medium capitalize text-gray-900 whitespace-nowrap">
                      {item.user?.department?.name }
                       
                    </td>

                    <td className="p-3 font-medium capitalize text-gray-900 whitespace-nowrap">
                      {item.book?.title}
                    </td>

                    <td className="p-3 font-medium text-gray-900 whitespace-nowrap">
                      {item.book?.isbn}
                    </td>

                    <td className="p-3 whitespace-nowrap">
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium capitalize
      ${
        item.user?.role === "student"
          ? "bg-blue-100 text-blue-700"
          : item.user?.role === "teacher"
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600"
      }`}
  >
    {item.user?.role}
  </span>
</td>

                    <td className="p-3 text-gray-700 whitespace-nowrap">
                      {formatDate(item.issueDate)}
                    </td>

                    <td className="p-3 text-gray-700 whitespace-nowrap">
                      {formatDate(item.returnDate)}
                    </td>
                    <td className="p-3">
                      {(() => {
                        const status = getStatus(item);

                        return (
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2.5 h-2.5 rounded-full
                    ${status === "issued"
                                  ? "bg-green-500"
                                  : status === "returned"
                                    ? "bg-blue-500"
                                    : "bg-red-500"
                                }`}
                            ></span>

                            <span
                              className={`text-xs font-medium capitalize
                    ${status === "issued"
                                  ? "text-green-600"
                                  : status === "returned"
                                    ? "text-blue-600"
                                    : "text-red-600"
                                }`}
                            >
                              {status}
                            </span>
                          </div>
                        );
                      })()}
                    </td>

                    {/* ACTION */}
                    <td className="p-3">
                      <div className="flex justify-start gap-4 text-lg whitespace-nowrap">
                        <CustomToolTip text="Edit Book">
                        <FaEdit
                          onClick={() => {
                            if (item.status === "returned") return;
                            handleEdit(item);
                          }}
                          className={`cursor-pointer transition
                ${item.status === "returned"
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:scale-110 hover:text-gray-600"
                            }`}
                        />
                        </CustomToolTip>


                       <CustomToolTip text="Return">
                        <FaUndo
                          size={13}
                          onClick={() => {
                            setSelectedIssue(item);
                            setShowReturnModal(true);
                          }}
                          className="text-gray-600 mr-4 mt-0.5 cursor-pointer hover:scale-110 hover:text-gray-600 transition"
                        />
                        </CustomToolTip>
                      </div>
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

      {/* return pop up */}

      {showReturnModal && selectedIssue && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white w-[92%] sm:w-105 rounded-2xl shadow-2xl overflow-hidden">

            <div className="bg-linear-to-r from-blue-600 to-blue-500 px-6 py-4">
              <h2 className="text-white text-lg font-semibold">
                Return Book
              </h2>
              <p className="text-blue-100 text-xs mt-1">
                Confirm book return action
              </p>
            </div>

            {/* BODY */}
            <div className="p-6">

              <p className="text-gray-600 text-sm mb-5">
                Are you sure you want to return this issued book?
              </p>

              {/* INFO CARD */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">

                <div className="flex justify-evenly">
                  <div>
                    <p className="text-xs text-gray-500">Book Title</p>
                    <p className=" text-gray-700">
                      {selectedIssue?.book?.title}
                    </p>
                  </div>


                  {/* <div>
            <p className="text-xs text-gray-500">User Name</p>
            <p className="font-medium text-gray-700">
              {selectedIssue?.user?.name}
            </p>
          </div> */}
                  <div>
                    <p className="text-xs text-gray-500">User email</p>
                    <p className=" text-gray-700">
                      {selectedIssue?.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-gray-500">Status</span>

                  <span
                    className={`font-semibold capitalize ${selectedIssue?.status === "issued"
                      ? "text-green-600"
                      : "text-blue-600"
                      }`}
                  >
                    {selectedIssue?.status === "issued" ? "Issued" : "Returned"}
                  </span>
                </div>


              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 mt-6">

                {/* CANCEL */}
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="px-4 py-2 cursor-pointer rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >
                  Cancel
                </button>

                {/* CONFIRM */}
                <button
                  onClick={handleReturn}
                  disabled={loading}
                  className={`px-5 py-2  cursor-pointer rounded-lg text-white shadow-md transition-all duration-200 flex items-center justify-center gap-2
                   ${loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                    }`}
                >
                  {loading ? (
                    <>
                      <MiniLoader size="w-4 h-4" />
                      <span>Returning...</span>
                    </>
                  ) : (
                    "Confirm Return"
                  )}
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
};

export default IssueBook;

import React, { useState, useEffect } from "react";
import { FaIdCard, FaEdit, FaArrowRight, FaArrowLeft , FaCheckCircle , FaBuilding , FaTimesCircle} from "react-icons/fa";
import MiniLoader from "../../components/CommonPages/Minloader";
import api from "../../components/Api/Axios";
import  toast  from "react-hot-toast";
import DashboardCard from "../../components/CommonPages/DashboardCard";
import CustomToolTip from "../../components/CommonPages/CustomToolTip";
import useTitle from "../../components/hooks/useTitle";

const CardIssue = () => {

  useTitle("Issue Library Card")


  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [isEditMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState({});

     //card
   
   const [stats, setStats] = useState({
    total: 0,
    inactive: 0,
    active: 0,
  });


  useEffect(() => {
    getStats();
  }, []);

  const getStats = async () => {
    try {
      const res = await api.get("/api/card/statscard");
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  

  //pagination

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;

  const getPaginatedCards = async (pageNumber = 1) => {
    try {
      const res = await api.get(
        `/api/card/pagination?page=${pageNumber}&limit=${limit}&role=${selectedRole}&search=${search}`
      );

      setCards(res.data.data);
      getStats();
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };


  useEffect(() => {
    getUsers();
  }, []);




  useEffect(() => {
  const delay = setTimeout(() => {
    getPaginatedCards(page);
  }, 400);

  return () => clearTimeout(delay);
}, [page, selectedRole, search]);


  const getUsers = async () => {
    const res = await api.get("/api/auth/getRoles");
    setUsers(res.data);
  };





  const handleSelect = (e) => {
    const user = users.find((u) => u._id === e.target.value);
    setSelectedUser(user);

    if (user) {
      const today = new Date().toISOString().split("T")[0];
      setIssueDate(today);
    }

    const expiry = new Date();
    if (user.role === "teacher") {
      expiry.setFullYear(expiry.getFullYear() + 1);
    } else if (user.role === "student") {
      expiry.setFullYear(expiry.getFullYear() + 1);
    }

    setExpiryDate(expiry.toISOString().split("T")[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     let newErrors = {};

    if (!selectedUser?._id) {
      newErrors.user = "User email is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      await api.post("/api/card/issuecard", {
        userId: selectedUser?._id,
        expiryDate,
      });
      getPaginatedCards(page);
      getStats();
      toast.success("Issued card successfully");
      setShowForm(false);

      setSelectedUser(null);
      setIssueDate("");
      setExpiryDate("");
    } catch (error) {
      console.log(error.response)
      toast.error(error.response?.data?.message || "Failed to issue card");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (card) => {
    setShowForm(true);
    setEditMode(true);
    setEditId(card._id);

    setSelectedUser(card.user);
    setIssueDate(card.issueDate.split("T")[0]);
    setExpiryDate(card.expiryDate.split("T")[0]);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/api/card/update-card/${editId}`, {
        expiryDate,
      });

      toast.success("Card updated successfully");

      getPaginatedCards(page);
      getStats();
      setShowForm(false);
      setEditMode(false);
      setEditId(null);
      setSelectedUser(null);
      setIssueDate("");
      setExpiryDate("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
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
    <div className=" min-h-screen">
          <div className="max-w-7xl mx-auto ">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center lg:gap-4   ">
          <div>
            <h1 className="font-[Poppins] lg:text-[25px] md:text-[20px]  text-[20px] font-bold italic">
              ISSUE{" "}
              <span className="bg-linear-to-r from-[#2d6c93] to-[#3d799f] bg-clip-text text-transparent">
                {" "}
                LIBRARY CARD
              </span>
            </h1>
            <p className="lg:text-sm  text-xs font-semibold  text-gray-500 pb-5 lg:pb-10">
              {" "}
              Issue and manage library cards for students and teachers.{" "}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="w-auto text-[10px] sm:text-[13px]   lg:text-[15px] cursor-pointer mb-5  sm:w-auto self-start flex items-center gap-2  text-white lg:px-4 py-2 px-2 text-sm rounded-lg bg-[#2d6c93] hover:bg-[#3d799f] transition"
          >
            <FaIdCard />
            Issue Card
          </button>
        </div>

        <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">

  {/* Total Department */}
  <DashboardCard
    icon={<FaBuilding />}
    title="Total Card"
    count={stats.total}
    color="#3b82f6"
    bgColor="bg-blue-50"
  />

  {/* Active Department */}
  <DashboardCard
    icon={<FaCheckCircle />}
    title="Active Cards"
    count={stats.active}
    color="#10b981"
    bgColor="bg-green-50"
  />

  {/* Inactive Department */}
  <DashboardCard
    icon={<FaTimesCircle />}
    title="Inactive Cards"
    count={stats.inactive}
    color="#ef4444"
    bgColor="bg-red-50"
  />

</div>

  


        {/* form */}

        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm   flex justify-center items-center z-1100">
            <div className="bg-white w-[95%] sm:w-105 rounded-2xl shadow-xl p-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditMode ? "Edit Library Card" : "Issue Library Card"}
                </h2>

                <button
                  onClick={() => {
                    setShowForm(false);
                     setErrors({});
                    setSelectedUser(null);
                    setIssueDate("");
                    setExpiryDate("");
                   
                  }}
                  className="text-gray-400 cursor-pointer hover:text-red-500 text-xl font-bold transition"
                >
                  &times;
                </button>
              </div>

              <form
                onSubmit={isEditMode ? handleUpdateSubmit : handleSubmit}
                className="space-y-4"
              >
                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600">
                    Select Email
                  </label>
                  <select
                    value={selectedUser?._id || ""}
                    disabled={isEditMode}
                    onChange={(e) => {
                      handleSelect(e);
                      setErrors((prev) => ({ ...prev, user: "" }));
                    }}
                    className={`w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100
                      ${isEditMode ? "text-gray-500 cursor-not-allowed" : ""}
                      `}
                  >
                    <option value="">Select Email</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.email}
                      </option>
                    ))}
                  </select>
                  
                </div>
                {errors.user && (
                    <p className="text-red-500   text-center ml-5 text-sm">{errors.user}</p>
                  )}

                {/* Name */}
                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600 ">Name</label>
                  <input
                    value={selectedUser?.name || ""}
                    readOnly
                    className="w-full mt-1 p-2.5 border-2 cursor-not-allowed text-gray-600 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Role */}
                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm  text-gray-600">Role</label>
                  <input
                    value={selectedUser?.role || ""}
                    readOnly
                    className="w-full mt-1 p-2.5 border-2 cursor-not-allowed text-gray-600 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Issue Date */}
                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600">
                    Issue Date
                  </label>
                  <input
                    value={issueDate}
                    readOnly
                    className={`w-full mt-1 p-2.5 border-2 cursor-not-allowed  border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100
                      ${isEditMode ? "text-gray-500 cursor-not-allowed" : ""}
                      `}
                  />
                </div>

                {/* Expiry Date */}
                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Button */}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setErrors({});
                      setSelectedUser(null);
                      setIssueDate("");
                      setExpiryDate("");
                    }}
                    type="button"
                    className="px-4 py-2 cursor-pointer rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={loading}
                    type="submit"
                    className={`flex items-center justify-center  cursor-pointer gap-2 px-4 py-2 rounded-lg text-white text-sm transition shadow
                    ${loading
                        ? "cursor-not-allowed bg-[#2d6c93] opacity-80"
                        : "bg-[#2d6c93] hover:bg-[#1e5272] "
                      }`}
                  >
                    {loading ? (
                      <>
                        <MiniLoader size="w-5 h-5" />
                        {isEditMode ? "Updating..." : "Issuing..."}
                      </>
                    ) : isEditMode ? (
                      "Update Card"
                    ) : (
                      "Issue Card"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between  mt-10 gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {/* ALL */}
            <button
              onClick={() => setSelectedRole("all")}
              className={`px-4  cursor-pointer py-2 rounded transition ${selectedRole === "all"
                  ? "bg-[#2d6c93]  text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
            >
              All
            </button>

            {/* TEACHER */}
            <button
              onClick={() => setSelectedRole("teacher")}
              className={`px-4 cursor-pointer py-2 rounded transition ${selectedRole === "teacher"
                  ? "bg-[#2d6c93]  text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
            >
              Teacher
            </button>

            {/* STUDENT */}
            <button
              onClick={() => setSelectedRole("student")}
              className={`px-4  cursor-pointer py-2 rounded transition ${selectedRole === "student"
                  ? "bg-[#2d6c93] text-white"
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


        {/* card  */}

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
{cards?.length === 0 ? (
  <div className="col-span-full flex justify-center p-6">
    
    <div className="w-full max-w-md text-center bg-white shadow-[0_0_20px_rgba(0,0,0,0.20)] rounded-2xl px-8 py-5 border border-gray-100 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] transition">

      <div className="flex justify-center">
  <div className="bg-gray-200 p-4 rounded-full mb-3">
    <FaIdCard className="text-3xl text-gray-400" />
  </div>
</div>

      <h2 className="text-xl font-semibold text-gray-700">
        No Cards Found
      </h2>

      <p className="text-md text-gray-400 mt-2">
        You haven’t added any cards yet.
      </p>

      <p className="text-sm text-gray-400 mt-1">
        Data will appear once it is added.
      </p>

      <button
        onClick={() => setShowForm(true)}
        className="mt-6 inline-flex items-center gap-2 bg-[#2d6c93] hover:bg-[#1e5272]  text-white 
                   px-6 py-2.5 rounded-lg font-medium shadow-md 
                  hover:shadow-lg transition-all duration-300"
      >
        Issue Card
      </button>

    </div>
  </div>

) : (

    cards.map((card) => (
      <div
  key={card._id}
  className="group relative bg-white overflow-hidden"
  style={{
    width: "272px",
    borderRadius: "20px",
    border: "1.5px solid #c2daea",
    fontFamily: "'DM Sans', sans-serif",
    transition: "transform 0.28s cubic-bezier(.22,1,.36,1), box-shadow 0.28s ease",
  }}
  onMouseEnter={e => {
    e.currentTarget.style.transform = "translateY(-8px) scale(1.01)";
    e.currentTarget.style.boxShadow = "0 24px 48px rgba(45,108,147,0.18)";
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = "";
    e.currentTarget.style.boxShadow = "";
  }}
>
  {/* Diagonal accent */}
  <div
    style={{
      position: "absolute", top: 0, left: 0,
      width: "100%", height: "72px", zIndex: 0,
      background: card.user?.status === "inactive" ? "#7a9db5" : "#2d6c93",
      clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 100%)",
    }}
  />

  {/* Header */}
  <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "14px 16px 0" }}>
    <div
      style={{
        width: "50px", height: "50px", borderRadius: "14px",
        background: "#fff",
        color: card.user?.status === "inactive" ? "#7a9db5" : "#2d6c93",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "20px",
        border: "2px solid rgba(45,108,147,0.2)",
        boxShadow: "0 4px 12px rgba(45,108,147,0.15)",
        transition: "transform 0.2s",
      }}
      className="group-hover:transform:[rotate(-4deg)_scale(1.07)]"
    >
      {card.user?.name?.charAt(0).toUpperCase()}
    </div>

    <div style={{
      fontFamily: "'Syne', sans-serif", fontSize: "9.5px", fontWeight: 700,
      letterSpacing: "1.2px", color: "rgba(255,255,255,0.9)",
      background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
      padding: "4px 9px", borderRadius: "20px",
    }}>
      {card.cardNumber}
    </div>
  </div>

  {/* Body */}
  <div style={{ padding: "44px 16px 14px" }}>
    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, color: card.user?.status === "inactive" ? "#5a7a8a" : "#1a3d52", textTransform: "capitalize", marginBottom: "2px" }}>
      {card.user?.name}
    </div>
    <div style={{ fontSize: "11px", color: "#7a9db5", marginBottom: "14px" }}>
      {card.user?.email}
    </div>

    <div style={{ height: "1px", background: "#e8f2f8", margin: "0 0 12px" }} />

    <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11.5px", color: "#8fa8b8" }}>Role</span>
        <span style={{
          background: card.user?.status === "inactive" ? "#f0f4f6" : "#e5f1f8",
          color: card.user?.status === "inactive" ? "#7a9db5" : "#2d6c93",
          border: `1px solid ${card.user?.status === "inactive" ? "#d0e0ea" : "#b8d8ea"}`,
          padding: "3px 10px", borderRadius: "20px",
          fontSize: "10.5px", fontWeight: 600, textTransform: "capitalize",
        }}>
          {card.user?.role}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11.5px", color: "#8fa8b8" }}>Issued</span>
        <span style={{ fontSize: "12px", fontWeight: 500, color: "#2d4d60" }}>{formatDate(card.issueDate)}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11.5px", color: "#8fa8b8" }}>Expiry</span>
        <span style={{ fontSize: "12px", fontWeight: 500, color: "#2d4d60" }}>{formatDate(card.expiryDate)}</span>
      </div>
    </div>
  </div>

  {/* Footer */}
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px 14px", borderTop: "1px solid #e8f2f8", marginTop: "4px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
      <span style={{
        width: "8px", height: "8px", borderRadius: "50%", display: "inline-block",
        background: card.user?.status === "active" ? "#2d6c93" : "#b0c9d9",
        animation: card.user?.status === "active" ? "ripple 2s infinite" : "none",
      }} />
      <span style={{
        fontSize: "11px", fontWeight: 600,
        color: card.user?.status === "active" ? "#2d6c93" : "#8fa8b8",
      }}>
        {card.user?.status === "active" ? "Active" : "Inactive"}
      </span>
    </div>

    <CustomToolTip text="Edit Card">
      <button
        onClick={() => {
          if (card.user?.status === "inactive") return;
          handleUpdate(card);
        }}
        style={{
          width: "32px", height: "32px", borderRadius: "10px",
          border: card.user?.status === "inactive" ? "1.5px solid #dde8ed" : "1.5px solid #b8d8ea",
          background: card.user?.status === "inactive" ? "#f2f4f5" : "#f0f8fc",
          color: card.user?.status === "inactive" ? "#b0c9d9" : "#2d6c93",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: card.user?.status === "inactive" ? "not-allowed" : "pointer",
          opacity: card.user?.status === "inactive" ? 0.6 : 1,
          transition: "all 0.2s cubic-bezier(.22,1,.36,1)",
        }}
        onMouseEnter={e => {
          if (card.user?.status === "inactive") return;
          e.currentTarget.style.background = "#2d6c93";
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.transform = "scale(1.12)";
        }}
        onMouseLeave={e => {
          if (card.user?.status === "inactive") return;
          e.currentTarget.style.background = "#f0f8fc";
          e.currentTarget.style.color = "#2d6c93";
          e.currentTarget.style.transform = "";
        }}
      >
        <FaEdit size={13} />
      </button>
    </CustomToolTip>
  </div>

  <div
    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
    style={{ borderRadius: "20px", boxShadow: `inset 0 0 0 1.5px ${card.user?.status === "inactive" ? "#b0c9d9" : "#2d6c93"}` }}
  />

</div>
    ))
  )}
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
    </div>
  );
};

export default CardIssue;

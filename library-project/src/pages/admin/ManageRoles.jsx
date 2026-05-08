import React, { useState, useEffect } from "react";
import {
  FaUserPlus,
  FaArrowRight,
  FaArrowLeft,
  FaEdit,
  FaPowerOff,
  FaKey,
  FaUsers,
  FaUserTie,
  FaUserGraduate,
  FaCheckCircle,
} from "react-icons/fa";
import MiniLoader from "../../components/CommonPages/Minloader";
import api from "../../components/Api/Axios"
import toast from "react-hot-toast";
import ResetPassword from "./ResetPassword";
import DashboardCard from "../../components/CommonPages/DashboardCard";
import CustomToolTip from "../../components/CommonPages/CustomToolTip";
import useTitle from "../../components/hooks/useTitle";

const ManageRoles = () => {

  useTitle("User Management")

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const namePattern = /^[A-Za-z\s]{3,}$/;


  const [formData, setFormData] = useState({
    role: "",
    department: "",
    name: "",
    email: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [roleError, setRoleError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [departmentError, setDepartmentError] = useState("");
  const [editID, setEditId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("all");
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [userID, setUserID] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4;

  const [stats, setStats] = useState({
    total: 0,
    student: 0,
    teacher: 0,
    active: 0,
  });


  useEffect(() => {
    getStats();
  }, []);

   useEffect(() => {
  const delay = setTimeout(() => {
    getPaginatedCards(1);
    setPage(1);
  }, 400);

  return () => clearTimeout(delay);
}, [search, selectedRole]);

useEffect(() => {
  getPaginatedCards(page);
}, [page]);
  useEffect(() => {
    getDepartments();
  }, []);

  const getStats = async () => {
    try {
      const res = await api.get("/api/auth/dashboard-stats");;
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };


  //pagination



  const getPaginatedCards = async (pageNumber = 1) => {
    try {
      const res = await api.get(
        `/api/auth/pagination?page=${pageNumber}&limit=${limit}&role=${selectedRole}&search=${search}`
      );

      setRoles(res.data.data);
      getStats();
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };


  // department
  const getDepartments = async () => {
    const res = await api.get("/api/dept/get-dep");
    setDepartments(res.data);
  };


  const activeDepartment = departments.filter(
    (item) => item.status?.toLowerCase() === "active"
  );



  const handleRoles = () => {
    setShowForm(true);
    setEditMode(false);
    setEditId(null);
    setFormData({
      role: "",
      department: "",
      name: "",
      email: "",
    });
  };
  const handleCancel = () => {
    setEditId(null);
    setShowForm(false);
    setFormData({
      role: "",
      department: "",
      name: "",
      email: "",
    });
  };

  const handleCross = () => {
    setEditId(null);
    setShowForm(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setRoleError("");
    setNameError("");
    setEmailError("");
    setDepartmentError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) return setRoleError("Please select role");
    if (!formData.department)
      return setDepartmentError("Please select department");
    if (!formData.name) return setNameError("Name is required");
    if (!namePattern.test(formData.name))
      return setNameError("Name should have only alphabets");

    if (!formData.email) return setEmailError("Email is required");
    if (!emailPattern.test(formData.email))
      return setEmailError("Invalid email");

    const existUser = roles.some(
      (item) => item.email === formData.email && item._id !== editID,
    );

    if (existUser) return setEmailError("Email already exists");

    try {
      if (editID) {
        setLoading(true);
        await api.put(`/api/auth/updateUser/${editID}`, formData);
        toast.success("User updated successfully");
      } else {
        setLoading(true);
        await api.post("/api/auth/register", formData);
        toast.success("User added successfully");
      }


      getPaginatedCards(page);
      setShowForm(false);
      getStats();
      setFormData({
        role: "",
        name: "",
        email: "",
      });

      setEmailError("");
      setRoleError("");
      setNameError("");

      setEditId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // get users

  //  useEffect(() => {
  //   getUser();
  // }, [])

  const getUser = async () => {
    try {
      const response = await axios.get(`${backenduri}/api/auth/getRoles`);
      setRoles(response.data);

    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch books");
    }
  };

  //update user

  const handleUpdate = (items) => {
    setShowForm(true);
    setEditMode(true);
    setEditId(items._id);
    setFormData({
      role: items.role,
      name: items.name,
      email: items.email,
      department: items.department?._id,
    });
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  //active/inactive

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      await api.put(`/api/auth/toggle-status/${selectedUserId}`);

      toast.success("Status updated");
      getPaginatedCards(page);
      getStats();
      setShowConfirm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  //delete user

  // const handleDelete = (id) => {
  //   setConfirmDelete(true)
  //   setUserID(id)

  // }
  // const handleNo = () => {
  //   setConfirmDelete(false)
  // }

  // const handleCut = () => {
  //   setConfirmDelete(false)
  // }

  // const handleYes = async () => {
  //   setLoading(true)
  //   try {
  //     await axios.delete(
  //       `${backenduri}/api/auth/deleteUser/${userID}`
  //     )
  //     const restUser = roles.filter((items) => items._id !== userID);
  //     setRoles(restUser)
  //     toast.success("User deleted successfully")
  //   } catch (error) {
  //     toast.error("Failed to delete item")
  //   }
  //   finally {
  //   setLoading(false);
  // }
  //       setConfirmDelete(false)
  // };

  //reset password

  const onCut = () => {
    setShowReset(false);
  };
  const onCancel = () => {
    setShowReset(false);
  };

  const handleResetPassword = (id) => {
    setShowReset(true);
    setUserID(id);
  };
  const onConfirm = async () => {
    setLoading(true);
    try {
      await api.put(`/api/auth/reset-password/${userID}`);
      toast.success("New password sent to email");
      setShowReset(false);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* {
        confirmDelete &&
        <DeleteConfirmation
          handleCut={handleCut}
          handleNo={handleNo}
          handleYes={handleYes}
          loading={loading}
        />
      } */}

      {showReset && (
        <ResetPassword
          user={roles.find((u) => u._id === userID)}
          onCut={onCut}
          onCancel={onCancel}
          onConfirm={onConfirm}
          loading={loading}
        />
      )}

    <div className=" max-w-7xl mx-auto ">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center lg:gap-4   ">
          <div>
            <h1 className="font-[Poppins] lg:text-[25px] md:text-[20px]  text-[20px] font-bold italic">
              USER{" "}
              <span className="bg-linear-to-r from-[#2d6c93] to-[#3d799f] bg-clip-text text-transparent">
                MANAGEMENT
              </span>
            </h1>
            <p className="lg:text-sm  text-xs font-semibold  text-gray-500 pb-5 lg:pb-10">
              Manage teachers and students efficiently
            </p>
          </div>

          <button
            onClick={handleRoles}
            className="w-auto  text-[10px] sm:text-[13px]  lg:text-[15px] cursor-pointer mb-5  sm:w-auto self-start flex items-center gap-2 text-white lg:px-4 py-2 px-2 text-sm rounded-lg bg-[#2d6c93] hover:bg-[#3d799f] transition"
          >
            <FaUserPlus />
            Add Role
          </button>
        </div>


<div className="grid gap-4 grid-cols-1 md:grid-cols-2  sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Users */}
          <DashboardCard
            icon={<FaUserPlus />}
            title="Total Users"
            count={stats.total}
            color="#3b82f6"
            bgColor="bg-blue-50"
          />

          {/* Teachers */}
          <DashboardCard
            icon={<FaUserTie />}
            title="Teachers"
            count={stats.teacher}
            color="#10b981"
            bgColor="bg-green-50"
          />

          {/* Students */}
          <DashboardCard
            icon={<FaUserGraduate />}
            title="Students"
            count={stats.student}
            color="#6366f1"
            bgColor="bg-indigo-50"
          />

          {/* Active Users */}
          <DashboardCard
            icon={<FaCheckCircle />}
            title="Active Users"
            count={stats.active}
            color="#22c55e"
            bgColor="bg-emerald-50"
          />



        </div>


        {/* POPUP */}

        {showForm && (
          <div className="fixed inset-0 z-1100 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full sm:w-[80%] md:w-[60%] lg:w-[45%] xl:w-[35%] p-6 sm:p-8 rounded-lg shadow-xl">
              {/* HEADER */}
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold text-gray-700">
                  {isEditMode ? "Edit Role Details" : "Add Role Details"}
                </h3>

                <p
                  onClick={handleCross}
                  className="cursor-pointer font-semibold text-2xl mb-2 hover:text-[#00304e]"
                >
                  &times;
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* ROLE */}

                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm text-gray-600">
                      Role <span className="text-red-700">*</span>
                    </label>
                    <select
                      value={formData.role}
                      onChange={handleChange}
                      name="role"
                      className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select Role</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                  {roleError && (
                    <p className="text-red-500  text-center text-sm">
                      {roleError}
                    </p>
                  )}

                  {/* department */}

                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm text-gray-600">
                      Department<span className="text-red-700">*</span>
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select Department</option>
                      {activeDepartment.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-red-500  text-center text-sm">
                    {departmentError}
                  </p>

                  {/* NAME */}

                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm text-gray-600">
                      Name <span className="text-red-700">*</span>
                    </label>
                    <input
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      name="name"
                      className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  {nameError && (
                    <p className="text-red-800 text-center text-sm">
                      {nameError}
                    </p>
                  )}

                  {/* EMAIL */}

                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm text-gray-600">
                      Email <span className="text-red-700">*</span>
                    </label>
                    <input
                      value={formData.email}
                      disabled={isEditMode}
                      onChange={handleChange}
                      type="email"
                      name="email"
                      title="Please enter a valid email address"
                      className={`w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100
                    ${isEditMode ? "text-gray-500 cursor-not-allowed" : ""}`}
                    />
                  </div>
                  {emailError && (
                    <p className="text-red-800 text-center text-sm">
                      {emailError}
                    </p>
                  )}
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 pt-2 mt-5">
                  <button
                    onClick={handleCancel}
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
                        {isEditMode ? "Updating..." : "Adding..."}
                      </>
                    ) : isEditMode ? (
                      "Update User"
                    ) : (
                      " Add user"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* POPUP */}

        {showConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center backdrop-blur justify-center z-1100">
            <div className="bg-white w-[90%] sm:w-100 p-6 rounded-xl shadow-lg relative">
              <span
                onClick={() => setShowConfirm(false)}
                className="absolute top-3 right-4 text-xl cursor-pointer text-gray-500 hover:text-black"
              >
                &times;
              </span>

              <h2 className="text-lg font-semibold mb-3">Confirm Action</h2>

              <p className="text-sm text-gray-600 mb-5">
                Are you sure you want to{" "}
                <span className="font-semibold">
                  {selectedStatus === "active" ? "Deactivate" : "Activate"}
                </span>{" "}
                this user?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 cursor-pointer py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={handleToggleStatus}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-[#2d6c93] hover:bg-[#1e5272]  text-white rounded"
                >
                  {loading ? (
                    <>
                      <MiniLoader size="w-5 h-5" />
                      Processing
                    </>
                  ) : (
                    "Yes"
                  )}
                </button>

                
              </div>
            </div>
          </div>
        )}




        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between  gap-4 lg:mb-7 mt-8">
          <div className="flex flex-wrap gap-2">
            {/* ALL */}
            <button
              onClick={() => setSelectedRole("all")}
              className={`px-4 py-2 cursor-pointer rounded transition ${selectedRole === "all"
                ? "bg-[#2d6c93]  text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
            >
              All
            </button>
            {/* TEACHER */}
            <button
              onClick={() => setSelectedRole("teacher")}
              className={`px-4 py-2 cursor-pointer rounded transition ${selectedRole === "teacher"
                ? "bg-[#2d6c93] text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
            >
              Teacher
            </button>

            {/* STUDENT */}
            <button
              onClick={() => setSelectedRole("student")}
              className={`px-4 py-2 cursor-pointer rounded transition ${selectedRole === "student"
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
            onChange={handleSearch}
            placeholder="🔍 Search by name or email..."
            className="w-auto sm:w-56 md:w-64 px-3 py-2 text-sm outline-none border border-gray-400 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-500 self-start"
          />
        </div>

        {/* TABLE */}
        <div className="mt-6  ">
          <h3 className="text-lg font-semibold mb-4">Added Roles</h3>


                   <div className="w-full max-w-full overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white">              
                    <table className="min-w-175 w-full  text-sm border-collapse">       
                     <thead className="bg-[#2d6c93] text-white sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left font-semibold">S.No</th>
                  <th className="p-3 text-left font-semibold">Name</th>
                  <th className="p-3 text-left font-semibold">Email</th>
                  <th className="p-3 text-left font-semibold">Department</th>
                  <th className="p-3 text-left font-semibold">Role</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                  <th className="p-3 text-left font-semibold">Action</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-gray-200">
                {roles.filter((items) => items.role !== "admin").length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8">
                      <div className="flex flex-col items-center text-center text-gray-500 
                  bg-white shadow-md rounded-xl py-3 px-6">

                        <div className="bg-gray-200 p-4 rounded-full mb-3">
                          <FaUsers className="text-3xl text-gray-400" />
                        </div>

                        <p className="text-xl font-semibold text-gray-700">
                          No users available yet
                        </p>

                        <p className="text-sm text-gray-400 mt-2">
                          Add users to manage roles, access, and activities.
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                          Data will appear once it is added.
                        </p>

                        <button
                          onClick={() => setShowForm(true)}
                          className="mt-5 flex items-center gap-2 bg-[#2d6c93] text-white 
             px-5 py-2.5 rounded-lg font-medium shadow-md 
             hover:bg-[#3d799f] hover:shadow-lg transition-all duration-300"
                        >
                          Add User
                        </button>

                      </div>
                    </td>
                  </tr>
                ) : (
                  roles
                    .filter((items) => items.role !== "admin")
                    .map((items, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50 transition duration-200"
                      >


                        <td className="p-3 text-gray-700 font-medium">
                          {(page - 1) * limit + index + 1}
                        </td>


                        <td className="p-3 capitalize text-gray-800 font-medium whitespace-nowrap">
                          {items.name}
                        </td>

                        <td className="p-3 text-gray-900 wrap-break-words max-w-50">
                          {items.email}
                        </td>

                        <td className="p-3 capitalize font-medium text-gray-900 whitespace-nowrap">
                          {items.department?.name}
                        </td>


                        <td className="p-3  whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs  font-medium rounded-full capitalize
                               ${items.role === "student" ? "bg-blue-100 text-blue-600" : ""}
                                ${items.role === "teacher" ? "bg-green-100 text-green-600" : ""}
                                `}
                          >
                            {items.role}
                          </span>
                        </td>





                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${items.status === "active"
                                ? "bg-green-500"
                                : "bg-red-500"
                                }`}
                            ></span>

                            <span
                              className={`text-xs font-medium ${items.status === "active"
                                ? "text-green-600"
                                : "text-red-500"
                                }`}
                            >
                              {items.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="flex justify-start gap-4 text-lg whitespace-nowrap">
                            <CustomToolTip text="Edit User">
                              <FaEdit
                                onClick={() => {
                                  if (items.status === "inactive") return;
                                  handleUpdate(items);
                                }}
                                className={`transition ${items.status === "inactive"
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-500 cursor-pointer hover:scale-110 hover:text-gray-600"
                                  }`}
                              />
                            </CustomToolTip>

                            <CustomToolTip text="Reset Password">
                              <FaKey
                              onClick={() => {
                                  if (items.status === "inactive") return;
                                  handleResetPassword(items._id)
                                }}
                              className={`transition ${items.status === "inactive"
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-500 cursor-pointer hover:scale-110 hover:text-gray-600"
                                  }`}
                              />
                            </CustomToolTip>

                            <CustomToolTip text="Status">
                              <FaPowerOff
                                onClick={() => {
                                  setSelectedUserId(items._id);
                                  setSelectedStatus(items.status);
                                  setShowConfirm(true);
                                }}
                                className={`text-sm cursor-pointer transition ${items.status === "active"
                                  ? "text-green-500 hover:text-green-600 hover:scale-110"
                                  : "text-red-500 hover:text-red-600 hover:scale-110"
                                  }`}
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

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-3 mt-6 pb-6">

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

            <span className="text-sm font-semibold text-gray-700 px-2">
              {page} <span className="text-gray-400">of</span> {totalPages}
            </span>

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

export default ManageRoles;

import React, { useState } from "react";
import { FaUserPlus, FaTrashAlt, FaEdit, FaPowerOff , FaKey} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOutletContext } from "react-router-dom";

function ManageRoles() {

  const { roles, getUser, handleDelete , handleResetPassword} = useOutletContext();

  const emailPattern =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const namePattern = /^[A-Za-z\s]{3,}$/;

  const backenduri = import.meta.env.VITE_BACKEND_URI;

  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [roleError, setRoleError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [editID, setEditId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("all");
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading , setLoading] = useState(false)

  const handleRoles = () => {
    setShowForm(true);
    setEditId(null);  
  }
  const handleCancel = () => {
    setShowForm(false);
  }

  const handleCross = () => {
    setShowForm(false);
  }
  const handleChange = (e) => {
    setRoleError("");
    setNameError("");
    setEmailError("");

    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) return setRoleError("Please select role");
    if (!formData.name) return setNameError("Name is required");
    if (!namePattern.test(formData.name))
      return setNameError("Name should have only alphabets");

    if (!formData.email) return setEmailError("Email is required");
    if (!emailPattern.test(formData.email))
      return setEmailError("Invalid email");

   

    const existUser = roles.some(
      (item) => item.email === formData.email && item._id !== editID
    );

    if (existUser) return setEmailError("Email already exists");

    try {
      if (editID) {
        setLoading(true);
        await axios.put(`${backenduri}/api/auth/updateUser/${editID}`, formData);
        toast.success("User updated successfully");
      } else {
        setLoading(true);
        await axios.post(`${backenduri}/api/auth/register`, formData);
        toast.success("User added successfully");
      }

      setShowForm(false); 
      getUser();
      setFormData({
        role: "",
        name: "",
        email: "" ,       
           });

    } catch {
      toast.error(error.response?.data?.message ||  "Something went wrong");
    }finally{
      setLoading(false);
    }
  };

  const handleUpdate = (items) => {
    setShowForm(true);
    setEditId(items._id);
    setFormData({
      role: items.role,
      name: items.name,
      email: items.email,

    });
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
  }

  const handleToggleStatus = async () => {
    setLoading(true)
  try {
    await axios.put(
      `${backenduri}/api/auth/toggle-status/${selectedUserId}`
    );

    toast.success("Status updated");
    getUser(); // refresh data
    setShowConfirm(false);

  } catch (error) {
    toast.error("Failed to update status");
  }finally{
    setLoading(false)
  }
};
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold italic">
              USER <span className="text-blue-600">MANAGEMENT</span>
            </h1>
            <p className="text-sm text-gray-500">
              Manage teachers and students efficiently
            </p>
          </div>

          <button
            onClick={handleRoles}
            className="w-auto sm:w-auto self-start flex items-center gap-2 bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition"          >
            <FaUserPlus />
            Add Role
          </button>
        </div>

        {/* POPUP */}

        {showForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">

            <div className="bg-white w-full sm:w-[80%] md:w-[60%] lg:w-[45%] xl:w-[35%] p-6 sm:p-8 rounded-lg shadow-xl">

              {/* HEADER */}
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold text-gray-700">
                  Add Role Details
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
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4">

                  {/* ROLE */}
                  <label className="text-sm font-semibold">
                    Role <span className="text-red-700">*</span>
                  </label>

                  <div>
                    <select
                      value={formData.role}
                      onChange={handleChange}
                      name="role"
                      className="w-full border rounded-md px-2 py-1.5 text-sm"
                    >
                      <option value="">Select Role</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                    </select>

                    {roleError && (
                      <p className="text-red-500 text-xs">{roleError}</p>
                    )}
                  </div>

                  {/* NAME */}
                  <label className="text-sm font-semibold">
                    Name <span className="text-red-700">*</span>
                  </label>

                  <div>
                    <input
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      name="name"
                      className="w-full border rounded-md px-2 py-1.5 text-sm"
                    />

                    {nameError && (
                      <p className="text-red-800 text-xs">{nameError}</p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <label className="text-sm font-semibold">
                    Email <span className="text-red-700">*</span>
                  </label>

                  <div>
                    <input
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      name="email"
                      title="Please enter a valid email address"
                      className="w-full border rounded-md px-2 py-1.5 text-sm"
                    />

                    {emailError && (
                      <p className="text-red-800 text-xs">{emailError}</p>
                    )}
                  </div>

                  {/* PASSWORD */}
                  {/* <label className="text-sm font-semibold">
                    Password <span className="text-red-700">*</span>
                  </label>

                  <div>
                    <input
                      value={formData.password}
                      onChange={handleChange}
                      type="password"
                      name="password"
                      className="w-full border rounded-md px-2 py-1.5 text-sm"
                    />

                    {passwordError && (
                      <p className="text-red-600 text-xs">{passwordError}</p>
                    )}
                  </div> */}

                </div>

                {/* BUTTONS */}
                <div className="flex justify-between mt-6">

                  <button
                    onClick={handleCancel}
                    type="button"
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 hover:scale-105 transition duration-300 active:scale-95 shadow-md"
                  >
                    Cancel
                  </button>

                  <button
                  disabled={loading}
                    className="bg-[#00536e] text-white px-5 py-2 rounded-md hover:bg-[#00455c] hover:scale-105 transition duration-300 active:scale-95 shadow-md"
                  >
                   {loading ? "Processing..." : "Submit →" }
                  </button>

                </div>

              </form>
            </div>
          </div>
        )}

        {/* POPUP */}

        {showConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[90%] sm:w-100 p-6 rounded-xl shadow-lg relative">

              <span
                onClick={() => setShowConfirm(false)}
                className="absolute top-3 right-4 text-xl cursor-pointer text-gray-500 hover:text-black"
              >
                &times;
              </span>

              <h2 className="text-lg font-semibold mb-3">
                Confirm Action
              </h2>

              <p className="text-sm text-gray-600 mb-5">
                Are you sure you want to <span className="font-semibold">{selectedStatus === "active" ? "Deactivate" : "Activate"}</span> this user?
              </p>

              <div className="flex justify-end gap-3">

                <button onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300">
                  Cancel
                </button>

                <button
                  onClick={handleToggleStatus}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  {loading ? "Processing..." : "Yes"}
                </button>

              </div>

            </div>
          </div>
        )}


        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">

          <div className="flex flex-wrap gap-2">

            {/* ALL */}
            <button
              onClick={() => setSelectedRole("all")}
              className={`px-4 py-2 rounded transition ${selectedRole === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
            >
              All
            </button>

            {/* TEACHER */}
            <button
              onClick={() => setSelectedRole("teacher")}
              className={`px-4 py-2 rounded transition ${selectedRole === "teacher"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
            >
              Teacher
            </button>

            {/* STUDENT */}
            <button
              onClick={() => setSelectedRole("student")}
              className={`px-4 py-2 rounded transition ${selectedRole === "student"
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
            onChange={handleSearch}
            placeholder="🔍 Search by name or email..."
            className="w-auto sm:w-56 md:w-64 px-3 py-2 text-sm outline-none border border-gray-400 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-500 self-start" />

        </div>

        {/* TABLE */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Added Roles</h3>

          {/* SCROLL CONTAINER */}
          <div className="w-full overflow-x-auto">

            <div className="bg-white rounded-xl shadow-md border border-gray-200 min-w-175">

              <table className="w-full text-sm">

                {/* HEADER */}
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="p-3 text-left font-semibold">Role</th>
                    <th className="p-3 text-left font-semibold">Name</th>
                    <th className="p-3 text-left font-semibold">Email</th>
                    <th className="p-3 text-left font-semibold">Status</th>
                    <th className="p-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {roles
                    .filter((items) => items.role !== "admin")
                    .filter(item => selectedRole === "all" || item.role === selectedRole)
                    .filter((items) =>
                      items.name.toLowerCase().includes(search.toLowerCase()) ||
                      items.email.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((items, index) => (
                      <tr
                        key={index}
                        className="border-b last:border-none hover:bg-blue-50 transition duration-200"
                      >
                        <td className="p-3 capitalize font-medium text-gray-900 whitespace-nowrap">
                          {items.role}
                        </td>

                        <td className="p-3 text-gray-800 font-medium whitespace-nowrap">
                          {items.name}
                        </td>


                        <td className="p-3 text-gray-900 wrap-break-words max-w-50">
                          {items.email}
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
                          <div className="flex justify-start gap-4 text-lg whitespace-nowrap ">

                            <FaEdit
                              onClick={() => handleUpdate(items)}
                              className="text-gray-500 cursor-pointer hover:scale-110 hover:text-gray-600 transition"
                            />

                            <FaTrashAlt
                              onClick={() => handleDelete(items._id)}
                              className="text-red-500 cursor-pointer hover:scale-110 hover:text-red-600 transition"
                            />

                             <FaKey
                              onClick={() => handleResetPassword(items._id)}
                              className="text-gray-400 cursor-pointer hover:scale-110 hover:text-gray-600 transition"
                            />

                            <FaPowerOff
                              onClick={() => {
                                setSelectedUserId(items._id);
                                setSelectedStatus(items.status);
                                setShowConfirm(true);
                              }}
                              className={`text-sm transition ${items.status === "active"
                                ? "text-green-500 hover:text-green-600 hover:scale-110  "
                                : "text-red-500 hover:text-red-600 hover:scale-110"
                                }`}
                            />

                           


                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageRoles;
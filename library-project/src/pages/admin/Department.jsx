import React, { useState, useEffect } from "react";
import { FaBuilding, FaEdit, FaTimesCircle, FaCheckCircle, FaPowerOff, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import MiniLoader from "../../components/CommonPages/Minloader";
import api from "../../components/Api/Axios";
import toast from "react-hot-toast";
import DashboardCard from "../../components/CommonPages/DashboardCard";
import CustomToolTip from "../../components/CommonPages/CustomToolTip";
import useTitle from "../../components/hooks/useTitle";

const Department = () => {

  useTitle("Assign Department ")

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
  });
  const [getDep, setgetDep] = useState([]);
  const [errors, setErrors] = useState({});

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isEditMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

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
      const res = await api.get("/api/dept/statscard");
      setStats(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  //pagination

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;

  const PaginationRequest = async (pageNumber = 1) => {
    try {
      const response = await api.get(
        `/api/dept/pagination?page=${pageNumber}&limit=${limit}`,
      );
      setgetDep(response.data.data)
      getStats()
      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    PaginationRequest(page);
  }, [page]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));


  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Department name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Only letters allowed";
    } else if (formData.name.length < 3) {
      newErrors.name = "Minimum 3 characters required";
    } else if (formData.name.length > 15) {
      newErrors.name = "Name too long";
    } else if (
      getDep.some(
        (item) =>
          item.name.trim().toLowerCase() === formData.name.trim().toLowerCase() && item._id !== editId,
      )
    ) {
      newErrors.name = "This department already exists";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 5) {
      newErrors.description = "Minimum 5 characters";
    } else if (formData.description.length > 150) {
      newErrors.description = "Description too long";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    } else if (!/^[A-Za-z0-9\s-]+$/.test(formData.location)) {
      newErrors.location = "Invalid location format";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      if (isEditMode) {
        await api.put(
          `/api/dept/update-dep/${editId}`,
          formData
        );

        toast.success("Department updated successfully");
      } else {
        await api.post("/api/dept/add-dep", formData);
        toast.success("Added department successfully");
      }

      PaginationRequest(page)
      getStats();
      setShowForm(false);
      setEditId(null);
      setEditMode(false);

      setFormData({
        name: "",
        description: "",
        location: "",
      });

      setErrors({});
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        (isEditMode ? "Update failed" : "Add failed")
      );
    } finally {
      setLoading(false);
    }
  };



  //active/inactive
  const handleToggleStatus = async () => {
    setLoading(true);

    try {
      await api.put(
        `/api/dept/toggle-status/${selectedUserId}`
      );


      toast.success("Status updated");

      PaginationRequest(page);
      getStats()
      setShowConfirm(false);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };


  // update

  const handleUpdate = (item) => {
    setShowForm(true);
    setEditId(item._id);
    setEditMode(true);
    setFormData({
      name: item.name,
      description: item.description,
      location: item.location,
    });
  }



  return (
    <div className=" min-h-screen">
    <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4  ">
          <div>
            <h1 className="font-[Poppins] lg:text-[25px]   text-[18px] font-bold italic">
              DEPARTMENT{" "}
              <span className="bg-linear-to-r from-[#2d6c93]  lg:text-[25px]   text-[18px] to-[#3d799f] bg-clip-text text-transparent">
                MANAGEMENT
              </span>
            </h1>
            <p className="lg:text-sm  text-xs font-semibold  text-gray-500 pb-3 lg:pb-10">
              Add and manage library departments
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(true);
            }}
            className="w-auto cursor-pointer mb-5 text-[10px] sm:text-[13px] lg:text-[15px] sm:w-auto self-start flex items-center gap-2 bg-[#2d6c93] hover:bg-[#3d799f] text-white lg:px-4 py-2 px-2 text-sm rounded-lg  transition"
          >
            <FaBuilding />
            Add Department
          </button>
        </div>



<div className="grid gap-4 grid-cols-1  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">

          <DashboardCard
            icon={<FaBuilding />}
            title="Total Departments"
            count={stats.total}
            color="#3b82f6"
            bgColor="bg-blue-50"
          />

          <DashboardCard
            icon={<FaCheckCircle />}
            title="Active Departments"
            count={stats.active}
            color="#10b981"
            bgColor="bg-green-50"
          />

          <DashboardCard
            icon={<FaTimesCircle />}
            title="Inactive Departments"
            count={stats.inactive}
            color="#ef4444"
            bgColor="bg-red-50"
          />

        </div>


        {/* card */}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
          {getDep.length <= 0 ? (
            <div className="col-span-full flex justify-center p-6">

              <div className="w-full max-w-md text-center bg-white shadow-[0_0_20px_rgba(0,0,0,0.20)] rounded-2xl px-8 py-5 border border-gray-100 hover:shadow-[0_0_20px_rgba(0,0,0,0.10)] transition">

                <div className="flex justify-center">
                  <div className="bg-gray-200 p-4 rounded-full mb-3">
                    <FaBuilding className="text-3xl text-gray-400" />
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-700">
                  No Departments Found
                </h2>

                <p className="text-sm text-gray-400 mt-2">
                  You haven’t added any departments yet.
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Data will appear once it is added.
                </p>

                {/* Button */}
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-6 inline-flex items-center gap-2 bg-[#2d6c93] text-white 
                   px-6 py-2.5 rounded-lg font-medium shadow-md 
                    hover:bg-[#3d799f] hover:shadow-lg transition-all duration-300"
                >
                  Add Department
                </button>

              </div>
            </div>

          ) : (
            getDep.map((item) => (
              <div
                key={item._id}
                className="relative group bg-white border border-blue-200 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-[#00304e]/5 via-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition duration-500"></div>

                <div className="absolute left-0 top-0 h-full w-0.75 bg-[#2d6c93] group-hover:w-1.5 transition-all duration-300"></div>

                <div className="p-5 relative z-10">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-bold text-[#00304e] group-hover:text-black transition">
                      {item.code}
                    </h2>
                    <h2 className="text-lg font-bold text-[#00304e] group-hover:text-black transition">
                      {item.name.toUpperCase()}
                    </h2>
                  </div>

                  <p className="text-xs text-gray-400 mt-1 tracking-wider uppercase">
                    Location: {item.location.toUpperCase()}
                  </p>

                  <div className="w-full h-1px bg-gray-200 my-3"></div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div>
                    <span
                      className={`cursor-pointer text-xs px-3 py-1 rounded-full font-medium shadow-sm transition-colors
                   ${item.status === "active"
                          ? "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
                          : "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                        }`}
                    >
                      {item.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4 flex gap-2">
                    
                    <CustomToolTip text="Edit">
                      <button
                        onClick={() => handleUpdate(item)}
                        className="cursor-pointer p-2 rounded-lg bg-gray-100 text-[#00304e] 
               hover:bg-[#00304e] hover:text-white transition-all duration-300 
               shadow hover:scale-110"
                      >
                        <FaEdit size={13} />
                      </button>
                    </CustomToolTip>

                    {/* PowerOff */}
                     <CustomToolTip text="Status">
                    <button

                      className={` cursor-pointer p-2 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-300 shadow hover:scale-110
                      ${item.status === "active"
                          ? "text-green-600 hover:bg-green-600 hover:text-white"
                          : "text-red-600 hover:bg-red-600 hover:text-white"
                        }`}
                      onClick={() => {
                        setSelectedUserId(item._id);
                        setSelectedStatus(item.status);
                        setShowConfirm(true);
                      }}
                    >                     
                        <FaPowerOff size={14} />
                    </button>
                     </CustomToolTip>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#00304e]/20 transition pointer-events-none"></div>
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


        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm   flex justify-center items-center z-1100  mt-16 md:mt-0 sm:mt-0 lg:mt-0">
            <div className="bg-white w-[95%] sm:w-[70%] lg:w-105 md:w-120 rounded-2xl shadow-xl p-6 animate-fadeIn">
              {/* HEADER */}
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Add Department
                </h2>

                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditMode(false);
                    setEditId(null);
                    setFormData({
                      name: "",
                      description: "",
                      location: ""
                    })
                    setErrors({});
                  }}
                  className="text-gray-400 cursor-pointer hover:text-red-500 text-xl font-bold transition"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600">
                    Department*
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    placeholder="Enter department name"
                    value={formData.name}
                    className="w-full mt-1 p-2.5 border-2 border-gray-300  rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500  ml-7 text-center text-sm">{errors.name}</p>
                )}

                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600">
                    Description
                  </label>
                  <textarea
                    name="description"
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter description"
                    value={formData.description}
                    className="w-full  resize-none mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                {errors.description && (
                  <p className="text-red-500  text-center  text-sm">{errors.description}</p>
                )}

                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600">Building & Floor</label>
                  <input
                    type="text"
                    name="location"
                    onChange={handleChange}
                    value={formData.location}
                    placeholder="Location (e.g. Block A - 2nd Floor)"
                    className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                {errors.location && (
                  <p className="text-red-500   text-center text-sm">{errors.location}</p>
                )}

                {/* Button */}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditMode(false);
                      setEditId(null);
                      setFormData({
                        name: "",
                        description: "",
                        location: "",
                      })
                      setErrors({})
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
                        ? "cursor-not-allowed bg-[#2d6c93]  opacity-80"
                        : "bg-[#2d6c93] hover:bg-[#1e5272] "
                      }`}
                  >
                    {loading ? (
                      <>
                        <MiniLoader size="w-5 h-5" />
                        {isEditMode ? "Updating..." : "Adding..."}
                      </>
                    ) : isEditMode ? (
                      "Update "
                    ) : (
                      "Add Department"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


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
                this department?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2  cursor-pointertext-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={handleToggleStatus}
                  disabled={loading}
                  className="px-4 py-2 cursor-pointer text-sm bg-[#2d6c93] hover:bg-[#1e5272]  text-white rounded "
                >
                  {loading ? "Processing..." : "Yes"}
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default Department;

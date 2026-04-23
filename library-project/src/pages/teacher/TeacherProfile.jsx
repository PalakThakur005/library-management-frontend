import React, { useEffect, useState } from "react";
import api from "../../components/Api/Axios";
import profile from "../../assets/profile.jpg";
import MiniLoader from "../../components/CommonPages/Minloader";
import toast from "react-hot-toast";
import { FaEdit, FaUser, FaBuilding, FaCode, FaUserShield, FaEnvelope, FaPhone, FaIdCard } from "react-icons/fa";
import useTitle from "../../components/hooks/useTitle";
const TeacherProfile = () => {


  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: ""
    }));
  }

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || ""
      });
    }
  }, [user]);




  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch this user");
    }
  };

  useTitle(` Student - ${user?.name}`)


  //  Upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only images allowed");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await api.put("/api/auth/upload-profile", formData);
      setUser(res.data.user);
      fetchUser();
      toast.success("Profile photo uploaded successfully")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload profile");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Remove
  const handleRemove = async () => {
    try {
      setRemoving(true);
      const res = await api.put("/api/auth/remove-profile");
      setUser(res.data.user);
      toast.success("Profile photo removed successfully")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove profile photo");
    } finally {
      setRemoving(false);
      setShowConfirm(false);
    }
  };



  const handleUpdate = async (e) => {
    e.preventDefault();
    let newErrors = {
      name: "",
      phone: "",
    };

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid 10 digit phone number";
    }

    if (!/^[A-Za-z]{3,}(?: [A-Za-z]+)*$/.test(formData.name)) {
      newErrors.name =
        "Min 3 letters, no numbers, no special characters, no extra spaces";
    }

    if (newErrors.name || newErrors.phone) {
      setErrors(newErrors);
      return;
    }
    try {
      setLoading(true);

      const res = await api.put("/api/auth/update-profile", formData);
      setUser(res.data.user);
      fetchUser();
      toast.success("Profile updated successfully")
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

        <div className="bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.15)] p-6 flex flex-col items-center text-center w-full lg:w-1/3">

          <div className="relative">
            <img
              src={user?.profileImage || profile}
              alt="profile"
              className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-white shadow"
            />

            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white text-sm">
                Uploading...
              </div>
            )}

            <label className="absolute bottom-2 right-5 bg-[#00304e] text-white w-9 h-9 flex items-center justify-center rounded-full cursor-pointer">
              +
              <input type="file" onChange={handleUpload} className="hidden" />
            </label>
          </div>

          {/* REMOVE */}
          {user?.profileImage && (
            <button
              onClick={() => setShowConfirm(true)}
              className="mt-3 text-sm text-red-500"
            >
              Remove Photo
            </button>
          )}

          {/* INFO */}
          <div className="mt-4 space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">
              {user?.name}
            </h2>

            <p className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <FaEnvelope /> {user?.email}
            </p>

            <p className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <FaPhone /> {user?.phone}
            </p>

            <p className="flex items-center justify-center gap-2 text-yellow-600 text-sm capitalize">
              <FaUserShield /> {user?.role}
            </p>
          </div>

          {/* EDIT BUTTON */}
          <button
            onClick={() => {setShowForm(true),
              setFormData({
                name:user?.name,
                phone:user?.phone
              })
            }}
            className="mt-4 flex items-center gap-2 px-3 py-2 bg-white text-[#00304e] border border-[#00304e]  rounded-lg shadow hover:scale-105 transition"
          >
            <FaEdit /> Edit Profile
          </button>
        </div>

        <div className="flex-1 p-7 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.15)]">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Profile Details
            </h2>
            <p className="text-sm text-gray-500">
              Overview of your personal and department information
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 
    shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">

              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition">
                <FaBuilding />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Department</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {user?.department?.name || "N/A"}
                </p>
              </div>
            </div>

            {/* Department Code */}
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 
    shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">

              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:scale-110 transition">
                <FaIdCard />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Department Code</p>
                <p className="font-semibold text-gray-800 uppercase">
                  {user?.department?.code || "N/A"}
                </p>
              </div>
            </div>



            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 
    shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">

              <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:scale-110 transition">
                <FaUser />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Name</p>
                <p className="text-sm text-gray-800 break-all">
                  {user?.name}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 
    shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">

              <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:scale-110 transition">
                <FaEnvelope />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p className="text-sm text-gray-800 break-all">
                  {user?.email}
                </p>
              </div>
            </div>


            {/* Role */}
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 
    shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">

              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl group-hover:scale-110 transition">
                <FaUserShield />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Role</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 
    shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">

              <div className="p-3 bg-red-100 text-red-600 rounded-xl group-hover:scale-110 transition">
                <FaPhone />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Phone</p>
                <p className="text-sm font-medium text-gray-800">
                  {user?.phone}
                </p>
              </div>
            </div>

          </div>



        </div>
      </div>





      {showForm && (
        <div className="fixed inset-0 z-1100 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full sm:w-[80%] md:w-[60%] lg:w-[45%] xl:w-[35%] p-6 sm:p-8 rounded-lg shadow-xl">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-gray-700">
                Edit Details
              </h3>

              <p
               onClick={() => {
  setShowForm(false);
  setErrors({ name: "", phone: "" });
}}
                className="cursor-pointer font-semibold text-2xl mb-2 hover:text-[#00304e]"
              >
                &times;
              </p>
            </div>

            <form onSubmit={handleUpdate} >
              <div className="space-y-4">



                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600">
                    Department<span className="text-red-700">*</span>
                  </label>
                  <input
                    value={user.department?.name}
                    readOnly
                    className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100
                   text-gray-500 cursor-not-allowed"                    />
                </div>


                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600">
                    Role <span className="text-red-700">*</span>
                  </label>
                  <input
                    value={user.role}
                    readOnly
                    className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100
                   text-gray-500 cursor-not-allowed"                    />
                </div>


                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600">
                    Name <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs ml-32">{errors.name}</p>
                )}



                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600">
                    Email <span className="text-red-700">*</span>
                  </label>
                  <input
                    value={user.email}
                    readOnly
                    title="Please enter a valid email address"
                    className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100
                   text-gray-500 cursor-not-allowed"
                  />
                </div>



                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600">
                    Phn No. <span className="text-red-700">*</span>
                  </label>
                  <input
                    value={formData.phone}
                    type="tel"
                    name="phone"
                    onChange={handleChange}
                    className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100
                   "                    />
                </div>
              </div>

              {errors.phone && (
                <p className="text-red-500 text-xs ml-32">{errors.phone}</p>
              )}


              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-2 mt-5">
                <button
                  onClick={() => {
  setShowForm(false);
  setErrors({ name: "", phone: "" });
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
                      ? "cursor-not-allowed bg-blue-400 opacity-80"
                      : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {loading ?
                    <>
                      <MiniLoader size="w-5 h-5" />
                      Saving
                    </>
                    :
                    "Save Changes"
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur z-1100">

          <div className="w-100 bg-white rounded-xl py-5 px-7  relative text-start shadow-[0_10px_25px_rgba(0,0,0,0.2)] animate-[popupJump_.4s_ease]">
            <span onClick={() => setShowConfirm(false)}

              className="absolute right-4 top-2 text-[20px] text-gray-500 cursor-pointer hover:text-black"
            >
              &times;
            </span>

            {/* Title */}
            <h3 className="text-[18px] font-semibold mb-2">
              Confirm
            </h3>

            {/* Text */}
            <p className="text-[14px] text-gray-600 leading-relaxed mb-5">
              Are you sure you want to remove your profile photo?
            </p>
            <div className="flex justify-end gap-4 mt-6">

              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleRemove}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
              >
                {removing ? "Removing..." : "Remove"}
              </button>

            </div>

          </div>
        </div>
      )}




    </div>
  );
};

export default TeacherProfile;
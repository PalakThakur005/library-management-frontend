import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/Api/Axios";
import resetimage from "../../assets/resetimage.jpg";
import  toast  from "react-hot-toast";
import useTitle from "../../components/hooks/useTitle";


const ForgotPassword = () => {

   useTitle("Contact Admin")

  const navigate = useNavigate();

  const emailRef = useRef();
  const nameRef = useRef();
  const messageRef = useRef();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error , setError] = useState("");


  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleChange = (e) => {
    setForm({
       ...form, 
      [e.target.name]: e.target.value
     });
        
     setError("");
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

     if (!form.email || !form.name || !form.message) {
      setError("All fields are required");
  setLoading(false);
  return;
}

    try {
      const res = await api.post(
        "/api/auth/contact-admin",
        form
      );

      toast.success(res.data.message);

      // clear form
      setForm({
        name: "",
        email: "",
        message: "",
      });

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }finally{
 setLoading(false);
    }
  };

  return (
    <div className="max-w-295 mx-auto">
      <div className="flex min-h-screen bg-blue-50">

        {/* LEFT IMAGE */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <img
            src={resetimage}
            alt="Reset"
            className="w-full max-w-250"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="flex-1 bg-white flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-[90%] max-w-112.5 p-6 sm:p-10 rounded-xl bg-white shadow-md"
          >

            <h1 className="text-[#2d6c93]  text-2xl mb-2 font-semibold">
              Contact Admin
            </h1>

            <p className="text-gray-400 mb-6">Let Us Help You</p>

            {error && (
            <p className="text-red-500 mb-3 text-center text-sm">{error}</p>
          )}

            {/* NAME */}
            <div className="relative mb-6">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                ref={nameRef}
                className="peer w-full px-4 py-4 pr-10 border border-gray-300 rounded-lg bg-blue-50 outline-none focus:border-[#2d6c93] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              <label className="absolute left-4 top-4 text-gray-400 text-sm bg-blue-50 px-1 transition-all 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#2d6c93] peer-focus:bg-white 
              peer-valid:-top-2 peer-valid:text-xs peer-valid:text-[#2d6c93] peer-valid:bg-white">
                Name*
              </label>

              <span
                onClick={() => nameRef.current.focus()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm cursor-pointer"
              >
                <i className="fa-solid fa-user"></i>
              </span>
            </div>

            {/* EMAIL */}
            <div className="relative mb-6">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                ref={emailRef}
                className="peer w-full px-4 py-4 pr-10 border border-gray-300 rounded-lg bg-blue-50 outline-none focus:border-[#2d6c93] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              <label className="absolute left-4 top-4 text-gray-400 text-sm bg-blue-50 px-1 transition-all 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#2d6c93]  peer-focus:bg-white 
              peer-valid:-top-2 peer-valid:text-xs peer-valid:text-[#2d6c93] peer-valid:bg-white">
                Email*
              </label>

              <span
                onClick={() => emailRef.current.focus()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm cursor-pointer"
              >
                <i className="fa-solid fa-envelope"></i>
              </span>
            </div>

            {/* MESSAGE */}
            <div className="relative mb-6">
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="4"
                required
                ref={messageRef}
                className="peer resize-none w-full px-4 py-4 pr-10 border border-gray-300 rounded-lg bg-blue-50 outline-none focus:border-[#2d6c93] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              <label className="absolute left-4 top-4 text-gray-400 text-sm bg-blue-50 px-1 transition-all 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#2d6c93] peer-focus:bg-white 
              peer-valid:-top-2 peer-valid:text-xs peer-valid:text-[#2d6c93] peer-valid:bg-white">
                Your Message*
              </label>

              
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#2d6c93] hover:bg-[#1e5272]  text-white font-medium transition shadow-md"
            >
              {loading ? "Sending..." : "Contact Admin"}
            </button>

            {/* LOGIN */}
            <p
              onClick={handleLogin}
              className="mt-5 text-[#2d6c93]  text-center cursor-pointer hover:underline"
            >
              Back to Login
            </p>

          </form>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
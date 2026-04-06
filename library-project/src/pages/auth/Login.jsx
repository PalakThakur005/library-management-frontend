import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import login from "../../assets/login.jpg";
import logo from "../../assets/logo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef= useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URI;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    setError("");
  };

  const handleNavigate = () => {
    navigate("/forgot-password");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
     setLoading(true);


    if (!form.email || !form.password) {
      setError("All fields are required");
      setLoading(false)
      return;
    }

    try {
      await new Promise((res) => setTimeout(res, 2000));
      const res = await axios.post(`${backendUrl}/api/auth/login`, form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "admin") {
        toast.success("Login SuccessFully")
        setTimeout(() => {
          navigate("/admin", { replace: true });
        }, 3000)

      }

      if (res.data.user.role === "student") {
        toast.success("Login SuccessFully")
        setTimeout(() => {
          navigate("/student", { replace: true });
        }, 3000)

      }

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Login failed. Try again."
      )
    }
    finally {
      setLoading(false);
    }

  };

  return (
    <div className="flex min-h-screen">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-1 bg-gray-100 items-center justify-center">
        <img src={login} alt="Login" className="w-4/5 max-w-md" />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 items-center justify-center bg-white p-8">
        <div className="w-full max-w-md text-center">

          <img src={logo} alt="logo" className="w-20 mx-auto mb-4" />

          <h2 className="text-2xl font-semibold text-blue-700 mb-2">
            Welcome to Smart School Library
          </h2>

          <p className="text-gray-500  mb-6">
            Sign in to your account
          </p>

          {error && (
            <p className="text-red-500 mb-3 text-sm">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* EMAIL */}
            <div className="relative mb-6">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                ref={emailRef}
                className="peer w-full px-4 py-4 pr-10 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"

              />
              <label className="absolute left-4 top-4 text-gray-400 text-sm bg-blue-50 px-1 transition-all 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white 
              peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-500 peer-valid:bg-white">
                Email*
              </label>

               <span
                onClick={() => emailRef.current.focus()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-md cursor-pointer peer-focus:text-blue-500"
              >
                <i className="fa-solid fa-envelope"></i>
              </span>

            </div>


          

            

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                ref={passwordRef}
                className="peer w-full px-4 py-4 pr-10 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <label className="absolute left-4 top-4 text-gray-400 text-sm bg-blue-50 px-1 transition-all 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white 
              peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-500 peer-valid:bg-white">
                Password*
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className= "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg cursor-pointer peer-focus:text-blue-500">
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>



            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-700 text-white rounded-full font-semibold hover:bg-blue-800  transition cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
            {/* OPTIONS */}
            <div className="text-center text-sm text-gray-600">
              {/* <label className="flex items-center gap-1">
                <input type="checkbox" />
                Remember me
              </label> */}

              <span
                className="text-gray"
                
              >
                Forgot your Password ?{" "}<span   onClick={handleNavigate} className=" text-blue-600 cursor-pointer">Contact Admin</span>
              </span>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
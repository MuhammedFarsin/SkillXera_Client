import { motion } from "framer-motion";
import logo from "../../assets/logo.jpg";
import { Link } from "react-router-dom";
import axiosInstance from "../../Connection/Axios";
import { toast } from "sonner";
import ToastHot from "../Common/ToasterHot";
import { useState } from "react";
import { login } from "../../Store/Slices/authSlice";
import { useDispatch } from "react-redux";
import { setUser } from "../../Store/Slices/userSlice";

function SignInPage() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        "/signin",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        console.log("Access Token received from server:", response.data.accessToken);  
        localStorage.setItem("accessToken", response.data.accessToken);
        const token = localStorage.getItem("accessToken");
        console.log("Access Token retrieved from localStorage:", token);
      
        toast.success("Login successful...");
        setTimeout(() => {
          dispatch(login());
          dispatch(setUser(response.data.user));
        }, 2000);
      }
    } catch (err) {
      toast.error("Something went wrong...!",err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#004d40] flex items-center justify-center px-4">
      {/* Header Section */}
      <header className="w-full bg-gradient-to-b from-[#1a1a1a] to-[#004d40] py-4 px-6 fixed top-0 left-0 flex items-center">
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="SkillXera Logo"
            className="w-10 h-10 rounded-lg"
          />
          <h1 className="text-white text-xl font-bold">SkillXera</h1>
        </div>
      </header>

      {/* Sign-In Container */}
      <div className="bg-gradient-to-r from-[#004d40] to-[#1a1a1a] p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold text-white">SkillXera</h1>
        </motion.div>

        {/* Sign-In Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 text-white font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-violet-600 hover:bg-gradient-to-l"
          >
            Sign In
          </button>
        </form>

        {/* Links Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-green-400 hover:underline">
              Sign Up
            </Link>
          </p>
          <p className="text-sm text-gray-300 mt-2">
            <Link
              to="/forget-password-mail"
              className="text-green-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </p>
        </div>
        <ToastHot />
      </div>
    </div>
  );
}

export default SignInPage;

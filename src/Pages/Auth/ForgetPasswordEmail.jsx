import { motion } from "framer-motion";
import { useState } from "react";
import logo from "../../assets/logo.jpg";
import { toast } from "sonner";
import axiosInstance from "../../Connection/Axios";
import ToastHot from "../Common/ToasterHot";
import { useNavigate } from "react-router-dom";

function ForgetPasswordEmail() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    try {
      const response = await axiosInstance.post("/verify-mail-forget-password", { email });
      console.log(response.data);
      localStorage.setItem("email",email);
      if (response.status === 200) {
        toast.success("Please check your email for the verification code.");
        setTimeout(() => {
          navigate("/forget-password-otp");
        }, 2000);
      }
    } catch (error) {
      toast.error("Something went wrong!",error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#004d40] flex items-center justify-center px-4">
      <header className="w-full bg-gradient-to-b from-[#1a1a1a] to-[#004d40] py-3 px-6 fixed top-0 left-0 flex items-center">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="SkillXera Logo" className="w-8 h-8 rounded-lg" />
          <h1 className="text-white text-lg font-bold">SkillXera</h1>
        </div>
      </header>

      <div className="bg-gradient-to-r from-[#004d40] to-[#1a1a1a] p-6 rounded-lg shadow-lg w-full max-w-sm max-h-[300px] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-3"
        >
          <h1 className="text-xl font-bold text-white">Verify Email</h1>
          <p className="text-xs text-gray-300">
            Enter the Email to Send OTP
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white text-xs">
              Enter Your Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-sm tracking-widest"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-1.5 px-3 text-white text-xs font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-violet-600 hover:bg-gradient-to-l"
          >
            Submit
          </button>
        </form>
      </div>
      <ToastHot />
    </div>
  );
}

export default ForgetPasswordEmail;

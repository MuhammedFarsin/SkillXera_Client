import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axiosInstance from "../../Connection/Axios";
import ToastHot from "../Common/ToasterHot";

const OTP_EXPIRATION_TIME = 120;

function ForgetPasswordOtp() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [timeLeft, setTimeLeft] = useState(OTP_EXPIRATION_TIME);
    const [otpExpired, setOtpExpired] = useState(false);
    const email = localStorage.getItem("email");
  
    useEffect(() => {
      if (timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
      } else {
        setOtpExpired(true);
      }
    }, [timeLeft]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!otp) {
        toast.error("Please enter OTP!");
        return;
      }
  
      if (otpExpired) {
        toast.error("OTP expired! Please request a new OTP.");
        return;
      }
  
      try {
        const response = await axiosInstance.post("/verify-otp-forget-password", { email, otp });
        if (response.status === 200) {
          toast.success("Reset your Password...");
          setTimeout(
            () => {
              navigate("/resetpassword");
            },
            2000
          );
        }
      } catch (err) {
        toast.error("Invalid OTP! Please try again.",err);
      }
    };
  
    const handleResendOtp = async () => {
      setIsResending(true);
      setOtpExpired(false);
      setTimeLeft(OTP_EXPIRATION_TIME);
  
      try {
        const response = await axiosInstance.post("/resend-otp", { email });
        if (response.status === 200) {
          toast.success("OTP resent successfully!");
        } else {
          toast.error("Failed to resend OTP. Try again.");
        }
      } catch (err) {
        toast.error("Something went wrong!",err);
      }
  
      setTimeout(() => setIsResending(false), 3000);
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
            <h1 className="text-xl font-bold text-white">Verify OTP</h1>
            <p className="text-xs text-gray-300">Enter the OTP sent to your email</p>
          </motion.div>
  
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-white text-xs">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-sm tracking-widest"
                required
              />
            </div>
  
            <button
              type="submit"
              className="w-full py-1.5 px-3 text-white text-xs font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-violet-600 hover:bg-gradient-to-l"
              disabled={otpExpired}
            >
              {otpExpired ? "OTP Expired! Request New OTP" : "Verify OTP"}
            </button>
          </form>
  
          {/* Countdown Timer */}
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-300">
              {otpExpired ? (
                <span className="text-red-500">OTP expired! Request a new OTP.</span>
              ) : (
                `Time left: ${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`
              )}
            </p>
          </div>
  
          {/* Resend OTP Button */}
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-300">
            Don&apos;t receive OTP?{" "}
              <button
                onClick={handleResendOtp}
                disabled={isResending || !otpExpired}
                className={`text-green-400 hover:underline ${
                  isResending || !otpExpired ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isResending ? "Resending..." : "Resend"}
              </button>
            </p>
          </div>
        </div>
        <ToastHot />
      </div>
    );
}

export default ForgetPasswordOtp

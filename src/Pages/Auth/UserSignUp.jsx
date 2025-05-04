import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import ToastHot from "../Common/ToasterHot";
import axiosInstance from "../../Connection/Axios";
import Spinner from "../Common/spinner";

function UserSignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      const response = await axiosInstance.post("/signup", {
        username,
        email,
        phone,
        password,
        confirmPassword,
      });
      console.log(response.data);
      localStorage.setItem("email", email);
      if (response.status === 200) {
        toast.success("Plz verify your email...");
        setTimeout(() => {
          navigate("/otp");
        }, 2000);
      }
    } catch (err) {
      toast.error("Something went wrong...!", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#004d40] flex items-center justify-center px-4">
      {/* Header Section */}
      <header className="w-full bg-gradient-to-b from-[#1a1a1a] to-[#004d40] py-3 px-6 fixed top-0 left-0 flex items-center">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="SkillXera Logo" className="w-8 h-8 rounded-lg" />
          <h1 className="text-white text-lg font-bold">SkillXera</h1>
        </div>
      </header>

      {/* Sign-Up Container */}
      <div className="bg-gradient-to-r from-[#004d40] to-[#1a1a1a] p-10 rounded-lg shadow-lg w-full max-w-sm">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-4"
        >
          <h1 className="text-2xl font-bold text-white">SkillXera</h1>
        </motion.div>

        {/* Sign-Up Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="block text-white text-sm">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="block text-white text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="block text-white text-sm">
              Phone
            </label>
            <input
              type="number"
              id="number"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="block text-white text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block text-white text-sm"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-3 text-white text-sm font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-violet-600 hover:bg-gradient-to-l flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner small /> {/* Small spinner for buttons */}
                <span>Verifying...</span>
              </>
            ) : (
              "SignUp"
            )}
          </button>
        </form>

        {/* Links Section */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-300">
            Already have an account?{" "}
            <Link to="/signin" className="text-green-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
        <ToastHot />
      </div>
    </div>
  );
}

export default UserSignUp;

import ToasterHot from "../Common/ToasterHot";
import logo from "../../assets/logo.jpg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import axiosInstance from "../../Connection/Axios";

function SetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !email) {
      toast.error("Invalid or missing token. Please try again.");
      return;
    }

    // Basic validation
    if (!newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axiosInstance.post("/set-password", {
        newPassword,
        email,
        token,
      });
      console.log(newPassword)

      if (response.status === 200) {
        toast.success("Password reset successful.");
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Internal Server Error.");
      console.log(error);
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

      <div className="bg-gradient-to-r from-[#004d40] to-[#1a1a1a] p-6 rounded-lg shadow-lg w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <h1 className="text-xl font-bold text-white text-center mb-4">
            Set Password
          </h1>

          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-white text-sm">
              Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-white text-sm"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-violet-600 hover:bg-gradient-to-l"
          >
            Set Password
          </button>
        </form>
      </div>
      <ToasterHot />
    </div>
  );
}

export default SetPassword;

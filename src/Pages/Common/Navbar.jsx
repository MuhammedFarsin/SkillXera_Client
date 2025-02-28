import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { removeUser } from "../../Store/Slices/userSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import logo from "../../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Store/Slices/authSlice";
import { toast } from "sonner";
import axiosInstance from "../../Connection/Axios";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/logout");
      if (response.status === 200) {
        localStorage.removeItem("accessToken");
        dispatch(logout());
        dispatch(removeUser());
        localStorage.clear();
        toast.success("Logged out successfully!");
        navigate("/");
      } else {
        toast.error("Failed to logout. Try again.");
      }
    } catch (error) {
      toast.error("Internal server error: ", error);
    }
  };
  return (
    <div>
      {/* Header Section */}
      <header className="w-full bg-gradient-to-b from-[#1a1a1a] to-[#004d40] py-4 px-6 fixed top-0 left-0 flex items-center justify-between z-50">
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="SkillXera Logo"
            className="w-10 h-10 rounded-lg"
          />
          <h1 className="text-white text-xl font-bold">SkillXera</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-10">
          <Link
            to="/admin/dashboard"
            className="block py-2 px-4 text-white rounded-md hover:bg-gray-600 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/admin/dashboard"
            className="block py-2 px-4 text-white rounded-md hover:bg-gray-600 transition duration-200"
          >
            Explore
          </Link>

          <div
            className="relative group"
            onMouseEnter={() => setIsProfileOpen(true)}
            onMouseLeave={() => setIsProfileOpen(false)}
          >
            <button className="text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200 flex items-center">
              <FaUserCircle className="text-white mr-2" size={20} /> Profile{" "}
            </button>
            {isProfileOpen && (
              <div className="absolute right-0">
                <ul className="bg-[#fff] rounded-lg shadow-md w-32 mt-1">
                  <li>
                    <Link
                      to="/admin/user-profile"
                      className="block py-2 px-4 text-black rounded-md hover:bg-gray-200 transition duration-200"
                    >
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 px-4 text-red-500 rounded-md hover:bg-gray-200 transition duration-200"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
                <div className="absolute right-4 bottom-full w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-[#fff]"></div>
              </div>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;

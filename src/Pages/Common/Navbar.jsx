import { useState } from "react";
import { FaUserCircle, FaHome, FaCompass, FaEllipsisV, FaInfoCircle, FaPhone, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logout } from "../../Store/Slices/authSlice";
import { removeUser } from "../../Store/Slices/userSlice";
import axiosInstance from "../../Connection/Axios";
import logo from "../../assets/logo.jpg";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="w-full bg-gradient-to-b from-[#1a1a1a] to-[#004d40] py-4 px-6 fixed top-0 left-0 flex items-center justify-between z-50">
      {/* Left Section: Logo */}
      <div className="flex items-center">
        <img src={logo} alt="SkillXera Logo" className="w-10 h-10 rounded-lg" />
        <h1 className="text-white text-xl font-bold hidden md:block ml-2">SkillXera</h1>
      </div>

      {/* Navigation Section */}
      <nav className="flex items-center space-x-10">
        {/* Desktop View */}
        <div className="hidden md:flex space-x-10">
          <Link to="/home" className="flex items-center text-white hover:text-gray-300 transition duration-200 space-x-2">
            <FaHome size={22} />
            <span className="text-base">Home</span>
          </Link>
          <Link to="/explore" className="flex items-center text-white hover:text-gray-300 transition duration-200 space-x-2">
            <FaCompass size={22} />
            <span className="text-base">Explore</span>
          </Link>
          <Link to="/about" className="flex items-center text-white hover:text-gray-300 transition duration-200 space-x-2">
            <FaInfoCircle size={22} />
            <span className="text-base">About</span>
          </Link>
          <Link to="/contact" className="flex items-center text-white hover:text-gray-300 transition duration-200 space-x-2">
            <FaPhone size={22} />
            <span className="text-base">Contact</span>
          </Link>
          <Link to="/privacy" className="flex items-center text-white hover:text-gray-300 transition duration-200 space-x-2">
            <FaLock size={22} />
            <span className="text-base">Privacy</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center text-white hover:text-gray-300 transition duration-200 space-x-2"
          >
            <FaUserCircle size={22} />
            <span className="text-base">Logout</span>
          </button>
        </div>

        {/* Mobile View - Three Dots Menu */}
        <div className="md:hidden relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white hover:text-gray-300">
            <FaEllipsisV size={24} />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2">
              <Link
                to="/home"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => setMenuOpen(false)}
              >
                <FaHome size={18} />
                <span>Home</span>
              </Link>
              <Link
                to="/explore"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => setMenuOpen(false)}
              >
                <FaCompass size={18} />
                <span>Explore</span>
              </Link>
              <Link
                to="/about"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => setMenuOpen(false)}
              >
                <FaInfoCircle size={18} />
                <span>About</span>
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => setMenuOpen(false)}
              >
                <FaPhone size={18} />
                <span>Contact</span>
              </Link>
              <Link
                to="/privacy"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => setMenuOpen(false)}
              >
                <FaLock size={18} />
                <span>Privacy</span>
              </Link>
              <button
                onClick={(e) => {
                  handleLogout(e);
                  setMenuOpen(false);
                }}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center w-full text-left space-x-2"
              >
                <FaUserCircle size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

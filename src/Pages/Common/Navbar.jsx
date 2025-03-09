import { FaUserCircle, FaHome, FaCompass } from "react-icons/fa";
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
        {/* Show text only on medium and larger screens */}
        <h1 className="text-white text-xl font-bold hidden md:block ml-2">SkillXera</h1>
      </div>

      {/* Navigation Section */}
      <nav className="flex items-center space-x-32">
        {/* Mobile View (Icons Only) */}
        <div className="flex md:hidden space-x-16">
          <Link to="/home" className="text-white hover:text-gray-300">
            <FaHome size={24} />
          </Link>
          <Link to="/explore" className="text-white hover:text-gray-300">
            <FaCompass size={24} />
          </Link>
          <button onClick={handleLogout} className="text-white hover:text-gray-300">
            <FaUserCircle size={24} />
          </button>
        </div>

        {/* Tablet & Desktop View (Icons + Text Side by Side) */}
        <div className="hidden md:flex space-x-32">
          <Link to="/home" className="flex items-center text-white hover:text-gray-300 transition duration-200 space-x-2">
            <FaHome size={22} />
            <span className="text-base">Home</span>
          </Link>
          <Link to="/explore" className="flex items-center text-white hover:text-gray-300 transition duration-200 space-x-2">
            <FaCompass size={22} />
            <span className="text-base">Explore</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center text-white hover:text-gray-300 transition duration-200 space-x-2"
          >
            <FaUserCircle size={22} />
            <span className="text-base">Logout</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

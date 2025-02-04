import { Link } from "react-router-dom"; 
import { useState } from "react"; 
import logo from "../../assets/logo.jpg";
import { FaUserCircle } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";
import { logout } from "../../Store/Slices/authSlice";
import { removeUser } from "../../Store/Slices/userSlice";
import { useDispatch } from "react-redux";
import axiosInstance from "../../Connection/Axios"
import { toast } from "sonner"

function Admin_Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCRMOpen, setIsCRMOpen] = useState(false);
  const [isAssetsOpen, setIsAssetsOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
        const response = await axiosInstance.post("/logout")
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
        toast.error("Internal server error: ", error)
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
            Dashboard
          </Link>
          <div
            className="relative group"
            onMouseEnter={() => setIsCRMOpen(true)}
            onMouseLeave={() => setIsCRMOpen(false)}
          >
            <button className="text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200">
              CRM
            </button>
            {isCRMOpen && (
              <div className="absolute left-0">
                <ul className="bg-[#fff] rounded-lg shadow-md w-32 mt-1">
                  <li>
                    <Link
                      to="/admin/crm/contact"
                      className="block py-2 px-4 text-black rounded-md hover:bg-gray-200 transition duration-200"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/crm/tag"
                      className="block py-2 px-4 text-black rounded-md hover:bg-gray-200 transition duration-200"
                    >
                      Tag
                    </Link>
                  </li>
                </ul>
                <div className="absolute left-4 bottom-full w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-[#fff]"></div>
              </div>
            )}
          </div>

          <div
            className="relative group"
            onMouseEnter={() => setIsAssetsOpen(true)}
            onMouseLeave={() => setIsAssetsOpen(false)}
          >
            <button className="text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200">
              Assets
            </button>
            {isAssetsOpen && (
              <div className="absolute left-0">
                <ul className="bg-[#fff] rounded-lg shadow-md w-32 mt-1">
                  <li>
                    <Link
                      to="/admin/assets/courses"
                      className="block py-2 px-4 text-black rounded-md hover:bg-gray-200 transition duration-200"
                    >
                      Courses
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/assets/files"
                      className="block py-2 px-4 text-black rounded-md hover:bg-gray-200 transition duration-200"
                    >
                      Files
                    </Link>
                  </li>
                </ul>
                <div className="absolute left-4 bottom-full w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-[#fff]"></div>
              </div>
            )}
          </div>

          <div
            className="relative group"
            onMouseEnter={() => setIsSalesOpen(true)}
            onMouseLeave={() => setIsSalesOpen(false)}
          >
            <button className="text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200">
              Sales
            </button>
            {isSalesOpen && (
              <div className="absolute left-0">
                <ul className="bg-[#fff] rounded-lg shadow-md w-32 mt-1">
                  <li>
                    <Link
                      to="/admin/sales/transactions"
                      className="block py-2 px-4 text-black rounded-md hover:bg-gray-200 transition duration-200"
                    >
                      Transactions
                    </Link>
                  </li>
                </ul>
                <div className="absolute left-4 bottom-full w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-[#fff]"></div>
              </div>
            )}
          </div>

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

export default Admin_Navbar;

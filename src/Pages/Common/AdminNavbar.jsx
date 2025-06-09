import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo.jpg";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Store/Slices/authSlice";
import { removeUser } from "../../Store/Slices/userSlice";
import { useDispatch } from "react-redux";
import axiosInstance from "../../Connection/Axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

function Admin_Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeDropdown, setActiveDropdown] = useState("");

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
      toast.error("Internal server error");
      console.log("logout failed", error);
    }
  };

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? "" : name));
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  };

  const linkClass =
    "flex justify-center items-center py-2 px-4 text-sm text-white hover:bg-[#00695c] transition rounded-md";

  const dropdownClass =
    "absolute mt-2 bg-[#003d33] text-white rounded-xl shadow-lg w-28 z-20 ";

  return (
    <header className="w-full bg-gradient-to-br from-[#00251a] via-[#003d33] to-[#004d40] shadow-lg py-3 px-6 fixed top-0 left-0 flex items-center justify-between z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="w-10 h-10 rounded-md" />
        <h1 className="text-white text-xl font-bold tracking-wide">
          SkillXera
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-8 relative">
        <Link to="/admin/dashboard" className={linkClass}>
          DASHBOARD
        </Link>

        {/* CRM Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => toggleDropdown("crm")}
          onMouseLeave={() => toggleDropdown("")}
        >
          <button className={linkClass}>CRM</button>
          <AnimatePresence>
            {activeDropdown === "crm" && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={dropdownClass}
              >
                <Link to="/admin/crm/contact" className={linkClass}>
                  Contact
                </Link>
                <Link to="/admin/crm/tag" className={linkClass}>
                  Tag
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Assets Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => toggleDropdown("assets")}
          onMouseLeave={() => toggleDropdown("")}
        >
          <button className={linkClass}>ASSETS</button>
          <AnimatePresence>
            {activeDropdown === "assets" && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={dropdownClass}
              >
                <Link to="/admin/assets/courses" className={linkClass}>
                  Courses
                </Link>
                <Link to="/admin/assets/files" className={linkClass}>
                  Files
                </Link>
                <Link to="/admin/assets/order-bumps" className={linkClass}>
                  Order Bumb
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sales Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => toggleDropdown("sales")}
          onMouseLeave={() => toggleDropdown("")}
        >
          <button className={linkClass}>SALES</button>
          <AnimatePresence>
            {activeDropdown === "sales" && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={dropdownClass}
              >
                <Link to="/admin/sales/payment-management" className={linkClass}>
                  Manage
                </Link>
                <Link to="/admin/sales/transactions" className={linkClass}>
                  Transactions
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => toggleDropdown("profile")}
          onMouseLeave={() => toggleDropdown("")}
        >
          <button className={`${linkClass} flex items-center gap-2`}>
            <FaUserCircle size={18} /> PROFILE
          </button>
          <AnimatePresence>
            {activeDropdown === "profile" && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={dropdownClass}
              >
                <Link to="/admin/user-profile" className={linkClass}>
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 px-4 text-red-400 hover:bg-[#004d40] transition rounded-md"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}

export default Admin_Navbar;

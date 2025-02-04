import { useNavigate } from "react-router-dom";
import { logout } from "../Store/Slices/authSlice";
import { removeUser } from "../Store/Slices/userSlice";
import { useDispatch } from "react-redux";
import axiosInstance from "../Connection/Axios"
import { toast } from "sonner"

// Register the chart components


function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  

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
  }
  // Chart data
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

       
        
      </div>
    </div>
  );
}

export default HomePage;

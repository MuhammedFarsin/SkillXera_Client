import { useNavigate } from "react-router-dom";
import { logout } from "../Store/Slices/authSlice";
import { removeUser } from "../Store/Slices/userSlice";
import { useDispatch } from "react-redux";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import Admin_Navbar from "./Common/AdminNavbar"

// Register the chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


function DashBoard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching data (simulate API call)
  useEffect(() => {
    // Simulate fetching sales data from API or database
    const fetchSalesData = async () => {
      try {
        // You can replace this with an actual API call
        const sales = [
          { month: "Jan", sales: 50 },
          { month: "Feb", sales: 75 },
          { month: "Mar", sales: 120 },
          { month: "Apr", sales: 80 },
          { month: "May", sales: 200 },
        ];
        
        setSalesData(sales);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(logout());
    dispatch(removeUser());
    localStorage.clear();
    navigate("/");
  };

  // Chart data
  const chartData = {
    labels: salesData.map((data) => data.month),
    datasets: [
      {
        label: "Sales in Units",
        data: salesData.map((data) => data.sales),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Admin_Navbar />
      <div className="w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Display loading indicator while fetching data */}
        {loading ? (
          <div className="text-center text-gray-600">Loading sales data...</div>
        ) : (
          <div className="chart-container">
            <Bar data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: "Sales Data" } } }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DashBoard

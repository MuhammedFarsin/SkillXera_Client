import { useNavigate } from "react-router-dom";
import { logout } from "../Store/Slices/authSlice";
import { removeUser } from "../Store/Slices/userSlice";
import { useDispatch } from "react-redux";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import Admin_Navbar from "./Common/AdminNavbar";

// Register the chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DashBoard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching data (simulate API call)
  useEffect(() => {
    // Simulate fetching sales and leads data from API or database
    const fetchData = async () => {
      try {
        // Replace this with actual API calls
        const sales = [
          { month: "Jan", sales: 50 },
          { month: "Feb", sales: 75 },
          { month: "Mar", sales: 120 },
          { month: "Apr", sales: 80 },
          { month: "May", sales: 200 },
        ];

        const leads = [
          { month: "Jan", leads: 30 },
          { month: "Feb", leads: 40 },
          { month: "Mar", leads: 60 },
          { month: "Apr", leads: 50 },
          { month: "May", leads: 100 },
        ];

        setSalesData(sales);
        setLeadsData(leads);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(logout());
    dispatch(removeUser());
    localStorage.clear();
    navigate("/");
  };

  // Sales Chart Data
  const salesChartData = {
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

  // Leads Chart Data
  const leadsChartData = {
    labels: leadsData.map((data) => data.month),
    datasets: [
      {
        label: "Leads Generated",
        data: leadsData.map((data) => data.leads),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Admin_Navbar />
      <div className="w-full max-w-6xl p-4 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Three sections layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Sales Graph Section */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Sales Data</h3>
            {loading ? (
              <div className="text-center text-gray-600">Loading sales data...</div>
            ) : (
              <Bar data={salesChartData} options={{ responsive: true, plugins: { title: { display: true, text: "Sales Data" } } }} />
            )}
          </div>

          {/* Leads Graph Section */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Leads Data</h3>
            {loading ? (
              <div className="text-center text-gray-600">Loading leads data...</div>
            ) : (
              <Bar data={leadsChartData} options={{ responsive: true, plugins: { title: { display: true, text: "Leads Data" } } }} />
            )}
          </div>
        </div>

        {/* Live Updates Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Live Updates</h3>
          <div className="border-t pt-4 text-gray-600">
            <p>System updates, notifications, or real-time changes would be displayed here.</p>
            {/* Example of live updates */}
            <ul className="space-y-2">
              <li>New lead added: John Doe</li>
              <li>Sales target reached for the month.</li>
              <li>Server maintenance scheduled at 5:00 PM.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;

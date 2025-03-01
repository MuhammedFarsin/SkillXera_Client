import { useState, useEffect } from "react";
import Admin_Navbar from "./Common/AdminNavbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axiosInstance from "../Connection/Axios";

function DashBoard() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch sales data from backend
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axiosInstance.get("/admin/sales-data");
        const { totalOrders, totalRevenue, recentOrders } = response.data;
  
        // Convert data to match expected format
        const formattedData = [
          { name: "Total Orders", sales: totalOrders },
          { name: "Total Revenue", sales: totalRevenue },
        ];
  
        setSalesData(formattedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSalesData();
  }, []);
  

  return (
    <div className="relative bg-gray-100 min-h-screen">
      <Admin_Navbar />

      <div className="p-10 mx-auto py-10 mt-12 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
        </div>

        {/* Three Columns */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - New Leads */}
          <div className="col-span-4 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">New Leads</h2>
            <p className="text-gray-600">Filter options go here.</p>
          </div>

          {/* Middle Column - Sales Chart */}
          <div className="col-span-4 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Sales</h2>
            {loading ? (
              <p className="text-gray-500">Loading sales data...</p>
            ) : salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-red-500">No sales data available.</p>
            )}
          </div>

          {/* Right Column - Live Updates */}
          <div className="col-span-4 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Live Updates</h2>
            <p className="text-gray-600">Additional stats or quick info here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;

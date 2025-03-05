import { useState, useEffect } from "react";
import Admin_Navbar from "./Common/AdminNavbar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../Connection/Axios";

function DashBoard() {
  const [salesData, setSalesData] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get("/admin/sales-data");
        const { totalOrders, totalRevenue, leadsGraphData } = response.data;

        const formattedSalesData = [
          { name: "Total Orders", sales: totalOrders },
          { name: "Total Revenue", sales: totalRevenue },
        ];

        setSalesData(formattedSalesData);
        setLeadsData(leadsGraphData);
      } catch (error) {
        setError("Failed to fetch dashboard data. Please try again later.");
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalLeads = leadsData.reduce((acc, lead) => acc + (lead.count || 0), 0);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen text-sm">
      <Admin_Navbar />
      <div className="p-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4 mt-16">
          <h2 className="text-xl font-semibold text-gray-100">Dashboard</h2>
        </div>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            {/* Leads Graph Card */}
            <div className="bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-md font-semibold text-gray-200 mb-2">
                Leads Over Time:{" "}
                <span className="text-green-400 font-bold">{totalLeads}</span>
              </h3>

              {loading ? (
                <p className="text-gray-400 animate-pulse">Fetching data...</p>
              ) : leadsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={leadsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" tick={{ fill: "#bbb" }} />
                    <YAxis tick={{ fill: "#bbb" }} />
                    <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
                    <Area type="monotone" dataKey="count" stroke="#75B264" fill="rgba(117, 178, 100, 0.3)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400">No leads data available.</p>
              )}
            </div>

            {/* Sales Chart Card */}
            <div className="bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-md font-semibold text-gray-200 mb-2">Sales</h3>
              {loading ? (
                <p className="text-gray-400 animate-pulse">Fetching data...</p>
              ) : salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" tick={{ fill: "#bbb" }} />
                    <YAxis tick={{ fill: "#bbb" }} />
                    <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
                    <Area type="monotone" dataKey="sales" stroke="#DA2B21" fill="rgba(218, 43, 33, 0.3)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400">No sales data available.</p>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow h-[300px]">
            <h3 className="text-md font-semibold text-gray-200 mb-2">Live Updates</h3>
            <p className="text-gray-400 text-sm">Additional stats or quick info here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;

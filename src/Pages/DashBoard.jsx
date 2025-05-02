import { useState, useEffect } from "react";
import Admin_Navbar from "./Common/AdminNavbar";
import { FaFilter } from "react-icons/fa";
import { format } from "date-fns";
import DateRange_Picker from "../Utils/DateRangePicker";
import "react-datepicker/dist/react-datepicker.css";
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
import socket from "../socket"; // Import the socket instance

function DashBoard() {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [showPicker, setShowPicker] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [dashboardData, setDashboardData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNewLeads, setHasNewLeads] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Function to fetch data
  const fetchDashboardData = async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);
  
      const query = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : "";
      const response = await axiosInstance.get(`/admin/dashboard${query}`);
  
      const {
        ordersGraphData,
        leadsGraphData,
        totalLeads,
        totalSales,
        recentLeads,
        totalRevenue,
      } = response.data;
  
      setSalesData(ordersGraphData);
      setLeadsData(leadsGraphData);
      setTotalLeads(totalLeads);
      setTotalSales(totalSales);
      setTotalRevenue(totalRevenue);
      setRecentLeads(recentLeads);
      setDashboardData(response.data);
    } catch (error) {
      setError("Failed to fetch dashboard data. Please try again later.");
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Socket.IO effects
  useEffect(() => {
    // Listen for new leads
    socket.on("new_lead", (newLead) => {
      setHasNewLeads(true);
      setNotificationCount(prev => prev + 1);
      
      // Update recent leads (keep only the 5 most recent)
      setRecentLeads(prev => [newLead, ...prev.slice(0, 4)]);
      
      // Update total leads count
      setTotalLeads(prev => prev + 1);
    });

    // Clean up on unmount
    return () => {
      socket.off("new_lead");
    };
  }, []);

  // Date range effect
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const startDate = format(dateRange.startDate, "yyyy-MM-dd");
      const endDate = format(dateRange.endDate, "yyyy-MM-dd");
      fetchDashboardData(startDate, endDate);
    } else {
      fetchDashboardData();
    }
  }, [dateRange]);

  // Clear notifications
  const clearNotifications = () => {
    setHasNewLeads(false);
    setNotificationCount(0);
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen text-sm">
      <Admin_Navbar />
      <div className="p-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4 mt-16">
          <h2 className="text-2xl font-extrabold text-gray-100">Dashboard</h2>

          {/* Stats Boxes */}
          <div className="flex space-x-4">
            <div className="bg-gray-800 px-6 py-3 w-72 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <p className="text-white text-xl font-bold">Total Leads :</p>
                <h3 className="text-2xl font-bold text-green-400">
                  {loading ? "..." : totalLeads}
                </h3>
              </div>
            </div>
            <div className="bg-gray-800 px-6 py-3 w-72 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <p className="text-white text-xl font-bold">Total Sales :</p>
                <h3 className="text-2xl font-bold text-blue-400">
                  {loading ? "..." : totalSales}
                </h3>
              </div>
            </div>
            <div className="bg-gray-800 px-6 py-3 w-72 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <p className="text-white text-xl font-bold">Total Revenue :</p>
                <h3 className="text-2xl font-bold text-yellow-400">
                  {loading ? "..." : totalRevenue}
                </h3>
              </div>
            </div>
            {/* Filter Button */}
            <div
              className="bg-gray-800 px-6 py-3 rounded-lg shadow-md flex justify-center items-center cursor-pointer"
              onClick={() => setShowPicker((prev) => !prev)}
            >
              <FaFilter className="text-gray-300 text-xl hover:text-white" />
            </div>

            {/* Date Picker UI */}
            <DateRange_Picker
              showPicker={showPicker}
              setShowPicker={setShowPicker}
              setDateRange={setDateRange}
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            {/* Leads Graph Card */}
            <div className="bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-md font-semibold text-gray-200 mb-2">
                Leads Over Time
              </h3>

              {loading ? (
                <p className="text-gray-400 animate-pulse">Fetching data...</p>
              ) : leadsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={leadsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" tick={{ fill: "#bbb" }} />
                    <YAxis tick={{ fill: "#bbb" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#222", color: "#fff" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#75B264"
                      fill="rgba(117, 178, 100, 0.3)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400">No leads data available.</p>
              )}
            </div>

            {/* Sales Chart Card */}
            <div className="bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-md font-semibold text-gray-200 mb-2">
                Orders & Revenue Over Time
              </h3>
              {loading ? (
                <p className="text-gray-400 animate-pulse">Fetching data...</p>
              ) : salesData.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Box - Orders Graph */}
                  <div className="bg-gray-900 p-4 rounded-lg shadow">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">
                      Orders Over Time
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="date" tick={{ fill: "#bbb" }} />
                        <YAxis tick={{ fill: "#bbb" }} domain={[0, "auto"]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#222",
                            color: "#fff",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="totalOrders"
                          stroke="#F59E0B"
                          fill="rgba(245, 158, 11, 0.3)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Right Box - Revenue Graph */}
                  <div className="bg-gray-900 p-4 rounded-lg shadow">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">
                      Revenue Over Time
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="date" tick={{ fill: "#bbb" }} />
                        <YAxis tick={{ fill: "#bbb" }} domain={[0, "auto"]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#222",
                            color: "#fff",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="totalRevenue"
                          stroke="#0086F8"
                          fill="rgba(35, 51, 88, 0.6)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No orders data available.</p>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold text-gray-200">Live Updates</h3>
              {hasNewLeads && (
                <button 
                  onClick={clearNotifications}
                  className="relative p-1"
                  title="Clear notifications"
                >
                  <span className="absolute -top-1 -right-1 h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center">
                      {notificationCount}
                    </span>
                  </span>
                </button>
              )}
            </div>

            {loading ? (
              <p className="text-gray-400 animate-pulse">
                Fetching latest leads...
              </p>
            ) : recentLeads.length > 0 ? (
              <ul className="space-y-2">
                {recentLeads.map((lead, index) => (
                  <li
                    key={index}
                    className="bg-gray-700 p-2 rounded-lg shadow text-sm space-y-2"
                  >
                    <p className="text-gray-300 font-medium">
                      {lead.username || "Unknown Username"}
                    </p>
                    <p className="text-gray-300 font-medium">
                      {lead.email || "Unknown Email"}
                    </p>
                    <p className="text-gray-300 font-medium">
                      {lead.phone || "Unknown Number"}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {format(new Date(lead.createdAt), "PPpp")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No recent leads available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
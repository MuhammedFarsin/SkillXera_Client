import AdminNavbar from "../../Common/AdminNavbar";
import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import axiosInstance from "../../../Connection/Axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function OrderBumpTable() {
  const navigate = useNavigate();
  const [orderBumps, setOrderBumps] = useState([]); // ✅ Default is an array

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch order bumps
  useEffect(() => {
    const fetchOrderBumps = async () => {
      try {
        const response = await axiosInstance.get(
          "/admin/assets/get-order-bumps"
        );
        setOrderBumps(response.data.data);
        setIsLoading(false);
      } catch (error) {
        toast.error(error.response.data.message);
        setIsLoading(false);
      }
    };

    fetchOrderBumps();
  }, []);

  // Filter order bumps
  const filteredBumps = orderBumps.filter(
    (bump) =>
      bump.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bump.targetProduct?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete order bump
  const handleDelete = async (id) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#1f2937", // Match dark theme
      color: "#ffffff", // White text
      customClass: {
        container: "bg-gray-900", // Dark background
      },
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/admin/assets/delete-order-bump/${id}`);

        setOrderBumps(orderBumps.filter((bump) => bump._id !== id));

        await Swal.fire({
          title: "Deleted!",
          text: "Your order bump has been deleted.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          background: "#1f2937",
          color: "#ffffff",
        });
      } catch (error) {
        // Show error notification
        await Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to delete order bump",
          icon: "error",
          confirmButtonColor: "#3085d6",
          background: "#1f2937",
          color: "#ffffff",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 text-sm">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto mt-20">
        {/* Header with search and add button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold uppercase">Order Bumps</h1>

          <div className="flex space-x-4">
            {/* Search input */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bumps..."
                className="bg-gray-800 text-gray-100 pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Add button */}
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
              onClick={() => navigate("/admin/assets/add-order-bump")}
            >
              <FiPlus className="mr-2" />
              Add Order Bump
            </button>
          </div>
        </div>

        {/* Order bumps table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-750">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Target Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Conversion
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    Loading order bumps...
                  </td>
                </tr>
              ) : filteredBumps.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No order bumps found
                  </td>
                </tr>
              ) : (
                filteredBumps.map((bump) => (
                  <tr
                    key={bump._id}
                    className="hover:bg-gray-750 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-white">
                        {bump.displayName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {bump.targetProduct?.title || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      ${bump.bumpPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bump.isActive
                            ? "bg-green-900 text-green-300"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {bump.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {bump.conversions || 0} / {bump.displays || 0} (
                      {bump.displays
                        ? Math.round((bump.conversions / bump.displays) * 100)
                        : 0}
                      %)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center gap-3">
                        <button
                          className="flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition"
                          onClick={() =>
                            navigate(
                              `/admin/assets/edit-order-bump/${bump._id}`
                            )
                          }
                        >
                          <FiEdit2 className="mr-1" />
                          Edit
                        </button>
                        <button
                          className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
                          onClick={() => handleDelete(bump._id)}
                        >
                          <FiTrash2 className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderBumpTable;

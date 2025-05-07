import { useState, useEffect } from "react";
import axiosInstance from "../../../Connection/Axios";
import { toast } from "sonner";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Admin_Navbar from "../../Common/AdminNavbar";
import Spinner from "../../Common/spinner";
import Swal from "sweetalert2";

function DigitalCourse() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(
          "/admin/assets/file/get-digital-products"
        );
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch products");
        console.log(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(
          `/admin/assets/file/delete-digital-products/${productId}`
        );
        setProducts(products.filter((product) => product._id !== productId));
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete product.", "error");
        console.log(error);
      }
    }
  };

  // Toggle product status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      const response = await axiosInstance.patch(
        `/admin/assets/file/digital-products/${id}/status`,
        { status: newStatus }
      );
      if (response.status === 200) {
        setProducts(
          products.map((product) =>
            product._id === id ? { ...product, status: newStatus } : product
          )
        );

        toast.success(`Product status changed to ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Filter products based on search term and status
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? product.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 text-sm">
      <Admin_Navbar />
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold text-white mt-20">
            Digital Products
          </h1>
          {/* Search and Filter Controls */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 mt-20">
            {/* Search Input */}

            <div className="relative flex-grow min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              className="w-full sm:w-48 p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1); // Reset to first page when filtering
              }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Add Product Button */}
            <button
              onClick={() =>
                navigate("/admin/assets/file/add-digital-product-page")
              }
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              <FiPlus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mt-4">
          {loading ? (
            <div className="flex flex-col items-center space-y-4 py-8">
              <Spinner small />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-750">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Source Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Regular Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Sales Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {currentProducts.length > 0 ? (
                      currentProducts.map((product) => (
                        <tr
                          key={product._id}
                          className="hover:bg-gray-750 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">
                              ${product.regularPrice}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">
                              ${product.salePrice || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                product.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.status || "inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <div className="flex space-x-3">
                              <button
                                className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                onClick={() =>
                                  navigate(
                                    `/admin/assets/file/edit-digital-product-page/${product._id}`
                                  )
                                }
                                title="Edit"
                              >
                                <FiEdit size={18} />
                              </button>
                              <button
                                className="text-red-400 hover:text-red-300 transition-colors"
                                onClick={() => handleDelete(product._id)}
                                title="Delete"
                              >
                                <FiTrash2 size={18} />
                              </button>
                              <button
                                className={`${
                                  product.status === "active"
                                    ? "text-yellow-400 hover:text-yellow-300"
                                    : "text-green-400 hover:text-green-300"
                                } transition-colors`}
                                onClick={() =>
                                  toggleStatus(product._id, product.status)
                                }
                                title={
                                  product.status === "active"
                                    ? "Deactivate"
                                    : "Activate"
                                }
                              >
                                {product.status === "active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-4 text-center text-gray-400"
                        >
                          No digital products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredProducts.length > productsPerPage && (
                <div className="px-6 py-4 bg-gray-750 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-400">
                    Showing {indexOfFirstProduct + 1} to{" "}
                    {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                    {filteredProducts.length} products
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({
                      length: Math.ceil(
                        filteredProducts.length / productsPerPage
                      ),
                    }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          currentPage === index + 1
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DigitalCourse;

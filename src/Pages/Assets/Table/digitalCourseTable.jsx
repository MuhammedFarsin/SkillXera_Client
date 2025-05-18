import { useState, useEffect } from "react";
import axiosInstance from "../../../Connection/Axios";
import { toast } from "sonner";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Admin_Navbar from "../../Common/AdminNavbar";
import Spinner from "../../Common/Spinner";
import Swal from "sweetalert2";

function DigitalCourse() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [salesPages, setSalesPages] = useState({});
  const [loadingSalesPages, setLoadingSalesPages] = useState({});
  const [checkoutPages, setCheckoutPages] = useState({});
  const [loadingCheckoutPages, setLoadingCheckoutPages] = useState({});
  const [thankYouPages, setThankYouPages] = useState({});
  const [loadingThankYouPages, setLoadingThankYouPages] = useState({});
  const navigate = useNavigate();

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

   const checkSalesPageExists = async (productId) => {
    try {
      const response = await axiosInstance.get(
        `/admin/assets/file/check-sales-page/digital-product/${productId}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking sales page:", error);
      return false;
    }
  };

  const checkCheckoutPageExists = async (productId) => {
    try {
      const response = await axiosInstance.get(
        `/admin/assets/file/check-checkout-page/digital-product/${productId}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking checkout page:", error);
      return false;
    }
  };

  const checkThankYouPageExists = async (productId) => {
    try {
      const response = await axiosInstance.get(
        `/admin/assets/file/check-thankyou-page/digital-product/${productId}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking thank-you page:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAllPages = async () => {
      const salesPagesData = {};
      const checkoutPagesData = {};
      const thankYouPagesData = {};
      const loadingSales = {};
      const loadingCheckout = {};
      const loadingThankYou = {};

      for (const product of products) {
        // Check sales page
        loadingSales[product._id] = true;
        setLoadingSalesPages((prev) => ({ ...prev, [product._id]: true }));
        salesPagesData[product._id] = await checkSalesPageExists(product._id);
        loadingSales[product._id] = false;
        setLoadingSalesPages((prev) => ({ ...prev, [product._id]: false }));

        // Check checkout page
        loadingCheckout[product._id] = true;
        setLoadingCheckoutPages((prev) => ({ ...prev, [product._id]: true }));
        checkoutPagesData[product._id] = await checkCheckoutPageExists(product._id);
        loadingCheckout[product._id] = false;
        setLoadingCheckoutPages((prev) => ({ ...prev, [product._id]: false }));

        // Check thank-you page
        loadingThankYou[product._id] = true;
        setLoadingThankYouPages((prev) => ({ ...prev, [product._id]: true }));
        thankYouPagesData[product._id] = await checkThankYouPageExists(product._id);
        loadingThankYou[product._id] = false;
        setLoadingThankYouPages((prev) => ({ ...prev, [product._id]: false }));
      }

      setSalesPages(salesPagesData);
      setCheckoutPages(checkoutPagesData);
      setThankYouPages(thankYouPagesData);
    };

    if (products.length > 0) {
      checkAllPages();
    }
  }, [products]);

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? product.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

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
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold text-white mt-20">
            Digital Products
          </h1>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-center mt-20">
            <div className="relative w-full sm:w-64">
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
                  setCurrentPage(1);
                }}
              />
            </div>
            <select
              className="w-full sm:w-48 p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={() =>
                navigate("/admin/assets/file/add-digital-product-page")
              }
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full sm:w-auto"
            >
              <FiPlus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mt-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner small />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Regular Price
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Sales Price
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
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
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm font-medium text-white">
                            {product.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-300">
                          ${product.regularPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-300">
                          ${product.salePrice || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`px-4 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-2xl ${
                              product.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.status || "inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center space-x-2">
                            <button
                              className="w-12 text-indigo-400 hover:text-indigo-300 transition-colors p-1 flex items-center justify-center"
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
                              className="w-12 text-red-400 hover:text-red-300 transition-colors p-1 flex items-center justify-center"
                              onClick={() => handleDelete(product._id)}
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
                            </button>
                            <button
                              className={`w-20 ${
                                product.status === "active"
                                  ? "text-yellow-400 hover:text-yellow-300"
                                  : "text-green-400 hover:text-green-300"
                              } transition-colors p-1 text-sm flex items-center justify-center`}
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
                            <button
                      className="w-24 text-blue-400 hover:text-blue-300 transition-colors p-1 text-sm flex items-center justify-center"
                      onClick={async () => {
                        try {
                          if (loadingSalesPages[product._id]) return;

                          setLoadingSalesPages((prev) => ({
                            ...prev,
                            [product._id]: true,
                          }));
                          const exists = salesPages[product._id];
                          setLoadingSalesPages((prev) => ({
                            ...prev,
                            [product._id]: false,
                          }));

                          if (exists) {
                            navigate(
                              `/admin/assets/edit-sales-page/digital-product/${product._id}`
                            );
                          } else {
                            navigate(
                              `/admin/assets/create-sales-page/digital-product/${product._id}`
                            );
                          }
                        } catch (error) {
                          toast.error("Failed to navigate to sales page");
                          console.error(error);
                        }
                      }}
                      disabled={loadingSalesPages[product._id]}
                      title={
                        salesPages[product._id]
                          ? "Edit sales page"
                          : "Create sales page"
                      }
                    >
                      {loadingSalesPages[product._id]
                        ? "Checking..."
                        : salesPages[product._id]
                        ? "Edit Sales"
                        : "Create Sales"}
                    </button>
                    
                    {/* Checkout Page Button */}
                    <button
                      className="w-24 text-purple-400 hover:text-purple-300 transition-colors p-1 text-sm flex items-center justify-center"
                      onClick={async () => {
                        try {
                          if (loadingCheckoutPages[product._id]) return;

                          setLoadingCheckoutPages((prev) => ({
                            ...prev,
                            [product._id]: true,
                          }));
                          const exists = checkoutPages[product._id];
                          setLoadingCheckoutPages((prev) => ({
                            ...prev,
                            [product._id]: false,
                          }));

                          if (exists) {
                            navigate(
                              `/admin/assets/edit-checkout-page/digital-product/${product._id}`
                            );
                          } else {
                            navigate(
                              `/admin/assets/create-checkout-page/digital-product/${product._id}`
                            );
                          }
                        } catch (error) {
                          toast.error("Failed to navigate to checkout page");
                          console.error(error);
                        }
                      }}
                      disabled={loadingCheckoutPages[product._id]}
                      title={
                        checkoutPages[product._id]
                          ? "Edit checkout page"
                          : "Create checkout page"
                      }
                    >
                      {loadingCheckoutPages[product._id]
                        ? "Checking..."
                        : checkoutPages[product._id]
                        ? "Edit Checkout"
                        : "Add Checkout"}
                    </button>
                    
                    {/* Thank You Page Button */}
                    <button
                      className="w-24 text-green-400 hover:text-green-300 transition-colors p-1 text-sm flex items-center justify-center"
                      onClick={async () => {
                        try {
                          if (loadingThankYouPages[product._id]) return;

                          setLoadingThankYouPages((prev) => ({
                            ...prev,
                            [product._id]: true,
                          }));
                          const exists = thankYouPages[product._id];
                          setLoadingThankYouPages((prev) => ({
                            ...prev,
                            [product._id]: false,
                          }));

                          if (exists) {
                            navigate(
                              `/admin/assets/edit-thankyou-page/digital-product/${product._id}`
                            );
                          } else {
                            navigate(
                              `/admin/assets/create-thankyou-page/digital-product/${product._id}`
                            );
                          }
                        } catch (error) {
                          toast.error("Failed to navigate to thank-you page");
                          console.error(error);
                        }
                      }}
                      disabled={loadingThankYouPages[product._id]}
                      title={
                        thankYouPages[product._id]
                          ? "Edit thank-you page"
                          : "Create thank-you page"
                      }
                    >
                      {loadingThankYouPages[product._id]
                        ? "Checking..."
                        : thankYouPages[product._id]
                        ? "Edit Thank You"
                        : "Add Thank You"}
                    </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-6 text-gray-400 text-sm"
                      >
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > productsPerPage && (
          <div className="flex justify-center mt-6">
            <nav className="inline-flex rounded-md shadow">
              {Array.from({
                length: Math.ceil(filteredProducts.length / productsPerPage),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 border border-gray-700 ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  } ${index === 0 ? "rounded-l-md" : ""} ${
                    index ===
                    Math.ceil(filteredProducts.length / productsPerPage) - 1
                      ? "rounded-r-md"
                      : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default DigitalCourse;

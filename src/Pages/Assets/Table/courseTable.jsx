import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiEdit2,
  FiTrash2,
  FiShare2,
  FiDollarSign,
  FiPlus,
} from "react-icons/fi";
import EmptyPage from "../../../assets/Empty.jpg";
import Swal from "sweetalert2";
import axiosInstance from "../../../Connection/Axios";
import { toast } from "sonner";
import ShareLinkModal from "../PopUpMessage/BuyingCourseLinkModal";
import { frontendRoute } from "../../../Utils/utils";
import Admin_Navbar from "../../Common/AdminNavbar";
import Spinner from "../../Common/Spinner";

const CourseTable = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [buyLink, setBuyLink] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [openShareModal, setOpenShareModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [loading, setLoading] = useState(true);
  const [salesPages, setSalesPages] = useState({});
  const [loadingSalesPages, setLoadingSalesPages] = useState({});
  const [checkoutPages, setCheckoutPages] = useState({});
  const [loadingCheckoutPages, setLoadingCheckoutPages] = useState({});
  const [thankYouPages, setThankYouPages] = useState({});
  const [loadingThankYouPages, setLoadingThankYouPages] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fullBuyingCourseRoute = `${frontendRoute}/sale/sales-page/course`;

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance("/admin/assets/get-courses");
      if (response.status === 200) {
        setCourses(response.data);
      } else {
        toast.error("Failed to fetch courses");
      }
    } catch (error) {
      toast.error("Failed to fetch courses");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkSalesPageExists = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `/admin/assets/check-sales-page/course/${courseId}`
    );
    return response.data.exists;
  } catch (error) {
    console.error("Error checking sales page:", error);
    return false;
  }
};

const checkCheckoutPageExists = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `/admin/assets/check-checkout-page/course/${courseId}`
    );
    return response.data.exists;
  } catch (error) {
    console.error("Error checking checkout page:", error);
    return false;
  }
};

const checkThankYouPageExists = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `/admin/assets/check-thankyou-page/course/${courseId}`
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

      for (const course of courses) {
        // Check sales page
        loadingSales[course._id] = true;
        setLoadingSalesPages((prev) => ({ ...prev, [course._id]: true }));
        salesPagesData[course._id] = await checkSalesPageExists(course._id);
        loadingSales[course._id] = false;
        setLoadingSalesPages((prev) => ({ ...prev, [course._id]: false }));

        // Check checkout page
        loadingCheckout[course._id] = true;
        setLoadingCheckoutPages((prev) => ({ ...prev, [course._id]: true }));
        checkoutPagesData[course._id] = await checkCheckoutPageExists(
          course._id
        );
        loadingCheckout[course._id] = false;
        setLoadingCheckoutPages((prev) => ({ ...prev, [course._id]: false }));

        // Check thank-you page
        loadingThankYou[course._id] = true;
        setLoadingThankYouPages((prev) => ({ ...prev, [course._id]: true }));
        thankYouPagesData[course._id] = await checkThankYouPageExists(
          course._id
        );
        loadingThankYou[course._id] = false;
        setLoadingThankYouPages((prev) => ({ ...prev, [course._id]: false }));
      }

      setSalesPages(salesPagesData);
      setCheckoutPages(checkoutPagesData);
      setThankYouPages(thankYouPagesData);
    };

    if (courses.length > 0) {
      checkAllPages();
    }
  }, [courses]);

  // Filter and sort courses
  const filteredCourses = courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(search?.toLowerCase() || "") &&
      (filterStatus ? course.status === filterStatus : true)
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (courseId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: "#1f2937",
      color: "#ffffff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(
            `/admin/assets/delete-course/${courseId}`
          );
          if (response.status === 200) {
            toast.success("Course deleted successfully.");
            setCourses((prev) =>
              prev.filter((course) => course._id !== courseId)
            );
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to delete course."
          );
        }
      }
    });
  };

  const handleShare = (courseId) => {
    const fullLink = `${fullBuyingCourseRoute}/${courseId}`;
    setBuyLink(fullLink);
    setOpenShareModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 pt-24 text-sm">
      <Admin_Navbar />

      {/* Header and Filters */}
      <div className="max-w-7xl mx-auto mt-14">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold">Manage Courses</h1>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition-colors"
              onClick={() => navigate("/admin/assets/course/add-course")}
            >
              <FiPlus /> Add Course
            </button>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => requestSort("title")}
                  >
                    <div className="flex items-center gap-1">
                      Course Name
                      {sortConfig.key === "title" && (
                        <span className="text-xs">
                          {sortConfig.direction === "ascending" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => requestSort("regularPrice")}
                  >
                    <div className="flex items-center gap-1">
                      Regular Price
                      {sortConfig.key === "regularPrice" && (
                        <span className="text-xs">
                          {sortConfig.direction === "ascending" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => requestSort("salesPrice")}
                  >
                    <div className="flex items-center gap-1">
                      Sales Price
                      {sortConfig.key === "salesPrice" && (
                        <span className="text-xs">
                          {sortConfig.direction === "ascending" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => requestSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortConfig.key === "status" && (
                        <span className="text-xs">
                          {sortConfig.direction === "ascending" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <Spinner size="lg" />
                      </div>
                    </td>
                  </tr>
                ) : sortedCourses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <img
                          src={EmptyPage}
                          alt="No courses found"
                          className="w-32 h-32 object-contain opacity-70 mb-4"
                        />
                        <p className="text-gray-400">No courses found</p>
                        {search || filterStatus ? (
                          <button
                            className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm"
                            onClick={() => {
                              setSearch("");
                              setFilterStatus("");
                            }}
                          >
                            Clear filters
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedCourses.map((course) => (
                    <tr
                      key={course._id}
                      className="hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/admin/assets/courses/module/${course._id}`}
                          className="text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          {course.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <FiDollarSign className="text-gray-400" />
                          <span>{course.regularPrice}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <FiDollarSign className="text-gray-400" />
                          <span className="font-medium">
                            {course.salesPrice}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            course.status === "active"
                              ? "bg-green-900 text-green-300"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="w-24 text-blue-400 hover:text-blue-300 transition-colors p-1 text-sm flex items-center justify-center"
                            onClick={async () => {
                              try {
                                if (loadingSalesPages[course._id]) return;

                                setLoadingSalesPages((prev) => ({
                                  ...prev,
                                  [course._id]: true,
                                }));
                                const exists = salesPages[course._id];
                                setLoadingSalesPages((prev) => ({
                                  ...prev,
                                  [course._id]: false,
                                }));

                                if (exists) {
                                  navigate(
                                    `/admin/assets/edit-sales-page/course/${course._id}`
                                  );
                                } else {
                                  navigate(
                                    `/admin/assets/create-sales-page/course/${course._id}`
                                  );
                                }
                              } catch (error) {
                                toast.error("Failed to navigate to sales page");
                                console.error(error);
                              }
                            }}
                            disabled={loadingSalesPages[course._id]}
                            title={
                              salesPages[course._id]
                                ? "Edit sales page"
                                : "Create sales page"
                            }
                          >
                            {loadingSalesPages[course._id]
                              ? "Checking..."
                              : salesPages[course._id]
                              ? "Edit Sales"
                              : "Create Sales"}
                          </button>

                          {/* Checkout Page Button */}
                          <button
                            className="w-24 text-purple-400 hover:text-purple-300 transition-colors p-1 text-sm flex items-center justify-center"
                            onClick={async () => {
                              try {
                                if (loadingCheckoutPages[course._id]) return;

                                setLoadingCheckoutPages((prev) => ({
                                  ...prev,
                                  [course._id]: true,
                                }));
                                const exists = checkoutPages[course._id];
                                setLoadingCheckoutPages((prev) => ({
                                  ...prev,
                                  [course._id]: false,
                                }));

                                if (exists) {
                                  navigate(
                                    `/admin/assets/edit-checkout-page/course/${course._id}`
                                  );
                                } else {
                                  navigate(
                                    `/admin/assets/create-checkout-page/course/${course._id}`
                                  );
                                }
                              } catch (error) {
                                toast.error(
                                  "Failed to navigate to checkout page"
                                );
                                console.error(error);
                              }
                            }}
                            disabled={loadingCheckoutPages[course._id]}
                            title={
                              checkoutPages[course._id]
                                ? "Edit checkout page"
                                : "Create checkout page"
                            }
                          >
                            {loadingCheckoutPages[course._id]
                              ? "Checking..."
                              : checkoutPages[course._id]
                              ? "Edit Checkout"
                              : "Add Checkout"}
                          </button>

                          {/* Thank You Page Button */}
                          <button
                            className="w-24 text-green-400 hover:text-green-300 transition-colors p-1 text-sm flex items-center justify-center"
                            onClick={async () => {
                              try {
                                if (loadingThankYouPages[course._id]) return;

                                setLoadingThankYouPages((prev) => ({
                                  ...prev,
                                  [course._id]: true,
                                }));
                                const exists = thankYouPages[course._id];
                                setLoadingThankYouPages((prev) => ({
                                  ...prev,
                                  [course._id]: false,
                                }));

                                if (exists) {
                                  navigate(
                                    `/admin/assets/edit-thankyou-page/course/${course._id}`
                                  );
                                } else {
                                  navigate(
                                    `/admin/assets/create-thankyou-page/course/${course._id}`
                                  );
                                }
                              } catch (error) {
                                toast.error(
                                  "Failed to navigate to thank-you page"
                                );
                                console.error(error);
                              }
                            }}
                            disabled={loadingThankYouPages[course._id]}
                            title={
                              thankYouPages[course._id]
                                ? "Edit thank-you page"
                                : "Create thank-you page"
                            }
                          >
                            {loadingThankYouPages[course._id]
                              ? "Checking..."
                              : thankYouPages[course._id]
                              ? "Edit Thank You"
                              : "Add Thank You"}
                          </button>
                          <button
                            onClick={() => handleShare(course._id)}
                            className="text-gray-400 hover:text-indigo-400 p-2"
                            title="Share"
                          >
                            <FiShare2 />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/assets/course/edit-course/${course._id}`
                              )
                            }
                            className="text-gray-400 hover:text-blue-400 p-2"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
                            className="text-gray-400 hover:text-red-400 p-2"
                            title="Delete"
                          >
                            <FiTrash2 />
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

      <ShareLinkModal
        isOpen={openShareModal}
        onClose={() => setOpenShareModal(false)}
        buyLink={buyLink}
      />
    </div>
  );
};

export default CourseTable;

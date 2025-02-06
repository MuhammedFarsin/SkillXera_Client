import { useEffect, useState, useRef } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Admin_Navbar from "./Common/AdminNavbar";
import { motion, AnimatePresence } from "framer-motion";
import EmptyPage from "../assets/Empty.jpg";
import axiosInstance from "../Connection/Axios";
import { toast } from "sonner";
import ToastHot from "./Common/ToasterHot";
import Add_course_model from "./PopUpMessage/AddCourseModel";
import { useNavigate } from "react-router-dom";

function Admin_Assets_Course() {
  const [courses, setCourses] = useState([]);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance("/admin/assets/get-courses");
        if (response.status === 200) {
          setCourses(response.data);
        } else {
          toast.error("Failed to fetch courses:");
        }
      } catch (error) {
        toast.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleModal = () => {
    setModalOpen(true);
  };
  const toggleModalClose = () => {
    setModalOpen(false);
  };

  const filteredCourses = courses.filter((course) => {
    return (
      course.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus ? course.status === filterStatus : true)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedCourses = () => {
    if (sortConfig.key) {
      return [...currentItems].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return currentItems;
  };

  const handleDelete = async(courseId) => {
    try {
      const response = await axiosInstance.delete(`/admin/assets/delete-course/${courseId}`);
      if (response.status === 200) {
        toast.success("Course deleted successfully.");
        setCourses(courses.filter((course) => course._id!== courseId));

      } else {
        toast.error("Failed to delete course.");
      }
    } catch (error) {
      toast.error("Failed to delete course:", error);
    }
  }
  const handleEdit = async(courseId) => {
    try {
      const response = await axiosInstance.get(`/admin/assets/edit-course/${courseId}`);
      if (response.status === 200) {
        setModalOpen(true);
        toast.success("Course updated successfully")
        navigate("/admin/assets/course")
      } else {
        toast.error("Failed to fetch course.");
      }
    } catch (error) {
      toast.error("Failed to fetch course:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Admin_Navbar />
      <main className="p-8 pt-24">
        <div className="flex justify-end mb-8 space-x-6">
          <input
            type="text"
            placeholder="Search by course title..."
            className="p-3 rounded-lg shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <motion.select
            className="p-3 w-52 rounded-lg shadow-md bg-white border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </motion.select>
          <button
            className="bg-gradient-to-b from-[#1a1a1a] to-[#004d40] text-white px-6 py-3 rounded-lg transition duration-300"
            onClick={toggleModal}
          >
            Add Course
          </button>
        </div>
        <div className="relative">
          <div className="relative overflow-visible rounded-lg shadow-lg">
            <table className="w-full border-collapse bg-white">
              <thead className="bg-gradient-to-b from-[#1a1a1a] to-[#004d40] text-white">
                <tr>
                  <th
                    className="p-4 cursor-pointer"
                    onClick={() => requestSort("title")}
                  >
                    Course Name
                  </th>
                  <th
                    className="p-4 cursor-pointer"
                    onClick={() => requestSort("price")}
                  >
                    Price
                  </th>
                  <th
                    className="p-4 cursor-pointer"
                    onClick={() => requestSort("status")}
                  >
                    Status
                  </th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">
                      Loading courses...
                    </td>
                  </tr>
                ) : sortedCourses().length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">
                      <img
                        src={EmptyPage}
                        alt="No courses available"
                        className="w-40 mx-auto"
                      />
                    </td>
                  </tr>
                ) : (
                  sortedCourses().map((course) => (
                    <tr
                      key={course._id}
                      className="relative hover:bg-gray-100 "
                    >
                      <td className="p-4 text-center">{course.title}</td>
                      <td className="p-4 text-center">{course.price}</td>
                      <td className="p-4 text-center">
                        <span
                          className={
                            course.status === "active"
                              ? "bg-green-600 text-white px-3 py-1 rounded-full text-center"
                              : "bg-gray-400 text-white px-3 py-1 rounded-full text-center"
                          }
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="p-4 relative text-center">
                        <button
                          onMouseEnter={() => toggleMenu(course._id)}
                          className="p-2 hover:bg-gray-200 transition duration-300 rounded-full"
                        >
                          <HiOutlineDotsHorizontal className="text-center cursor-pointer" />
                        </button>
                        {openMenu === course._id && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="absolute right-0 mt-2 z-50 w-32 bg-white shadow-xl rounded-xl border border-gray-200 p-2"
                            ref={menuRef}
                          >
                            <div
                              className="flex flex-col gap-2"
                              onMouseEnter={(e) => e.stopPropagation()} 
                            >
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-50 rounded-md"
                              >
                                View
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-50 rounded-md"
                                onClick={() => handleEdit(course._id)}
                              >
                                Edit
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-50 rounded-md"
                              >
                                Share
                              </motion.button>
                              
                              <motion.button
                                whileHover={{
                                  scale: 1.05,
                                  backgroundColor: "#ffe0e0",
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
                                onClick={() => handleDelete(course._id)}
                              >
                                Delete
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
                <AnimatePresence />
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          {Array.from(
            { length: Math.ceil(filteredCourses.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-4 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-gradient-to-b from-[#1a1a1a] to-[#004d40] text-white"
                    : "bg-white text-blue-600"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </main>
      <ToastHot />
      <Add_course_model isOpen={modalOpen} onClose={toggleModalClose} />
    </div>
  );
}

export default Admin_Assets_Course;

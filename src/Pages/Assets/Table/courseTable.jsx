import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import EmptyPage from "../../../assets/Empty.jpg";
import Swal from "sweetalert2";
import axiosInstance from "../../../Connection/Axios";
import { toast } from "sonner";
import AddCourseModel from "../PopUpMessage/AddCourseModel";
import EditCourseModel from "../PopUpMessage/EditCourseModel";
import ShareLinkModal from "../PopUpMessage/BuyingCourseLinkModal";
import { frontendRoute } from "../../../Utils/utils";
import Admin_Navbar from "../../Common/AdminNavbar";

const CourseTable = () => {
  const menuRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [buyLink, setBuyLink] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchCourses();
  }, []);

  const fullBuyingCourseRoute = `${frontendRoute}/sale/buy-course/course`;

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

  const handleCourseAdded = (responseData) => {
    const newCourse = responseData;
    console.log("this is the new course :", newCourse);

    setCourses((prevCourses) => [...prevCourses, newCourse]); // Add the new course to the state
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

  const filteredCourses = courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(search?.toLowerCase() || "") &&
      (filterStatus ? course.status === filterStatus : true)
  );

  const handleDelete = async (courseId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
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
          } else {
            toast.error("Failed to delete course.");
          }
        } catch (error) {
          toast.error("Failed to delete course.");
          console.log(error);
        }
      }
    });
  };
  const handleShare = (courseId) => {
    const fullLink = `${fullBuyingCourseRoute}/${courseId}`;
    setBuyLink(fullLink);
    console.log(fullLink);
    setOpenShareModal(true);
  };
  const handleShareClose = () => {
    setOpenShareModal(false);
  };

  const handleEdit = (courseId) => {
    const courseSelectedId = courseId;
    if (courseSelectedId) {
      setSelectedCourse(courseSelectedId);
      setEditModalOpen(true);
    }
  };
  const handleCourseUpdated = (updatedCourse) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course._id === updatedCourse._id ? updatedCourse : course
      )
    );
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedCourses = () => {
    if (sortConfig.key) {
      return [...filteredCourses].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return filteredCourses;
  };

  return (
    <main className="p-8 pt-24 bg-gray-900 text-white min-h-screen text-sm">
      <Admin_Navbar />

      <div className="flex justify-end mb-8 space-x-6 text-sm">
        <input
          type="text"
          placeholder="Search by course title..."
          className="p-3 rounded-lg shadow-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-3 w-52 rounded-lg shadow-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          className="bg-gray-700 text-white px-6 py-3 rounded-lg transition duration-300 hover:opacity-80"
          onClick={() => setModalOpen(true)}
        >
          Add Course
        </button>
      </div>
  
      <div className="relative overflow-visible rounded-lg shadow-lg">
        <table className="w-full border-collapse bg-gray-800 rounded-lg">
          <thead className="bg-gradient-to-b from-gray-700 to-gray-600 text-white">
            <tr>
              <th className="p-4 cursor-pointer" onClick={() => requestSort("title")}>
                Course Name
              </th>
              <th className="p-4 cursor-pointer" onClick={() => requestSort("price")}>
                Price
              </th>
              <th className="p-4 cursor-pointer" onClick={() => requestSort("status")}>
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
                  <img src={EmptyPage} alt="No courses available" className="w-40 mx-auto" />
                </td>
              </tr>
            ) : (
              sortedCourses().map((course) => (
                <tr key={course._id} className="hover:bg-gray-700">
                  <td className="p-4 text-center">
                    <Link
                      to={`/admin/assets/courses/module/${course._id}`}
                      className="text-blue-400 hover:text-blue-600 transition duration-200"
                    >
                      {course.title}
                    </Link>
                  </td>
                  <td className="p-4 text-center">{course.price}</td>
                  <td className="p-4 text-center">
                    <span
                      className={
                        course.status === "active"
                          ? "bg-green-600 text-white px-4 py-1.5 rounded-full font-semibold"
                          : "bg-gray-600 text-gray-300 px-4 py-1.5 rounded-full font-semibold"
                      }
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="p-4 text-center relative">
                    <button
                      onClick={() => setOpenMenu(course._id)}
                      className="p-2 hover:bg-gray-600 rounded-full"
                    >
                      <HiOutlineDotsHorizontal />
                    </button>
                    {openMenu === course._id && (
                      <motion.div
                        ref={menuRef}
                        className="absolute right-0 mt-2 z-50 w-24 bg-gray-800 shadow-xl rounded-xl p-2"
                      >
                        <button
                          className="block w-full py-2 text-sm hover:bg-blue-700 rounded-md text-white"
                          onClick={() => handleShare(course._id)}
                        >
                          Share
                        </button>
                        <button
                          className="block w-full px-4 py-2 hover:bg-blue-700 rounded-md text-sm text-white"
                          onClick={() => handleEdit(course._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-red-500 hover:bg-red-700 hover:text-white rounded-md text-sm"
                          onClick={() => handleDelete(course._id)}
                        >
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
  
      <AnimatePresence />
      <AddCourseModel isOpen={modalOpen} onClose={() => setModalOpen(false)} onCourseAdded={handleCourseAdded} />
      <EditCourseModel isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} course={selectedCourse} onCourseUpdated={handleCourseUpdated} />
      <ShareLinkModal isOpen={openShareModal} onClose={handleShareClose} buyLink={buyLink} />
    </main>
  );
  
};

export default CourseTable;

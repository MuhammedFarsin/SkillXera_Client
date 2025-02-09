import { useEffect, useState, useRef } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import EmptyPage from "../../assets/Empty.jpg";
import Swal from "sweetalert2";
import axiosInstance from "../../Connection/Axios";
import { toast } from "sonner";
import AddCourseModel from "../PopUpMessage/AddCourseModel";
import EditCourseModel from "../PopUpMessage/EditCourseModel";

const CourseTable = () => {
  const menuRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchCourses();
  }, []);

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
    <main className="p-8 pt-24">
      <div className="flex justify-end mb-8 space-x-6">
        <input
          type="text"
          placeholder="Search by course title..."
          className="p-3 rounded-lg shadow-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-3 w-52 rounded-lg shadow-md bg-white border focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          className="bg-gradient-to-b from-[#1a1a1a] to-[#004d40] text-white px-6 py-3 rounded-lg transition duration-300"
          onClick={() => setModalOpen(true)}
        >
          Add Course
        </button>
      </div>
      <div className="relative overflow-visible rounded-lg shadow-lg">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-gradient-to-b from-gray-800 to-green-700 text-white">
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
                <tr key={course._id} className="hover:bg-gray-100">
                  <td className="p-4 text-center">{course.title}</td>
                  <td className="p-4 text-center">{course.price}</td>
                  <td className="p-4 text-center">
                    <span
                      className={
                        course.status === "active"
                          ? "bg-green-600 text-white px-3 py-1 rounded-full"
                          : "bg-gray-400 text-white px-3 py-1 rounded-full"
                      }
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="p-4 text-center relative">
                    <button
                      onClick={() => setOpenMenu(course._id)}
                      className="p-2 hover:bg-gray-200 rounded-full"
                    >
                      <HiOutlineDotsHorizontal />
                    </button>
                    {openMenu === course._id && (
                      <motion.div
                        ref={menuRef}
                        className="absolute right-0 mt-2 z-50 w-32 bg-white shadow-xl rounded-xl border p-2"
                      >
                        <button className="block w-full px-4 py-2 hover:bg-blue-50 rounded-md">
                          View
                        </button>
                        <button
                          className="block w-full px-4 py-2 hover:bg-blue-50 rounded-md"
                          onClick={() => handleEdit(course._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
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
      <AddCourseModel
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCourseAdded={handleCourseAdded}
      />
      <EditCourseModel
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        course={selectedCourse}
        onCourseUpdated={handleCourseUpdated}
      />
    </main>
  );
};

export default CourseTable;

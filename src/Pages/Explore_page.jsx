// ExplorePage.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Common/Navbar";
import axiosInstance from "../Connection/Axios";
import { Link } from "react-router-dom";
import Spinner from "./Common/spinner";
import { motion } from "framer-motion";

function ExplorePage() {
  const user = useSelector((state) => state.user);
  const userId = user?._id;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get(`/explore/${userId}`);
        if (response.status === 200 && response.data.courses) {
          setCourses(response.data.courses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchCourses();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Discover New Courses
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <motion.div
                key={course._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <img
                  src={`${BASE_URL}${course.images?.[0]}`}
                  alt={course.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="text-blue-600 font-bold text-lg mb-2">
                      ₹{course.regularPrice}
                    </p>
                    <Link to={`/course-buy-details/${userId}/${course._id}`}>
                      <button className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                        Buy Now
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center mt-20 bg-white p-8 rounded-xl shadow max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              You’ve explored everything!
            </h3>
            <p className="text-gray-600 mb-4">
              New courses are added frequently. Stay tuned or check back later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Refresh & Check Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ExplorePage;

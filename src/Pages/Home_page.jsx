import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Navbar from "./Common/Navbar";
import axiosInstance from "../Connection/Axios";
import { Link } from "react-router-dom";

function HomePage() {
  // const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const userId = user?._id;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };
  
    window.history.replaceState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);
  
    window.addEventListener("popstate", handleBackButton);
  
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);
  
  

  useEffect(() => {
    if (!userId) return;

    const fetchUserCourses = async () => {
      try {
        const response = await axiosInstance.get(`/user-orders/${userId}`);
        console.log(response.data);
        if (response.status === 200) {
          setCourses(response.data.courses);
        }
      } catch (error) {
        console.error("Error fetching user orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, [userId]);

  return (
    <div>
      <Navbar />
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Your Purchased Courses
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Fetching your courses...</p>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <motion.div 
                key={course._id}
                className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={`${BASE_URL}${course.images[0]}`}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  

                  <Link to={`/learn/${course._id}/module/${course.modules[0]._id}/lecture/0`}>
                    <motion.button 
                      className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Learning
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center text-gray-600 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-xl font-semibold">Looks like you haven&apos;t enrolled in any courses yet.</h3>
            <p className="mt-2">Start exploring and invest in your growth today! 🚀</p>
            <Link to="/explore">
              <motion.button 
                className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Courses
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default HomePage;

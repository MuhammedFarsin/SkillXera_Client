import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Common/Navbar";
import axiosInstance from "../Connection/Axios";
import { Link } from "react-router-dom";

function HomePage() {
  const user = useSelector((state) => state.user); // Ensure user is correctly stored in Redux
  const userId = user?._id; // Safely access user ID
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = axiosInstance.defaults.baseURL;
  useEffect(() => {
    if (!userId) return; // Prevent API call if userId is missing

    const fetchUserOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(`/user-orders/${userId}`);
        console.log(response.data);
        if (response.status === 200) {
          setCourse(response.data.course);
        }
      } catch (error) {
        console.error("Error fetching user orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrderDetails();
  }, [userId]);

  return (
    <div>
      <Navbar />
      <div className="p-10 ">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Your Purchased Course
        </h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : course ? (
          <div className="max-w-sm bg-white shadow-md rounded-lg overflow-hidden w-60">
            {/* Course Image */}
            <img
              src={`${BASE_URL}${course.images[0]}`}
              alt={course.title}
              className="w-full h-40 object-cover"
            />

            {/* Course Details */}
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <span className="block text-blue-600 font-bold mt-1">
                ₹{course.price}
              </span>

              {/* Start Learning Button */}
              <Link
                to={`/explore/${course._id}/module/${course.modules[0]._id}/lecture/0`}
              >
                <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                  Start Learning
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-center">No course purchased.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;

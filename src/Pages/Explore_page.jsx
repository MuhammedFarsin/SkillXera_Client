import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Common/Navbar";
import axiosInstance from "../Connection/Axios";
import { Link } from "react-router-dom";

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
        console.log("Courses Response:", response.data);
        
        if (response.status === 200 && response.data.courses) {
          setCourses(response.data.courses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-4 text-center">Courses</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="max-w-sm bg-white shadow-md rounded-lg overflow-hidden">
                <img
                  src={`${BASE_URL}${course.images[0]}`}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <span className="block text-blue-600 font-bold mt-1">
                    ₹{course.price}
                  </span>
                  <Link to={`/course-details/${userId}/${course._id}`}>
                    <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                      Buy Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-10">
            <h3 className="text-xl font-semibold text-gray-800">
              Oops! Looks like you&apos;ve already explored everything.
            </h3>
            <p className="text-gray-600 mt-2">
              We&apos;re always working on bringing you new and exciting courses. Stay tuned!
            </p>
           
            <button
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Refresh & Check Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExplorePage;

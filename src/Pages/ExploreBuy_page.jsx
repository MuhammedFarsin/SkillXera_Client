import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../Connection/Axios";
import Navbar from "./Common/Navbar";

function BuyCoursePage() {
  const { userId, courseId } = useParams();
  const navigate = useNavigate()
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/get-course-buy-details/${courseId}`
        );
        setCourse(response.data.course);
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [courseId]);

  if (loading)
    return (
      <div className="text-center mt-10 text-lg text-gray-300 dark:text-gray-400">
        Loading course details...
      </div>
    );
  if (!course)
    return (
      <div className="text-center text-red-500 dark:text-red-400 mt-10">
        Course not found
      </div>
    );

  return (
    <div className="max-w-1xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 dark:bg-gray-900 dark:text-white">
      <Navbar />
      {/* Left - Course Details */}
      <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-6 mt-10">
        <img
          src={`${BASE_URL}${course.images[0]}`}
          alt={course.title}
          className="w-full h-72 object-cover rounded-lg"
        />
        <h1 className="text-3xl font-bold mt-4">{course.title}</h1>
        <p className="text-gray-700 dark:text-gray-300 mt-2 text-lg">
          {course.description}
        </p>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: "70%" }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          70% of students completed this course
        </p>

        {/* Modules */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Course Modules</h2>
          {course.modules.length > 0 ? (
            <ul className="mt-3 space-y-4">
              {course.modules.map((module, index) => (
                <li
                  key={module._id ? module._id : `module-${index}`}
                  className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-700"
                >
                  <h3 className="text-lg font-semibold">
                    {index + 1}. {module.title}
                  </h3>
                  <ul className="list-disc ml-6 mt-2 text-gray-700 dark:text-gray-300">
                    {module.lectures.map((lecture, i) => (
                      <li
                        key={lecture._id ? lecture._id : `lecture-${i}`}
                        className="mt-1 flex items-center"
                      >
                        🎥 <strong className="ml-2">{lecture.title}</strong> (
                        {lecture.duration} min)
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No modules available</p>
          )}
        </div>
      </div>

      {/* Right - Checkout Section */}
      <div className="bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-6 h-fit sticky top-20">
        <img
          src={`${BASE_URL}${course.images[2]}`}
          alt={course.title}
          className="w-full h-72 object-cover rounded-lg"
        />

        <h2 className="text-2xl font-bold">₹{course.regularPrice}</h2>

        <button
          onClick={() => navigate(`/explore/checkout/${course._id}`)}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          🚀 Buy Now
        </button>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <p>✅ 30-Day Money-Back Guarantee</p>
          <p>✅ Full Lifetime Access</p>
          <p>✅ Certificate of Completion</p>
          <p>✅ Access on Mobile & Desktop</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="lg:col-span-3 bg-gray-200 dark:bg-gray-800 p-6 rounded-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          <details className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
            <summary className="cursor-pointer font-semibold">
              What if I don&apos;t like the course?
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              No worries! We offer a 30-day money-back guarantee.
            </p>
          </details>
          <details className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
            <summary className="cursor-pointer font-semibold">
              How long do I have access?
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              You get lifetime access to all course materials.
            </p>
          </details>
          <details className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
            <summary className="cursor-pointer font-semibold">
              Will I get a certificate?
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Yes! You will receive a certificate upon completion.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

export default BuyCoursePage;
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../Connection/Axios";
import Navbar from "./Common/Navbar";
import { IoMenu } from "react-icons/io5";

function Learning_page() {
  const BASE_URL = axiosInstance.defaults.baseURL;
  const { courseId, moduleId, lectureIndex } = useParams();
  const navigate = useNavigate();

  const [currentLectureIndex, setCurrentLectureIndex] = useState(parseInt(lectureIndex) || 0);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [moduleLectures, setModuleLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axiosInstance.get(`/learn/${courseId}`);
        console.log("Filtered Course Data:", response.data);

        if (response.status === 200 && response.data.modules.length > 0) {
          const modules = response.data.modules;
          const selectedModule = modules.find(m => m._id === moduleId) || modules[0];

          setModuleLectures(selectedModule.lectures || []);

          // Redirect to first module/lecture if none is provided
          if (!moduleId || !lectureIndex) {
            navigate(`/learn/${courseId}/module/${selectedModule._id}/lecture/0`);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
        setError("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, moduleId, navigate]);

  useEffect(() => {
    const index = parseInt(lectureIndex);
    if (!isNaN(index) && moduleLectures.length > 0 && index < moduleLectures.length) {
      setCurrentLecture(moduleLectures[index]);
      setCurrentLectureIndex(index);
    }
  }, [lectureIndex, moduleLectures]);

  const handleNext = () => {
    if (currentLectureIndex < moduleLectures.length - 1) {
      navigate(`/learn/${courseId}/module/${moduleId}/lectures/${currentLectureIndex + 1}`);
    }
  };

  const handlePrev = () => {
    if (currentLectureIndex > 0) {
      navigate(`/learn/${courseId}/module/${moduleId}/lectures/${currentLectureIndex - 1}`);
    }
  };

  if (loading) return <p className="text-center text-lg font-semibold">Loading lecture...</p>;
  if (error) return <p className="text-center text-red-600 font-semibold">Error: {error}</p>;

  return (
    <div className="relative">
      <Navbar className="fixed top-0 left-0 right-0 z-50 w-full" />

      <div className="flex flex-col h-screen bg-gray-100 pt-16">
        <div className="flex flex-grow">
          {/* Mobile Menu Toggle */}
          <button
            className="absolute left-4 top-20 p-2 text-white bg-gray-900 rounded-md md:hidden z-50"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <IoMenu size={24} />
          </button>

          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 w-3/4 sm:w-1/2 md:w-1/4 bg-white p-4 shadow-lg overflow-y-auto transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 md:relative md:translate-x-0`}
          >
            <h2 className="text-lg font-semibold mb-3">Lectures</h2>
            <ul>
              {moduleLectures.length > 0 ? (
                moduleLectures.map((lecture, index) => (
                  <li key={lecture._id} className="mb-2">
                    <Link
                      to={`/learn/${courseId}/module/${moduleId}/lectures/${index}`}
                      className={`block px-4 py-2 rounded-lg ${
                        currentLectureIndex === index ? "bg-blue-500 text-white" : "bg-gray-200"
                      } hover:bg-blue-600 transition`}
                    >
                      {lecture.title}
                    </Link>
                  </li>
                ))
              ) : (
                <p>No lectures available</p>
              )}
            </ul>
          </aside>

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-6 flex flex-col items-center">
            <div className="flex flex-col sm:flex-row justify-between w-full max-w-2xl mb-4">
              <button
                onClick={handlePrev}
                disabled={currentLectureIndex === 0}
                className={`w-full sm:w-auto px-6 py-2 font-semibold text-white rounded-lg transition-all duration-200 mb-2 sm:mb-0 ${
                  currentLectureIndex === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={currentLectureIndex === moduleLectures.length - 1}
                className={`w-full sm:w-auto px-6 py-2 font-semibold text-white rounded-lg transition-all duration-200 ${
                  currentLectureIndex === moduleLectures.length - 1 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Next
              </button>
            </div>

            {/* Lecture Title */}
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">{currentLecture?.title || "Untitled Lecture"}</h2>

            {/* Video */}
            <div className="flex justify-center w-full">
              {currentLecture?.videoUrl ? (
                <video
                  key={currentLecture.videoUrl}
                  controls
                  className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl shadow-lg rounded-lg"
                >
                  <source src={`${BASE_URL}${currentLecture.videoUrl}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="bg-gray-200 p-8 rounded-lg text-center">
                  <p>No video available for this lecture</p>
                </div>
              )}
            </div>

            {/* Lecture Description */}
            <div className="mt-6 bg-white p-4 shadow-md rounded-lg w-full max-w-xl text-center">
              <h3 className="text-lg font-semibold">Lecture Description</h3>
              <p className="text-gray-700">{currentLecture?.description || "No description available."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Learning_page;

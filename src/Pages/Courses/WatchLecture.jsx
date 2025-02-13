import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../Connection/Axios";
import Navbar from "../Common/AdminNavbar";

const WatchLecture = () => {
  const BASE_URL = axiosInstance.defaults.baseURL;
  const { courseId, moduleId, lectureIndex } = useParams();
  const navigate = useNavigate();
  
  const [currentLectureIndex, setCurrentLectureIndex] = useState(parseInt(lectureIndex));
  const [currentLecture, setCurrentLecture] = useState(null);
  const [moduleLectures, setModuleLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLectureData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/admin/assets/courses/watch-lecture/${courseId}/${moduleId}/${lectureIndex}`
        );

        if (!response.data || !Array.isArray(response.data.lectures) || response.data.lectures.length === 0) {
          throw new Error("No lectures found");
        }

        setModuleLectures(response.data.lectures);
        let validIndex = parseInt(response.data.currentIndex);
        if (isNaN(validIndex) || validIndex < 0 || validIndex >= response.data.lectures.length) {
          validIndex = 0;
        }

        setCurrentLectureIndex(validIndex);
        setCurrentLecture(response.data.lectures[validIndex]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLectureData();
  }, [courseId, moduleId, lectureIndex]);

  useEffect(() => {
    if (moduleLectures.length > 0 && currentLectureIndex >= 0 && currentLectureIndex < moduleLectures.length) {
      setCurrentLecture(moduleLectures[currentLectureIndex]);
    }
  }, [currentLectureIndex, moduleLectures]);

  const handleNext = () => {
    if (currentLectureIndex < moduleLectures.length - 1) {
      navigate(`/admin/assets/courses/watch-lecture/${courseId}/${moduleId}/${currentLectureIndex + 1}`);
    }
  };

  const handlePrev = () => {
    if (currentLectureIndex > 0) {
      navigate(`/admin/assets/courses/watch-lecture/${courseId}/${moduleId}/${currentLectureIndex - 1}`);
    }
  };

  if (loading) return <p className="text-center text-lg font-semibold">Loading lecture...</p>;
  if (error) return <p className="text-center text-red-600 font-semibold">Error: {error}</p>;

  return (
    <div className="relative">
      {/* Navbar */}
      <Navbar className="fixed top-0 left-0 right-0 z-50 w-full" />
  
      {/* Main Content (pushed down with padding-top) */}
      <div className="flex flex-col h-screen bg-gray-100 pt-16">
        
        <div className="flex flex-grow">
          {/* Sidebar for Lecture List */}
          <aside className="w-1/4 bg-white p-4 shadow-lg overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3">Lectures</h2>
            <ul>
              {moduleLectures.map((lecture, index) => (
                <Link
                  to={`/admin/assets/courses/watch-lecture/${courseId}/${moduleId}/${index}`}
                  key={index}
                  className={`block p-3 cursor-pointer rounded-md mb-2 transition-all duration-200 ${
                    index === currentLectureIndex
                      ? "bg-gradient-to-b from-[#1a1a1a] to-[#004d40] text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-black"
                  }`}
                >
                  {lecture.title}
                </Link>
              ))}
            </ul>
          </aside>
  
          {/* Main Video Section */}
          <div className="flex-1 p-6 flex flex-col items-center">
            {/* Navigation Buttons at the Top */}
            <div className="flex justify-between mb-4 w-3/4">
              <button
                onClick={handlePrev}
                disabled={currentLectureIndex === 0}
                className={`px-6 py-2 font-semibold text-white rounded-lg transition-all duration-200 ${
                  currentLectureIndex === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Previous
              </button>
  
              <button
                onClick={handleNext}
                disabled={currentLectureIndex === moduleLectures.length - 1}
                className={`px-6 py-2 font-semibold text-white rounded-lg transition-all duration-200 ${
                  currentLectureIndex === moduleLectures.length - 1 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Next
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-center">{currentLecture?.title}</h2>
  
            <div className="flex justify-center w-full">
              <video controls className="w-3/4 shadow-lg rounded-lg">
                <source src={`${BASE_URL}${currentLecture?.videoUrl}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
  
            {/* Lecture Description */}
            <div className="mt-6 bg-white p-4 shadow-md rounded-lg w-3/4 text-center">
              <h3 className="text-lg font-semibold">Lecture Description</h3>
              <p className="text-gray-700">{currentLecture?.description || "No description available."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchLecture;

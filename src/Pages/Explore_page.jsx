import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../Connection/Axios";
import Navbar from "./Common/Navbar";

function ExplorePage() {
  const BASE_URL = axiosInstance.defaults.baseURL;
  const { courseId, moduleId, lectureIndex } = useParams();
  const navigate = useNavigate();

  const [currentLectureIndex, setCurrentLectureIndex] = useState(
    parseInt(lectureIndex) || 0
  );
  const [currentLecture, setCurrentLecture] = useState(null);
  const [moduleLectures, setModuleLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(`/explore/${courseId}`);
        if (response.status === 200 && response.data.course) {
          const firstModule = response.data.course.modules?.[0];
          const firstLectureIndex = 0;

          if (!moduleId && firstModule) {
            navigate(
              `/course/${courseId}/module/${firstModule._id}/lecture/${firstLectureIndex}`
            );
          } else if (moduleId) {
            const selectedModule = response.data.course.modules.find(
              (m) => m._id === moduleId
            );
            setModuleLectures(selectedModule?.lectures || []);
          }
        }
      } catch (error) {
        setError("Failed to load data.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrderDetails();
  }, [courseId, moduleId]);

  useEffect(() => {
    const index = parseInt(lectureIndex);
    if (
      !isNaN(index) &&
      moduleLectures.length > 0 &&
      index < moduleLectures.length
    ) {
      setCurrentLecture(moduleLectures[index]);
      setCurrentLectureIndex(index);
    }
  }, [lectureIndex, moduleLectures]); // ✅ Add `lectureIndex` as a dependency

  const handleNext = () => {
    if (currentLectureIndex < moduleLectures.length - 1) {
      const nextIndex = currentLectureIndex + 1;
      navigate(`/explore/${courseId}/module/${moduleId}/lecture/${nextIndex}`);
    }
  };

  const handlePrev = () => {
    if (currentLectureIndex > 0) {
      const prevIndex = currentLectureIndex - 1;
      navigate(`/explore/${courseId}/module/${moduleId}/lecture/${prevIndex}`);
    }
  };

  if (loading)
    return (
      <p className="text-center text-lg font-semibold">Loading lecture...</p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 font-semibold">Error: {error}</p>
    );

  return (
    <div className="relative">
      {/* Navbar */}
      <Navbar className="fixed top-0 left-0 right-0 z-50 w-full" />

      {/* Main Content */}
      <div className="flex flex-col h-screen bg-gray-100 pt-16">
        <div className="flex flex-grow">
          {/* Sidebar for Lecture List */}
          <aside className="w-1/4 bg-white p-4 shadow-lg overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3">Lectures</h2>
            <ul>
              {moduleLectures.map((lecture, index) => (
                <Link
                  to={`/explore/${courseId}/module/${moduleId}/lecture/${index}`}
                  key={index}
                  onClick={() => setCurrentLectureIndex(index)}
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
            {/* Navigation Buttons */}
            <div className="flex justify-between mb-4 w-3/4">
              <button
                onClick={handlePrev}
                disabled={currentLectureIndex === 0}
                className={`px-6 py-2 font-semibold text-white rounded-lg transition-all duration-200 ${
                  currentLectureIndex === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={currentLectureIndex === moduleLectures.length - 1}
                className={`px-6 py-2 font-semibold text-white rounded-lg transition-all duration-200 ${
                  currentLectureIndex === moduleLectures.length - 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Next
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-center">
              {currentLecture?.title}
            </h2>
            {/* Video Player */}
            <div className="flex justify-center w-full">
              <video
                key={currentLecture?.videoUrl}
                controls
                className="w-3/4 shadow-lg rounded-lg"
              >
                <source
                  src={`${BASE_URL}${currentLecture?.videoUrl}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Lecture Description */}
            <div className="mt-6 bg-white p-4 shadow-md rounded-lg w-3/4 text-center">
              <h3 className="text-lg font-semibold">Lecture Description</h3>
              <p className="text-gray-700">
                {currentLecture?.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExplorePage;

import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "./Common/Navbar";
import { IoMenu } from "react-icons/io5";
import VideoEmbed from "../Utils/EmbeddedVideo";
import Spinner from "./Common/spinner";

function Learning_page() {
  const { moduleId, lectureIndex } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [currentLectureIndex, setCurrentLectureIndex] = useState(
    parseInt(lectureIndex) || 0
  );
  const [currentLecture, setCurrentLecture] = useState(null);
  const [moduleLectures, setModuleLectures] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const courseData = state?.courseData;
  const purchaseDate = state?.purchaseDate;

  useEffect(() => {
    if (!courseData) {
      // Handle invalid entry (e.g., user accessed directly without state)
      navigate("/");
      return;
    }

    const selectedModule =
      courseData.modules.find((m) => m._id === moduleId) || courseData.modules[0];

    setModuleLectures(selectedModule.lectures || []);

    if (!moduleId || !lectureIndex) {
      navigate(
        `/learn/${courseData._id}/module/${selectedModule._id}/lectures/0`,
        { state }
      );
      return;
    }
  }, [courseData, moduleId, lectureIndex, navigate]);

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
  }, [lectureIndex, moduleLectures]);

  const handleNext = () => {
    if (currentLectureIndex < moduleLectures.length - 1) {
      navigate(
        `/learn/${courseData._id}/module/${moduleId}/lectures/${
          currentLectureIndex + 1
        }`,
        { state }
      );
    }
  };

  const handlePrev = () => {
    if (currentLectureIndex > 0) {
      navigate(
        `/learn/${courseData._id}/module/${moduleId}/lectures/${
          currentLectureIndex - 1
        }`,
        { state }
      );
    }
  };

  if (!courseData || !courseData.modules) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    );
  }

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
                  <li key={lecture._id || index} className="mb-2">
                    <Link
                      to={`/learn/${courseData._id}/module/${moduleId}/lectures/${index}`}
                      state={state}
                      className={`block px-4 py-2 rounded-lg ${
                        currentLectureIndex === index
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      } hover:bg-blue-600 transition`}
                    >
                      {lecture.title || `Lecture ${index + 1}`}
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
                className={`w-full sm:w-auto px-6 py-2 font-semibold text-white rounded-lg transition-all duration-200 ${
                  currentLectureIndex === moduleLectures.length - 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Next
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
              {currentLecture?.title || "Untitled Lecture"}
            </h2>

            {/* Video */}
            <div className="flex justify-center w-full">
              {currentLecture?.contentType === "embed" ? (
                <VideoEmbed embedCode={currentLecture.embedCode} />
              ) : currentLecture?.videoUrl ? (
                <video controls className="w-3/4 shadow-lg rounded-lg">
                  <source
                    src={currentLecture.videoUrl}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>No video available</p>
              )}
            </div>

            {/* Description */}
            <div className="mt-6 bg-white p-4 shadow-md rounded-lg w-full max-w-xl text-center">
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

export default Learning_page;

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axiosInstance from "../../../Connection/Axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

// eslint-disable-next-line react/prop-types
function EditLectureModel({isOpen, onClose, moduleId, lectureId, onLectureUpdated,}) {
  const BASE_URL = axiosInstance.defaults.baseURL;
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null); // For new uploads
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch lecture details when modal opens (for editing)
  useEffect(() => {
    if (isOpen && lectureId) {
      setTitle("");
      setDescription("");
      setDuration("");
      setVideoUrl("");
      setVideo(null);
      const fetchLectureDetails = async () => {
        try {
          const response = await axiosInstance.get(
            `/admin/assets/courses/get-lecture/${courseId}/${moduleId}/${lectureId}`
          );
          if (response.status === 200) {
            console.log(response.data);
            const { title, description, duration, videoUrl } = response.data;

            setTitle(title);
            setDescription(description);
            setDuration(duration);
            setVideoUrl(videoUrl);
          }
        } catch (error) {
          toast.error("Failed to fetch lecture details");
          console.error("Error fetching lecture details:", error);
        }
      };
      fetchLectureDetails();
    }
  }, [courseId, isOpen, lectureId, moduleId]);
  console.log('this si the ',videoUrl)
  const fullVideoUrl = videoUrl.startsWith("http")
    ? videoUrl
    : `${BASE_URL}${videoUrl}`;

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log("📂 File Selected:", selectedFile);
      setVideo(selectedFile);
      setVideoUrl(""); // ✅ Clear video URL since a new file is chosen
    }
  };
  // Handle form submission (Update Lecture)
  console.log('this is the file ',fullVideoUrl);
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsUploading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("duration", Number(duration) || 0);

    if (video) {
      formData.append("video", video);
    }
    console.log('this is the uploading file',video)
 
    try {
      const response = await axiosInstance.put(
        `/admin/assets/courses/edit-lecture/${courseId}/${moduleId}/${lectureId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        onLectureUpdated({
          ...response.data.lecture,
          moduleId: response.data.moduleId,
        }); // Update UI
        toast.success("Lecture updated successfully!");
        onClose();
      } else {
        toast.error("Failed to update lecture");
      }
    } catch (error) {
      console.error("🚨 Update Error:", error);
      toast.error("An error occurred while updating the lecture");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 rounded-lg shadow-lg w-3/4 max-w-2xl max-h-[80vh] overflow-y-auto p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center overflow-y-auto ">
          <h2 className="text-lg text-white font-semibold">Edit Lecture</h2>
          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded-md bg-gray-800 text-white"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-800 text-white"
          />
          {/* Video Preview */}
          {(videoUrl || video) && (
            <video controls className="w-full rounded-md">
              <source
                src={video ? URL.createObjectURL(video) : fullVideoUrl}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Show selected file name */}
          {video && (
            <p className="text-sm text-gray-500 mt-2">
              Selected File: {video.name}
            </p>
          )}
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md bg-gray-800 text-white"
          />
          <input
            type="number"
            placeholder="Duration (in minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-800 text-white"
          />

          {isUploading && (
            <div className="w-full h-2 bg-gray-200 rounded-md">
              <motion.div
                className="h-full bg-blue-600 rounded-md"
                initial={{ width: "0%" }}
                animate={{ width: `${uploadProgress}%` }}
              ></motion.div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md disabled:opacity-50"
            disabled={isUploading}
          >
            {isUploading ? "Updating..." : "Update Lecture"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default EditLectureModel;

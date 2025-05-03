import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import axiosInstance from "../../../Connection/Axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

// eslint-disable-next-line react/prop-types
function AddLectureModal({ isOpen, onClose, moduleId, onLectureAdded }) {
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setVideo] = useState(null);
  const [duration, setDuration] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const [contentType, setContentType] = useState("file"); // 'file' or 'embed'

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("📂 File Selected:", file);
    setVideo(file);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setVideo(null);
    setDuration("");
    setUploadProgress(0);
    setIsUploading(false);
    setEmbedCode("");
    setContentType("file");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contentType === "file" && !file) {
      toast.error("Please select a video file");
      return;
    }

    if (contentType === "embed" && !embedCode.trim()) {
      toast.error("Please provide an embed code");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    if (contentType === "file") {
      formData.append("video", file);
    } else {
      formData.append("embedCode", embedCode.trim());
    }
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("duration", Number(duration) || 0);
    formData.append("contentType", contentType);

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const response = await axiosInstance.post(
        `/admin/assets/courses/add-lecture/${courseId}/${moduleId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: contentType === "file" ? (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          } : undefined,
        }
      );

      if (response.status === 201) {
        onLectureAdded(moduleId, response.data.lecture);
        resetForm();
        toast.success("Lecture added successfully!");
        onClose();
      } else {
        toast.error("Failed to add lecture");
      }
    } catch (error) {
      console.error("🚨 Upload Error:", error);
      toast.error(error.response?.data?.message || "Failed to add lecture");
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
        className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Add Lecture</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700"
          >
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

          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${contentType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => setContentType('file')}
            >
              Upload Video
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${contentType === 'embed' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => setContentType('embed')}
            >
              Embed Video
            </button>
          </div>

          {contentType === "file" ? (
            <>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
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
            </>
          ) : (
            <textarea
              placeholder="Paste your embed code here (e.g., YouTube iframe)"
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-800 text-white h-24"
            />
          )}

          <input
            type="number"
            placeholder="Duration (in minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-800 text-white"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Add Lecture"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AddLectureModal;
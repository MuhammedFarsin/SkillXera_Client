import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axiosInstance from "../../../Connection/Axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

// eslint-disable-next-line react/prop-types
function EditLectureModel({ isOpen, onClose, moduleId, lectureId, onLectureUpdated }) {
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setVideo] = useState(null);
  const [duration, setDuration] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const [contentType, setContentType] = useState();
  const [existingVideoUrl, setExistingVideoUrl] = useState("");

  useEffect(() => {
    const fetchLectureDetails = async () => {
      try {
        const res = await axiosInstance.get(
          `/admin/assets/courses/get-lecture/${courseId}/${moduleId}/${lectureId}`
        );
        if (res.status === 200) {
          const { title, description, duration, videoUrl, embedCode, contentType } = res.data;
          setTitle(title);
          setDescription(description);
          setDuration(duration);
          setContentType(contentType || "file");
          
          if (contentType === "file") {
            setExistingVideoUrl(videoUrl);
          } else {
            setEmbedCode(embedCode || "");
          }
        }
      } catch (err) {
        toast.error("Failed to fetch lecture details");
        console.error(err);
      }
    };

    if (isOpen && lectureId) {
      fetchLectureDetails();
    }
  }, [isOpen, courseId, moduleId, lectureId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("📂 File Selected:", file);
    setVideo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contentType === "file" && !file && !existingVideoUrl) {
      toast.error("Please select a video file");
      return;
    }

    if (contentType === "embed" && !embedCode.trim()) {
      toast.error("Please provide an embed code");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    if (contentType === "file" && file) {
      formData.append("video", file);
    } else if (contentType === "embed") {
      formData.append("embedCode", embedCode.trim());
    }
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("duration", Number(duration) || 0);
    formData.append("contentType", contentType);

    try {
      const response = await axiosInstance.put(
        `/admin/assets/courses/edit-lecture/${courseId}/${moduleId}/${lectureId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: contentType === "file" && file ? (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          } : undefined,
        }
      );

      if (response.status === 200) {
        onLectureUpdated(moduleId, response.data.lecture);
        toast.success("Lecture updated successfully!");
        onClose();
      } else {
        toast.error("Failed to update lecture");
      }
    } catch (error) {
      console.error("🚨 Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update lecture");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Edit Lecture</h2>
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
              {existingVideoUrl ? "Change Video" : "Upload Video"}
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
              {existingVideoUrl && !file && (
                <div className="mt-2">
                  <p className="text-sm text-gray-400 mb-1">Current Video:</p>
                  <video controls className="w-full rounded-md">
                    <source src={`${axiosInstance.defaults.baseURL}${existingVideoUrl}`} />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {isUploading && file && (
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
            <>
              <textarea
                placeholder="Paste your embed code here (e.g., YouTube iframe)"
                value={embedCode}
                onChange={(e) => setEmbedCode(e.target.value)}
                className="w-full p-2 border rounded-md bg-gray-800 text-white h-24"
              />
              {embedCode && (
                <div 
                  className="mt-2"
                  dangerouslySetInnerHTML={{ __html: embedCode }}
                />
              )}
            </>
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
            {isUploading ? "Updating..." : "Update Lecture"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default EditLectureModel;
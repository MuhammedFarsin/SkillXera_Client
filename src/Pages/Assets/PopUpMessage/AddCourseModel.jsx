import { useState, useRef } from "react";
import { FaCopy } from "react-icons/fa";
import { toast } from "sonner";
import axiosInstance from "../../../Connection/Axios";
import { motion } from "framer-motion";

// eslint-disable-next-line react/prop-types
const AddCourseModal = ({ isOpen, onClose, onCourseAdded }) => {
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [courseName, setCourseName] = useState("");
  const [courseRoute, setCourseRoute] = useState("");
  const [buyingCourseRoute, setBuyingCourseRoute] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null); // ✅ State for video
  const [videoPreview, setVideoPreview] = useState(null); 
  const [loading, setLoading] = useState(false);


  // Function to reset form fields
  const resetForm = () => {
    setCourseName("");
    setCourseRoute("");
    setBuyingCourseRoute("");
    setPrice("");
    setDescription("");
    setImages([]);
    setImagePreviews([]);
    setVideo(null);
    setVideoPreview(null);
  };
  if (fileInputRef.current) fileInputRef.current.value = "";
  if (videoInputRef.current) videoInputRef.current.value = "";

  // Handle file change for images
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length !== 3) {
      toast.error("Please upload exactly 3 images.");
      return;
    }
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a valid video file.");
      return;
    }

    setVideo(file);
    setVideoPreview(URL.createObjectURL(file)); // Generate preview
  };

  // Submit course to API
  const handleSubmit = async () => {
    if (!courseName || !courseRoute || !buyingCourseRoute || !price || !description) {
      toast.error("All fields are required!");
      return;
    }
    if (images.length !== 3) {
      toast.error("Please upload exactly 3 images.");
      return;
    }
    if (!video) {
      toast.error("Please upload a video.");
      return;
    }
    if (isNaN(price) || Number(price) <= 0) {
      toast.error("Please enter a valid price!");
      return;
    }

    setLoading(true);
    const fullCourseRoute = `${axiosInstance.defaults.baseURL}/course/${courseRoute}`;
    const fullBuyingCourseRoute = `${axiosInstance.defaults.baseURL}/sale/buy-course/course/${buyingCourseRoute}`;

    const formData = new FormData();
    formData.append("title", courseName);
    formData.append("route", fullCourseRoute);
    formData.append("buyCourse", fullBuyingCourseRoute);
    formData.append("price", price);
    formData.append("description", description);
    images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("video", video); // ✅ Add video to form data
    console.log("Video Type:", typeof video); // Should be 'object'
console.log("Video Instance:", video instanceof File); // Should be true

    // for(let [key,values] of formData) {
    //   console.log(key, values)
    // }

    try {
      const response = await axiosInstance.post(
        "/admin/assets/add-course",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        onCourseAdded(response.data.course);
        toast.success("Course added successfully!");
        resetForm();
        onClose();
      } else {
        toast.error("Failed to add course!");
      }
    } catch (error) {
      toast.error("Error adding course!");
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };


  // Handle copying the link
  const handleCopyLink = () => {
    const fullLink = `${axiosInstance.defaults.baseURL}/course/${courseRoute}`;
    navigator.clipboard.writeText(fullLink);
    toast.success("Link copied!");
  };
  const handleBuyCourseCopyLink = () => {
    const fullLink = `${axiosInstance.defaults.baseURL}/sale/buy-course/course/${buyingCourseRoute}`;
    navigator.clipboard.writeText(fullLink);
    toast.success("Link copied!");
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            Add New Course
          </h2>

          {/* Course Name */}
          <label className="block font-medium text-gray-700">Course Name</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Enter course name"
          />

          {/* Course Route */}
          <label className="block font-medium text-gray-700">
            Course Route
          </label>
          <div className="flex items-center border p-2 rounded-md mb-4">
            <span className="mr-2 text-gray-700">/course/</span>
            <input
              type="text"
              value={courseRoute}
              onChange={(e) => setCourseRoute(e.target.value)}
              className="flex-grow p-2 border rounded-md"
              placeholder="Enter route"
            />
            <button
              onClick={handleCopyLink}
              className="ml-2 bg-blue-500 text-white p-2 rounded-md"
            >
              <FaCopy />
            </button>
          </div>
          <label className="block font-medium text-gray-700">Buying Course Route</label>
          <div className="flex items-center border p-2 rounded-md mb-4">
            <span className="mr-2 text-gray-700">/sale/buy-course/course/</span>
            <input type="text" value={buyingCourseRoute} onChange={(e) => setBuyingCourseRoute(e.target.value)} className="flex-grow p-2 border rounded-md" placeholder="Enter buying route" />
            <button onClick={handleBuyCourseCopyLink} className="ml-2 bg-blue-500 text-white p-2 rounded-md">
              <FaCopy />
            </button>
          </div>

          {/* Description */}
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Enter course description"
          />

          {/* Price */}
          <label className="block font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Enter price"
            min="0"
          />


          {/* video upload */}
          <label className="block font-medium text-gray-700">Upload Video</label>
          <input
            type="file"
            ref={videoInputRef}
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full p-2 border rounded-md mb-4"
          />

          {/* Video Preview */}
          {videoPreview && (
            <div className="mb-4">
              <video controls src={videoPreview} className="w-full rounded-md" />
            </div>
          )}

          {/* Image Upload */}
          <label className="block font-medium text-gray-700">
            Upload Images (3 required)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md mb-4"
          />

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mb-4">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="bg-red-500 text-white p-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-b from-[#1a1a1a] to-[#57c2b0] text-white p-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Course"}
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
};

export default AddCourseModal;

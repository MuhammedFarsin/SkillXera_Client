import { useState, useEffect } from "react";
import { FaCopy } from "react-icons/fa";
import { toast } from "sonner";
import axiosInstance from "../../Connection/Axios";
import { motion } from "framer-motion";

// eslint-disable-next-line react/prop-types
const EditCourseModal = ({ isOpen, onClose, course, onCourseUpdated }) => {
  const [courseName, setCourseName] = useState("");
  const [courseRoute, setCourseRoute] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    if (isOpen && course) {
      const fetchCourseDetails = async () => {
        try {
          const response = await axiosInstance.get(
            `/admin/assets/edit-course/${course}`
          );
          if (response.status === 200) {
            const { title, route, price, description, images } = response.data;
            setCourseName(title);
            setCourseRoute(route?.replace(`${baseURL}/course/`, "") || "");
            setPrice(price);
            setDescription(description);

            const existingImagePaths = images.map((img) => `${img}`);
            setImagePreviews(
              existingImagePaths.map((img) => `${baseURL}${img}`)
            );
            setImages(existingImagePaths);
          }
        } catch (error) {
          toast.error("Failed to fetch course details");
          console.error("Error fetching course details:", error);
        }
      };
      fetchCourseDetails();
    }
  }, [isOpen, course, baseURL]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + imagePreviews.length > 3) {
      toast.error("You can upload up to 3 images only.");
      return;
    }

    setImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!courseName || !courseRoute || !price || !description) {
      toast.error("All fields are required!");
      return;
    }
    if (imagePreviews.length !== 3) {
      toast.error("Please upload exactly 3 images.");
      return;
    }
    if (isNaN(price) || Number(price) <= 0) {
      toast.error("Please enter a valid price!");
      return;
    }

    setLoading(true);
    const fullRoute = `${baseURL}/course/${courseRoute}`;

    const formData = new FormData();
    formData.append("title", courseName);
    formData.append("route", fullRoute);
    formData.append("price", price);
    formData.append("description", description);

    const existingImages = images.filter((img) => typeof img === "string");
    const newImages = images.filter((img) => img instanceof File);

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    formData.append("existingImages", JSON.stringify(existingImages));

    try {
      const response = await axiosInstance.put(
        `/admin/assets/update-course/${course}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Course updated successfully!");
        onCourseUpdated(response.data.course);
        onClose();
      } else {
        toast.error("Failed to update course!");
      }
    } catch (error) {
      toast.error("Error updating course!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const fullLink = `${baseURL}/course/${courseRoute}`;
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
            Edit Course
          </h2>

          <label className="block font-medium text-gray-700">Course Name</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />

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
            />
            <button
              onClick={handleCopyLink}
              className="ml-2 bg-blue-500 text-white p-2 rounded-md"
            >
              <FaCopy />
            </button>
          </div>

          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />

          <label className="block font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
            min="0"
          />

          <label className="block font-medium text-gray-700">
            Upload Images (3 required)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md mb-4"
          />
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}

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
              {loading ? "Updating..." : "Update Course"}
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
};

export default EditCourseModal;

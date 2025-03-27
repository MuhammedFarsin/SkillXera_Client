import { useState, useRef } from "react";
import { FaCopy } from "react-icons/fa";
import { toast } from "sonner";
import axiosInstance from "../../../Connection/Axios";
import { frontendRoute } from "../../../Utils/utils";
import { useNavigate } from "react-router-dom";
import ToastHot from "../../Common/ToasterHot"

const AddCoursePage = () => {
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState("");
  const [courseRoute, setCourseRoute] = useState("");
  const [buyingCourseRoute, setBuyingCourseRoute] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [salesPrice, setSalesPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to reset form fields
  const resetForm = () => {
    setCourseName("");
    setCourseRoute("");
    setBuyingCourseRoute("");
    setRegularPrice("");
    setSalesPrice("");
    setDescription("");
    setImages([]);
    setImagePreviews([]);
  };
  if (fileInputRef.current) fileInputRef.current.value = "";
  if (videoInputRef.current) videoInputRef.current.value = "";

  // Handle file change for images
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 3) {
      toast.error("Please upload exactly 3 images.");
      return;
    }
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async () => {
    if (
      !courseName ||
      !courseRoute ||
      !buyingCourseRoute ||
      !regularPrice ||
      !salesPrice ||
      !description
    ) {
      toast.error("All fields are required!");
      return;
    }
    if (images.length < 3) {
      toast.error("Please upload minimum 3 images.");
      return;
    }
    if (isNaN(regularPrice) || Number(regularPrice) <= 0) {
      toast.error("Please enter a valid price!");
      return;
    }
    if (isNaN(salesPrice) || Number(salesPrice) <= 0) {
      toast.error("Please enter a valid price!");
      return;
    }

    setLoading(true);
    const fullCourseRoute = `${frontendRoute}/course/${courseRoute}`;
    const fullBuyingCourseRoute = `${frontendRoute}/sale/buy-course/course/${buyingCourseRoute}`;

    const formData = new FormData();
    formData.append("title", courseName);
    formData.append("route", fullCourseRoute);
    formData.append("buyCourse", fullBuyingCourseRoute);
    formData.append("regularPrice", regularPrice);
    formData.append("salesPrice", salesPrice);
    formData.append("description", description);
    images.forEach((image) => {
      formData.append("images", image);
    });

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
        toast.success("Course added successfully!");
        setTimeout(() => {
          navigate("/admin/assets/courses");
          resetForm();
        }, 2000);
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
    const fullLink = `${frontendRoute}/course/${courseRoute}`;
    navigator.clipboard.writeText(fullLink);
    toast.success("Link copied!");
  };
  const handleBuyCourseCopyLink = () => {
    const fullLink = `${frontendRoute}/sale/buy-course/course/${buyingCourseRoute}`;
    navigator.clipboard.writeText(fullLink);
    toast.success("Link copied!");
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-8xl overflow-hidden max-h-screen">
      <h2 className="text-2xl font-semibold text-white text-center mb-6">
        Add New Course
      </h2>

      {/* Parent Flex Container */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side - Course Details */}
        <div className="md:w-1/2 space-y-4">
          {/* Course Name */}
          <label className="block font-medium text-gray-300">Course Name</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:ring focus:ring-teal-500"
            placeholder="Enter course name"
          />

          {/* Course Route */}
          <label className="block font-medium text-gray-300">
            Course Route
          </label>
          <div className="w-full flex items-center border border-gray-700 p-2 rounded-md bg-gray-800">
            <span className="mr-2 text-gray-400">/course/</span>
            <input
              type="text"
              value={courseRoute}
              onChange={(e) => setCourseRoute(e.target.value)}
              className="flex-grow bg-gray-700 text-white outline-none rounded-md"
              placeholder="Enter route"
            />
            <button
              onClick={handleCopyLink}
              className="ml-2 bg-teal-500 p-2 rounded-md hover:bg-teal-600"
            >
              <FaCopy className="text-white" />
            </button>
          </div>

          {/* Buying Course Route */}
          <label className="block font-medium text-gray-300">
            Buying Course Route
          </label>
          <div className="w-full flex items-center border border-gray-700 p-2 rounded-md bg-gray-800">
            <span className="mr-2 text-gray-400">/sale/buy-course/course/</span>
            <input
              type="text"
              value={buyingCourseRoute}
              onChange={(e) => setBuyingCourseRoute(e.target.value)}
              className="flex-grow bg-gray-700 text-white outline-none rounded-md"
              placeholder="Enter buying route"
            />
            <button
              onClick={handleBuyCourseCopyLink}
              className="ml-2 bg-teal-500 p-2 rounded-md hover:bg-teal-600"
            >
              <FaCopy className="text-white" />
            </button>
          </div>

          {/* Description */}
          <label className="block font-medium text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-52 p-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:ring focus:ring-teal-500"
            placeholder="Enter course description"
          />
        </div>

        {/* Right Side - Pricing & Uploads */}
        <div className="md:w-1/2 space-y-4">
          {/* Regular Price */}
          <label className="block font-medium text-gray-300">
            Regular Price
          </label>
          <input
            type="number"
            value={regularPrice}
            onChange={(e) => setRegularPrice(e.target.value)}
            className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:ring focus:ring-teal-500"
            placeholder="Enter price"
            min="0"
          />

          {/* Sales Price */}
          <label className="block font-medium text-gray-300">Sales Price</label>
          <input
            type="number"
            value={salesPrice}
            onChange={(e) => setSalesPrice(e.target.value)}
            className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:ring focus:ring-teal-500"
            placeholder="Enter price"
            min="0"
          />

          {/* Image Upload */}
          <label className="block font-medium text-gray-300">
            Upload Images (3 required)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:ring focus:ring-teal-500"
          />
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mt-2">
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
          <div className="flex justify-end mt-4 space-x-3">
            <button
              onClick={() => navigate("/admin/assets/courses")}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-b from-gray-800 to-teal-500 text-white px-4 py-2 rounded-md hover:from-gray-700 hover:to-teal-600"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Course"}
            </button>
          </div>
        </div>
      </div>
          <ToastHot/>
    </div>
  );
};

export default AddCoursePage;

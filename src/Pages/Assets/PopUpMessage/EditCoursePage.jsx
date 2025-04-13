import { useState, useEffect } from "react";
import { FaCopy } from "react-icons/fa";
import { toast } from "sonner";
import axiosInstance from "../../../Connection/Axios";
import { frontendRoute } from "../../../Utils/utils";
import { useNavigate, useParams } from "react-router-dom";
import ToasterHot from "../../Common/ToasterHot";

const EditCoursePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courseName, setCourseName] = useState("");
  const [courseRoute, setCourseRoute] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [salesPrice, setSalesPrice] = useState("");
  const [buyCourse, setBuyCourse] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/assets/edit-course/${courseId}`
        );
        if (response.status === 200) {
          const {
            title,
            route,
            buyCourse,
            regularPrice,
            salesPrice,
            description,
            images,
          } = response.data;
          setCourseName(title);
          setCourseRoute(route?.replace(`${frontendRoute}/course/`, "") || "");
          setRegularPrice(regularPrice);
          setSalesPrice(salesPrice);
          setDescription(description);
          setBuyCourse(
            buyCourse.replace(`${frontendRoute}/sale/sales-page/course/`, "") ||
              ""
          );
          console.log(response.data);
          const existingImagePaths = images.map((img) => `${img}`);
          setImagePreviews(existingImagePaths.map((img) => `${baseURL}${img}`));
          setImages(existingImagePaths);
        }
      } catch (error) {
        toast.error("Failed to fetch course details");
        console.error("Error fetching course details:", error);
      }
    };
    fetchCourseDetails();
  }, [courseId, baseURL]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
  
    // Define max image count
    const maxImages = 10;
  
    // Prevent exceeding the limit
    if (files.length + imagePreviews.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images.`);
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
    if (
      !courseName ||
      !courseRoute ||
      !regularPrice ||
      !salesPrice ||
      !description
    ) {
      toast.error("All fields are required!");
      return;
    }
    if (imagePreviews.length < 3) {
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
    const fullRoute = `${frontendRoute}/course/${courseRoute}`;
    const buyCourseLink = `${frontendRoute}/sale/sales-page/course/${buyCourse}`;

    const formData = new FormData();
    formData.append("title", courseName);
    formData.append("route", fullRoute);
    formData.append("regularPrice", regularPrice);
    formData.append("salesPrice", salesPrice);
    formData.append("description", description);
    formData.append("buyCourse", buyCourseLink);

    const existingImages = (images || []).filter(
      (img) => typeof img === "string"
    );

    const newImages = images.filter((img) => img instanceof File);

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    formData.append("existingImages", JSON.stringify(existingImages));

    try {
      const response = await axiosInstance.put(
        `/admin/assets/update-course/${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Course updated successfully!");
        setTimeout(() => {
          navigate("/admin/assets/courses");
        }, 2000);
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
    const fullLink = `${frontendRoute}/course/${courseRoute}`;
    navigator.clipboard.writeText(fullLink);
    toast.success("Link copied!");
  };
  const handleBuyCourseCopyLink = () => {
    const fullLink = `${frontendRoute}/sale/sales-page/course/${buyCourse}`;
    navigator.clipboard.writeText(fullLink);
    toast.success("Link copied!");
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-8xl overflow-hidden max-h-screen">
      <h2 className="text-2xl font-semibold text-white text-center mb-6">
        Add New Course
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 space-y-4">
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
              value={buyCourse}
              onChange={(e) => setBuyCourse(e.target.value)}
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
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:ring focus:ring-teal-500"
          />
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mt-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1"
                  >
                    ✕
                  </button>
                </div>
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
              {loading ? "updating..." : "Update Course"}
            </button>
          </div>
        </div>
      </div>
      <ToasterHot />
    </div>
  );
};

export default EditCoursePage;

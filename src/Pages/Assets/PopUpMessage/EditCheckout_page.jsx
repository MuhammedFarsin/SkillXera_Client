import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../Connection/Axios";
import TiptapEditor from "../../../Utils/TiptapEditor";
import { toast } from "sonner";
import ToasterHot from "../../Common/ToasterHot";
import LoadingSpinner from "../../Common/Spinner";

function EditCheckout_page() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [topHeading, setTopHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [checkoutImage, setCheckoutImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [lines, setLines] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const checkoutRes = await axiosInstance.get(
          `/admin/assets/get-checkout-page/${type}/${id}`
        );
        
        const { 
          topHeading, 
          subHeading, 
          checkoutImage, 
          lines, 
        } = checkoutRes.data.data;

        setTopHeading(topHeading);
        setSubHeading(subHeading);
        setExistingImage(checkoutImage);
        setLines(lines || [""]);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load checkout page data");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, id, navigate]);

  const handleLineChange = (index, value) => {
    const updatedLines = [...lines];
    updatedLines[index] = value;
    setLines(updatedLines);
  };

  const addNewLine = () => {
    setLines([...lines, ""]);
  };

  const removeLine = (index) => {
    if (lines.length > 1) {
      const updatedLines = lines.filter((_, i) => i !== index);
      setLines(updatedLines);
    } else {
      toast.warning("At least one content line is required");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCheckoutImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!topHeading.trim() || !subHeading.trim()) {
        toast.error("Top heading and sub heading are required");
      }

      const validLines = lines.filter((line) => line.trim() !== "");
      if (validLines.length === 0) {
        toast.error("At least one content line is required");
      }

      const formData = new FormData();
      formData.append("topHeading", topHeading);
      formData.append("subHeading", subHeading);
      formData.append("existingImage", existingImage); 
      // Only append new image if one was selected
      if (checkoutImage) {
        formData.append("checkoutImage", checkoutImage);
      }
      
      validLines.forEach((line) => {
        formData.append("lines[]", line);
      });

      const response = await axiosInstance.put(
        `/admin/assets/update-checkout-page/${type}/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(response.data.message);
      setTimeout(() => {
        navigate(
          type === "digital-product"
            ? "/admin/assets/files"
            : "/admin/assets/courses"
        );
      }, 1500);
    } catch (error) {
      console.error("Form submission failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(", ") ||
        error.message ||
        "Failed to update checkout page";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">
          Edit Checkout Page for {type}: {id}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Heading */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Top Heading <span className="text-red-400">*</span>
            </label>
            <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-700">
              <TiptapEditor
                value={topHeading}
                onChange={setTopHeading}
                placeholder="Enter the main heading for your checkout page..."
                darkMode={true}
              />
            </div>
          </div>

          {/* Subheading */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Subheading <span className="text-red-400">*</span>
            </label>
            <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-700">
              <TiptapEditor
                value={subHeading}
                onChange={setSubHeading}
                placeholder="Enter a subheading that will appear above the image..."
                darkMode={true}
              />
            </div>
          </div>

          {/* Checkout Image */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Checkout Image
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="w-full p-2 rounded border border-gray-600 text-gray-300 hover:border-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-indigo-600 file:text-white hover:file:bg-indigo-700">
                  {checkoutImage ? "Change Image" : "Upload New Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </label>
              {(previewImage || existingImage) && (
                <div className="flex-shrink-0">
                  <p className="text-xs text-gray-400 mb-1">Preview:</p>
                  <img
                    src={previewImage || `${axiosInstance.defaults.baseURL}/uploads/${existingImage}`}
                    alt="Preview"
                    className="w-16 h-16 object-cover border border-gray-600 rounded"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Content Lines */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Content Lines <span className="text-red-400">*</span>
            </label>
            <div className="space-y-4">
              {lines.map((line, index) => (
                <div
                  key={index}
                  className="border border-gray-600 rounded-lg overflow-hidden bg-gray-700"
                >
                  <div className="flex justify-between items-center bg-gray-750 px-3 py-2 border-b border-gray-600">
                    <span className="text-sm font-medium text-gray-300">
                      Line {index + 1}
                    </span>
                    {lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLine(index)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <TiptapEditor
                    value={line}
                    onChange={(value) => handleLineChange(index, value)}
                    placeholder={`Enter content for line ${index + 1}...`}
                    darkMode={true}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addNewLine}
                className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add another line
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center transition-colors"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Checkout Page"
              )}
            </button>
          </div>
        </form>
        <ToasterHot />
      </div>
    </div>
  );
}

export default EditCheckout_page;
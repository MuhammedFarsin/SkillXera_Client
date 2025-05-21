import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../Connection/Axios";
import TiptapEditor from "../../../Utils/TiptapEditor";
import { toast } from "sonner";
import ToasterHot from "../../Common/ToasterHot";

function AddCheckout_page() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [topHeading, setTopHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [checkoutImage, setCheckoutImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [lines, setLines] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderBumps, setOrderBumps] = useState([]);
  const [selectedOrderBump, setSelectedOrderBump] = useState("");
  const [thankYouPages, setThankYouPages] = useState([]);
  const [selectedThankYouPage, setSelectedThankYouPage] = useState("");
  const [targetProduct, setTargetProduct] = useState(null);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        // Fetch target product details
        const productResponse = await axiosInstance.get(
          type === 'course' 
            ? `/admin/assets/get-course/${id}`
            : `/admin/assets/file/get-digital-product/${id}`
        );
        setTargetProduct(productResponse.data);

        // Fetch order bumps available for this product
        const bumpsRes = await axiosInstance.get(
          `/admin/assets/order-bumps?targetProduct=${id}&targetProductModel=${type === 'course' ? 'Course' : 'DigitalProduct'}`
        );

        console.log(bumpsRes)
        
        // Fetch thank you pages
        const pagesRes = await axiosInstance.get("/admin/assets/thank-you-pages");
        
        setOrderBumps(bumpsRes.data.data || []);
        setThankYouPages(pagesRes.data.data || []);
      } catch (error) {
        console.error("Error fetching additional data:", error);
        toast.error("Failed to load additional data");
      }
    };

    fetchAdditionalData();
  }, [type, id]);

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
      if (!topHeading.trim() || !subHeading.trim() || !checkoutImage) {
        throw new Error("Top heading, sub heading, and image are required");
      }

      const validLines = lines.filter((line) => line.trim() !== "");
      if (validLines.length === 0) {
        throw new Error("At least one content line is required");
      }

      if (!type || !id) {
        throw new Error("Invalid product type or ID");
      }

      const formData = new FormData();
      formData.append("topHeading", topHeading);
      formData.append("subHeading", subHeading);
      formData.append("checkoutImage", checkoutImage);
      validLines.forEach((line) => {
        formData.append("lines[]", line);
      });

      // Include product details
      if (targetProduct) {
        formData.append("productName", targetProduct.title || targetProduct.name);
        formData.append("productPrice", 
          targetProduct.salesPrice || targetProduct.salePrice || 0);
      }

      // Include order bump if selected
      if (selectedOrderBump) {
        formData.append("orderBump", selectedOrderBump);
      }

      // Include thank you page if selected
      if (selectedThankYouPage) {
        formData.append("thankYouPage", selectedThankYouPage);
      }

      const response = await axiosInstance.post(
        `/admin/assets/create-checkout-page/${type}/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(response.data.message);
      setTimeout(() => {
        navigate(
          type === "course"
            ? "/admin/assets/courses"
            : "/admin/assets/files"
        );
      }, 1500);
    } catch (error) {
      console.error("Form submission failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(", ") ||
        error.message ||
        "Failed to create checkout page";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">
          Create Checkout Page for {type === 'course' ? 'Course' : 'Digital Product'}: {targetProduct?.title || targetProduct?.name || id}
        </h2>

        {targetProduct && (
          <div className="mb-6 p-4 bg-gray-750 rounded-lg border border-gray-700">
            <h3 className="font-medium text-lg mb-2">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Name:</p>
                <p className="text-white">{targetProduct.title || targetProduct.name}</p>
              </div>
              <div>
                <p className="text-gray-400">Price:</p>
                <p className="text-white">
                  ${targetProduct.salesPrice || targetProduct.salePrice || 0}
                </p>
              </div>
            </div>
          </div>
        )}

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
              Checkout Image <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="w-full p-2 rounded border border-gray-600 text-gray-300 hover:border-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-indigo-600 file:text-white hover:file:bg-indigo-700">
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required
                  />
                </div>
              </label>
              {previewImage && (
                <div className="flex-shrink-0">
                  <p className="text-xs text-gray-400 mb-1">Preview:</p>
                  <img
                    src={previewImage}
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

          {/* Order Bumps Section */}
          {orderBumps.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Available Order Bumps</h3>
              <div className="space-y-4">
                {orderBumps.map((bump) => (
                  <div
                    key={bump._id}
                    className={`p-4 rounded-lg border ${
                      selectedOrderBump === bump._id
                        ? "border-indigo-500 bg-gray-750"
                        : "border-gray-700 bg-gray-800"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{bump.displayName}</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {bump.description}
                        </p>
                        <p className="text-indigo-400 mt-2">
                          +${bump.bumpPrice}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedOrderBump(
                            selectedOrderBump === bump._id ? "" : bump._id
                          )
                        }
                        className={`px-4 py-2 rounded-md text-sm ${
                          selectedOrderBump === bump._id
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        {selectedOrderBump === bump._id
                          ? "Selected"
                          : "Select"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thank You Page Selection */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Thank You Page (Optional)
            </label>
            <select
              value={selectedThankYouPage}
              onChange={(e) => setSelectedThankYouPage(e.target.value)}
              className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a thank you page</option>
              {thankYouPages.map((page) => (
                <option key={page._id} value={page._id}>
                  {page.title}
                </option>
              ))}
            </select>
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
                  Creating...
                </>
              ) : (
                "Create Checkout Page"
              )}
            </button>
          </div>
        </form>
        <ToasterHot />
      </div>
    </div>
  );
}

export default AddCheckout_page;
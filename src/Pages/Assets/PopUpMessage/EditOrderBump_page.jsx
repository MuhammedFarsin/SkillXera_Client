import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../Connection/Axios";
import { toast } from "sonner";
import AdminNavbar from "../../Common/AdminNavbar";
import ToasterHot from "../../Common/ToasterHot";

function EditOrderBump_page() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [digitalProducts, setDigitalProducts] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    displayName: "",
    description: "",
    bumpPrice: "",
    targetProduct: "",
    targetProductModel: "Course",
    bumpProduct: "",
    isActive: true,
    minCartValue: "",
    previewImage: "",
    image: null,
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bumpRes, coursesRes, digitalRes] = await Promise.all([
          axiosInstance.get(`/admin/assets/get-edit-order-bumps/${id}`),
          axiosInstance.get("/admin/assets/get-courses"),
          axiosInstance.get("/admin/assets/file/get-digital-products"),
        ]);

        const bump = bumpRes.data.data;

        setFormData({
          displayName: bump.displayName,
          description: bump.description,
          bumpPrice: bump.bumpPrice,
          targetProduct: bump.targetProduct._id,
          targetProductModel: bump.targetProductModel,
          bumpProduct: bump.bumpProduct._id,
          isActive: bump.isActive,
          minCartValue: bump.minCartValue,
          previewImage: bump.image || "",
        });

        setCourses(coursesRes.data);
        setDigitalProducts(digitalRes.data.products);
        setIsLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load data");
        navigate("/admin/order-bumps");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, previewImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append("displayName", formData.displayName);
      formPayload.append("description", formData.description);
      formPayload.append("bumpPrice", formData.bumpPrice);
      formPayload.append("targetProduct", formData.targetProduct);
      formPayload.append("targetProductModel", formData.targetProductModel);
      formPayload.append("bumpProduct", formData.bumpProduct);
      formPayload.append("isActive", formData.isActive);
      formPayload.append("minCartValue", formData.minCartValue || 0);
      if (formData.image) {
        formPayload.append("images", formData.image);
      }

      const response = await axiosInstance.put(
        `/admin/assets/update-order-bump/${id}`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/admin/assets/order-bumps");
        }, 1000);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update order bump"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <AdminNavbar />
        <div className="max-w-4xl mx-auto mt-20 text-center">
          Loading order bump data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <AdminNavbar />

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          <h1 className="text-2xl font-bold mb-6">Edit Order Bump</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Target Product Type *
                </label>
                <select
                  name="targetProductModel"
                  value={formData.targetProductModel}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="Course">Course</option>
                  <option value="DigitalProduct">Digital Product</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Target Product *
                </label>
                <select
                  name="targetProduct"
                  value={formData.targetProduct}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select a product</option>
                  {formData.targetProductModel === "Course"
                    ? courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title} (${course.salesPrice})
                        </option>
                      ))
                    : digitalProducts.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name} (${product.salePrice})
                        </option>
                      ))}
                </select>
              </div>
            </div>

            {/* Bump Product */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Bump Product (Digital Product) *
              </label>
              <select
                name="bumpProduct"
                value={formData.bumpProduct}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a digital product</option>
                {digitalProducts.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} (Current price: ${product.salePrice})
                  </option>
                ))}
              </select>
            </div>

            {/* Bump Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Display Name *
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Bump Price *
                </label>
                <input
                  type="number"
                  name="bumpPrice"
                  value={formData.bumpPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Bump Image */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Bump Image
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="w-full p-2 rounded border border-gray-600 text-gray-300 hover:border-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-indigo-600 file:text-white hover:file:bg-indigo-700">
                    {formData.previewImage ? "Change Image" : "Choose Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </label>
                {formData.previewImage && (
                  <div className="flex-shrink-0">
                    <p className="text-xs text-gray-400 mb-1">Preview:</p>
                    <img
                      src={formData.previewImage}
                      alt="Bump preview"
                      className="w-16 h-16 object-cover border border-gray-600 rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
              />
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Minimum Cart Value
                </label>
                <input
                  type="number"
                  name="minCartValue"
                  value={formData.minCartValue}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-300"
                >
                  Active (Show in checkout)
                </label>
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
                  "Update Order Bump"
                )}
              </button>
            </div>
          </form>
        </div>
        <ToasterHot/>
      </div>
    </div>
  );
}

export default EditOrderBump_page;

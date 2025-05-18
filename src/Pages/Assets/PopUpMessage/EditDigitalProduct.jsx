import { useState, useEffect } from "react";
import axiosInstance from "../../../Connection/Axios";
import { toast } from "sonner";
import { FiUpload, FiLink } from "react-icons/fi";
import ToasterHot from "../../Common/ToasterHot";
import { useNavigate, useParams } from "react-router-dom";

function EditDigitalProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    regularPrice: "",
    salePrice: "",
    category: "",
    fileUrl: "",
    externalUrl: "",
    contentType: "file",
    status: "active",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/admin/assets/file/get-edit-digital-product/${id}`);
        const productData = response.data;
        
        setProduct({
          name: productData.name,
          description: productData.description,
          regularPrice: productData.regularPrice,
          salePrice: productData.salePrice || "",
          category: productData.category,
          fileUrl: productData.fileUrl || "",
          externalUrl: productData.externalUrl || "",
          contentType: productData.fileUrl ? "file" : "link",
          status: productData.status,
        });

        if (productData.fileUrl && productData.fileUrl.match(/\.(jpeg|jpg|gif|png)$/)) {
          setPreview(productData.fileUrl);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product data");
        navigate("/admin/assets/files");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }

      setProduct((prev) => ({
        ...prev,
        fileUrl: file,
        contentType: "file",
      }));
    }
  };

  const validateForm = () => {
    if (!product.name.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (
      !product.regularPrice ||
      isNaN(product.regularPrice) ||
      parseFloat(product.regularPrice) <= 0
    ) {
      toast.error("Please enter a valid regular price");
      return false;
    }

    if (
      product.salePrice &&
      parseFloat(product.salePrice) >= parseFloat(product.regularPrice)
    ) {
      toast.error("Sale price must be less than regular price");
      return false;
    }

    if (!product.category) {
      toast.error("Category is required");
      return false;
    }

    if (product.contentType === "file" && !product.fileUrl) {
      toast.error("Please upload a file");
      return false;
    }

    if (product.contentType === "link" && !product.externalUrl) {
      toast.error("Please enter a valid URL");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    try {
      const formData = new FormData();
      
      // Append all fields
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('regularPrice', product.regularPrice);
      formData.append('salePrice', product.salePrice || '');
      formData.append('category', product.category);
      formData.append('status', product.status);
      formData.append('contentType', product.contentType);
  
      // Handle file or URL
      if (product.contentType === 'file' && typeof product.fileUrl !== 'string') {
        formData.append('file', product.fileUrl);
      } else if (product.contentType === 'link') {
        formData.append('externalUrl', product.externalUrl);
      }
  
      const response = await axiosInstance.put(
        `/admin/assets/file/update-digital-product/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/admin/assets/files");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading product data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Edit Digital Product
          </h2>
          <p className="mt-3 text-xl text-gray-300">
            Update the details of your digital product
          </p>
        </div>

        <div className="bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                required
                placeholder="e.g., Premium Photoshop Template"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={product.description}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Detailed description of your product..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Regular Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Regular Price ($) *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">$</span>
                  </div>
                  <input
                    type="number"
                    name="regularPrice"
                    value={product.regularPrice}
                    onChange={handleChange}
                    className="block w-full pl-7 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Sale Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Sale Price ($)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">$</span>
                  </div>
                  <input
                    type="number"
                    name="salePrice"
                    value={product.salePrice}
                    onChange={handleChange}
                    className="block w-full pl-7 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Category *
              </label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a category</option>
                <option value="templates">Templates</option>
                <option value="ebooks">E-books</option>
                <option value="software">Software</option>
                <option value="music">Music</option>
                <option value="art">Digital Art</option>
                <option value="courses">Courses</option>
              </select>
            </div>

            {/* Content Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content Type *
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() =>
                    setProduct((p) => ({ ...p, contentType: "file" }))
                  }
                  className={`flex items-center px-4 py-2 rounded-md ${
                    product.contentType === "file"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  <FiUpload className="mr-2" />
                  File Upload
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setProduct((p) => ({ ...p, contentType: "link" }))
                  }
                  className={`flex items-center px-4 py-2 rounded-md ${
                    product.contentType === "link"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  <FiLink className="mr-2" />
                  External Link
                </button>
              </div>
            </div>

            {/* File Upload or Link Input */}
            {product.contentType === "file" ? (
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Digital File *
                </label>
                <div className="mt-1 flex items-center">
                  <label className="flex flex-col items-center px-4 py-6 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600 cursor-pointer hover:bg-gray-600">
                    <FiUpload className="w-10 h-10 text-indigo-400" />
                    <span className="mt-2 text-sm text-gray-300">
                      {typeof product.fileUrl === 'string' 
                        ? product.fileUrl.split('/').pop() 
                        : product.fileUrl?.name || "Click to upload file"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      required={product.contentType === "file" && !product.fileUrl}
                    />
                  </label>
                  {preview && (
                    <div className="ml-4">
                      <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-600">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  External URL *
                </label>
                <input
                  type="url"
                  name="externalUrl"
                  value={product.externalUrl}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://example.com/product"
                  required={product.contentType === "link"}
                />
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Status
              </label>
              <select
                name="status"
                value={product.status}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToasterHot />
    </div>
  );
}

export default EditDigitalProduct;
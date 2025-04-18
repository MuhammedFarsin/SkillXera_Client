import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TiptapEditor from "../../../Utils/TiptapEditor";
import axiosInstance from "../../../Connection/Axios";
import { toast } from "sonner";
import ToastHot from "../../Common/ToasterHot"

function EditSalesPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mainImage: null,
    mainImagePreview: "",
    bonusImages: [],
    bonusImagePreviews: [],
    lines: [],
    ctaText: "",
    ctaHighlight: "",
    embedCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const baseURL = axiosInstance.defaults.baseURL;

  // Fetch sales page data on mount
  useEffect(() => {
    const fetchSalesPageDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/assets/course/get-sales-page/${courseId}`
        );
  
        if (response.status === 200) {
          const data = response.data;
  
          setFormData({
            mainImage: null,
            mainImagePreview: data.mainImage ? `${baseURL}/uploads/${data.mainImage}` : "",
            bonusImages: [],
            bonusImagePreviews: data.bonusImages
              ? data.bonusImages.map((img) => `${baseURL}/uploads/${img}`)
              : [],
            lines: data.lines || ["", "", "", ""],
            ctaText: data.ctaText || "",
            ctaHighlight: data.ctaHighlight || "",
            embedCode: data.embedCode || "",
          });

          
        }
      } catch (error) {
        console.error("Failed to fetch sales page details:", error);
        toast.error("Failed to load sales page data");
      }
    };
  
    fetchSalesPageDetails();
  }, [courseId, baseURL]);
  

  const handleLineChange = (index, value) => {
    const updatedLines = [...formData.lines];
    updatedLines[index] = value;
    setFormData((prev) => ({
      ...prev,
      lines: updatedLines,
    }));
  };

  const addNewLine = () => {
    setFormData((prev) => ({
      ...prev,
      lines: [...prev.lines, ""],
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        mainImage: file,
        mainImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleBonusImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      bonusImages: files,
      bonusImagePreviews: previews,
    }));
  };

  const handleEmbedCodeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      embedCode: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = new FormData();

      if (formData.mainImage) {
        submissionData.append("mainImage", formData.mainImage);
      }

      formData.bonusImages.forEach((file) => {
        submissionData.append("bonusImages", file);
      });

      formData.lines.forEach((line, i) => {
        submissionData.append(`lines[${i}]`, line);
      });

      submissionData.append("ctaText", formData.ctaText);
      submissionData.append("ctaHighlight", formData.ctaHighlight);
      submissionData.append("embedCode", formData.embedCode);

      const response = await axiosInstance.put(
        `/admin/assets/course/update-sales-page/${courseId}`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Sales page updated successfully.");
          setTimeout(() => {
            navigate("/admin/assets/courses")
          }, 2000);
        setIsUpdated(true);
      } else {
        toast.error("Failed to update sales page.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred during update.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Sales Page</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-gray-300 mb-2">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="text-white"
          />
          {formData.mainImagePreview && (
            <img
              src={formData.mainImagePreview}
              alt="Main Preview"
              className="mt-4 rounded-md max-w-xs border border-gray-700"
            />
          )}
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Bonus Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleBonusImagesChange}
            className="text-white"
          />
          {formData.bonusImagePreviews.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {formData.bonusImagePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Bonus ${idx + 1}`}
                  className="w-32 h-32 object-cover rounded-md border border-gray-700"
                />
              ))}
            </div>
          )}
        </div>

        {formData.lines.map((line, index) => (
          <div key={index}>
            <label className="block text-gray-300 mb-2">Line {index + 1}</label>
            <TiptapEditor
              value={line}
              onChange={(value) => handleLineChange(index, value)}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addNewLine}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
        >
          + Add Line
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-gray-300">CTA Text</span>
            <input
              type="text"
              value={formData.ctaText}
              onChange={(e) =>
                setFormData({ ...formData, ctaText: e.target.value })
              }
              className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </label>
          <label className="block">
            <span className="text-gray-300">CTA Highlight</span>
            <input
              type="text"
              value={formData.ctaHighlight}
              onChange={(e) =>
                setFormData({ ...formData, ctaHighlight: e.target.value })
              }
              className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </label>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Embed Code</label>
          <textarea
            value={formData.embedCode}
            onChange={handleEmbedCodeChange}
            rows="4"
            className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            placeholder="Paste the embed code here"
          />
        </div>

        <div className="flex gap-4">
          {!isUpdated ? (
            <>
              <button
                type="submit"
                className="bg-gradient-to-b from-gray-800 to-teal-500 text-white px-4 py-2 rounded-md hover:from-gray-700 hover:to-teal-600"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Sales Page"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </form>
      <ToastHot/>
    </div>
  );
}

export default EditSalesPage;

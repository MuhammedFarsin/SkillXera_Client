import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TiptapEditor from "../../../Utils/TiptapEditor";
import axiosInstance from "../../../Connection/Axios";
import { toast } from "sonner";

function AddSales_page() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mainImage: null,
    bonusImages: [],
    lines: ["", "", "", ""],
    ctaText: "",
    ctaHighlight: "",
    embedCode: "", // New field for the embed code
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      }));
    }
  };

  const handleBonusImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      bonusImages: files,
    }));
  };

  const handleEmbedCodeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      embedCode: e.target.value, // Update embed code in state
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.mainImage) {
      toast.error("Main image is required");
      return;
    }

    try {
      const submissionData = new FormData();
      submissionData.append("mainImage", formData.mainImage);

      formData.bonusImages.forEach((file) => {
        submissionData.append("bonusImages", file);
      });

      formData.lines.forEach((line, i) => {
        submissionData.append(`lines[${i}]`, line);
      });

      submissionData.append("ctaText", formData.ctaText);
      submissionData.append("ctaHighlight", formData.ctaHighlight);
      submissionData.append("embedCode", formData.embedCode);

      // Log the FormData for debugging
      for (let pair of submissionData.entries()) {
        console.log(pair[0], pair[1]);
      }
      const response = await axiosInstance.post(
        `/admin/create-sales-page/${courseId}`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Sales page added successfully...");
        setTimeout(() => {
          setIsSubmitted(true);
        }, 500); // Delay the state change slightly
      } else {
        console.warn("SalesPage ID not returned in response.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to add sales page.");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate(`/admin/assets/course/add-checkoutPage/${courseId}`);
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Create Sales Page</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-gray-300 mb-2">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="text-white"
          />
          {formData.mainImage && (
            <img
              src={URL.createObjectURL(formData.mainImage)}
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
          {formData.bonusImages.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {formData.bonusImages.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
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
          {!isSubmitted ? (
            <>
              <button
                type="submit"
                className="bg-gradient-to-b from-gray-800 to-teal-500 text-white px-4 py-2 rounded-md hover:from-gray-700 hover:to-teal-600"
                disabled={loading}
              >
                {loading ? "Processing..." : "Add Sales Page"}
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
            <>
              <button
                type="button"
                onClick={handleNavigate}
                className="bg-gradient-to-b from-gray-800 to-teal-500 text-white px-4 py-2 rounded-md hover:from-gray-700 hover:to-teal-600"
              >
                Go to Checkout Page
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Back to Dashboard
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddSales_page;

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../Connection/Axios";
import TiptapEditor from "../../../Utils/TiptapEditor";
import { toast } from "sonner";
import ToasterHot from "../../Common/ToasterHot"

function AddCheckout_page() {
  const { courseId } = useParams();
  const navigate = useNavigate()
  const [topHeading, setTopHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [checkoutImage, setCheckoutImage] = useState(null);
  const [lines, setLines] = useState([""]);

  const handleLineChange = (index, value) => {
    const updatedLines = [...lines];
    updatedLines[index] = value;
    setLines(updatedLines);
  };

  const addNewLine = () => {
    setLines([...lines, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("topHeading", topHeading);
      formData.append("subHeading", subHeading);
      formData.append("checkoutImage", checkoutImage);
      lines.forEach((line) => {
        formData.append("lines[]", line);
      });

      const response = await axiosInstance.post(
        `/admin/assets/course/create-checkout-page/${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response)
      toast.success("Checkout Page Added Successfully...")
      setTimeout(() => {
        navigate("/admin/assets/courses")
      }, 2000);
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Add Checkout Page</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Top Heading */}
          <div>
            <label className="block mb-2 text-sm font-medium">Top Heading</label>
            <div className="bg-gray text-white rounded overflow-hidden">
              <TiptapEditor value={topHeading} onChange={setTopHeading} />
            </div>
          </div>

          {/* Subheading */}
          <div>
            <label className="block mb-2 text-sm font-medium">Subheading Above Image</label>
            <div className="bg-gray text-white rounded overflow-hidden">
              <TiptapEditor value={subHeading} onChange={setSubHeading} />
            </div>
          </div>

          {/* Checkout Image */}
          <div>
            <label className="block mb-2 text-sm font-medium">Checkout Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCheckoutImage(e.target.files[0])}
              className="w-full p-2 rounded bg-gray-900 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-purple-600 file:text-white hover:file:bg-purple-700"
              required
            />
          </div>

          {/* Dynamic Rich Text Lines */}
          <div>
            <label className="block mb-2 text-sm font-medium">Add Some Lines</label>
            {lines.map((line, index) => (
              <div key={index} className="mb-4 bg-gray text-white rounded overflow-hidden">
                <TiptapEditor
                  value={line}
                  onChange={(value) => handleLineChange(index, value)}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addNewLine}
              className="mt-2 text-sm text-purple-400 hover:underline"
            >
              + Add another line
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
        <ToasterHot/>
      </div>
    </div>
  );
}

export default AddCheckout_page;

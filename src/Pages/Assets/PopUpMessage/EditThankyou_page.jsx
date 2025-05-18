import { toast } from "sonner";
import ToasterHot from "../../Common/ToasterHot";
import axiosInstance from "../../../Connection/Axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditThankyou_page() {
  const navigate = useNavigate();
  const { type, id } = useParams();

  const [formData, setFormData] = useState({
    kind: type,
    item: id || "",
    title: "",
    embedCode: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchThankYouPage() {
      setFetching(true);
      try {
        const response = await axiosInstance.get(
          `/admin/assets/get-edit-thankyou-page/${type}/${id}`
        );
        if (response.status === 200 && response.data.success) {
          const { title, embedCode, note } = response.data.data;
          setFormData({
            kind: type,
            item: id,
            title: title || "",
            embedCode: embedCode || "",
            note: note || "",
          });
        } else {
          toast.error(response.data.message || "Failed to fetch Thank You Page");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Error fetching Thank You Page");
      } finally {
        setFetching(false);
      }
    }

    if (type && id) {
      fetchThankYouPage();
    }
  }, [type, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      linkedTo: {
        kind: formData.kind,
        item: formData.item,
      },
      title: formData.title,
      embedCode: formData.embedCode,
      note: formData.note,
    };

    try {
      // Use PUT or PATCH method for update (adjust if your backend uses POST for update)
      const response = await axiosInstance.put(
        `/admin/assets/update-thankyou-page/${type}/${id}`,
        payload
      );

      if (response.status === 200 && response.data.success) {
        toast.success("Thank You Page updated successfully!");
        setTimeout(() => {
          navigate("/admin/assets/files");
        }, 1500);
      } else {
        toast.error(response.data.message || "Failed to update Thank You Page");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        Loading Thank You Page data...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Thank You Page</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Linked To (Kind)</label>
            <input
              type="text"
              name="kind"
              value={formData.kind}
              readOnly
              className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Item ID</label>
            <input
              type="text"
              name="item"
              value={formData.item}
              readOnly
              className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Embed Code</label>
            <textarea
              name="embedCode"
              value={formData.embedCode}
              onChange={handleChange}
              required
              className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded"
              rows="4"
              placeholder="<iframe>...</iframe>"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Note (optional)</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded"
              rows="2"
              placeholder="Add note or description (optional)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white px-4 py-2 rounded ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Saving..." : "Update Thank You Page"}
          </button>
        </form>
        <ToasterHot />
      </div>
    </div>
  );
}

export default EditThankyou_page;

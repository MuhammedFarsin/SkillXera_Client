import { useState, useEffect } from "react";
import axiosInstance from "../../../Connection/Axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { X } from "lucide-react";

// eslint-disable-next-line react/prop-types
function EditContactModal({ isOpen, onClose, onContactEdited, contactId }) {
    console.log(contactId)
    const [formData, setFormData] = useState({
      username: "",
      email: "",
      phone: "",
      tags: null, // Set null initially to avoid inconsistencies
    });
    

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing contact details when modal opens
  useEffect(() => {
    if (!contactId) return; // Avoid unnecessary API calls
  
    const fetchContact = async () => {
      try {
        const response = await axiosInstance.get(`/admin/crm/contact/get-contact/${contactId}`);
        setFormData({
          username: response.data.username || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          tags: response.data.tags?.length ? response.data.tags[0] : "",
        });
      } catch (error) {
        console.error("Error fetching contact:", error);
        toast.error("Failed to fetch contact details.");
      }
    };
  
    fetchContact();
  }, [contactId]);
  

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axiosInstance.get("/admin/crm/tag/get-tags");
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast.error("Failed to fetch tags");
      }
    };

    fetchTags();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagChange = (e) => {
    setFormData({ ...formData, tags: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.put(
        `/admin/crm/contact/update-contact/${contactId}`,
        {
          ...formData,
          tags: formData.tags ? (Array.isArray(formData.tags) ? formData.tags : [formData.tags]) : [],
          // Ensure tags are sent as an array
        }
      );

      toast.success("Contact updated successfully!");
      onContactEdited(response.data.contact);
      onClose();
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 w-[500px] md:w-[600px] max-h-[80vh] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Edit Contact
        </h2>

        {/* Scrollable Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[65vh] overflow-y-auto px-1"
        >
          <div>
            <label className="block text-gray-700 font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Phone</label>
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Tag Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Select Tag
            </label>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <label
                    key={tag._id}
                    className={`px-3 py-2 rounded-lg cursor-pointer border ${
                      formData.tags === tag._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tags"
                      value={tag._id}
                      checked={Array.isArray(formData.tags) ? formData.tags.includes(tag._id) : formData.tags === tag._id}
                      onChange={handleTagChange}
                      className="hidden"
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Loading tags...</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Contact"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default EditContactModal;

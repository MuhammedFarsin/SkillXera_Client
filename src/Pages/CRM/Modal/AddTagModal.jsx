import { useState } from "react";
import { toast } from "sonner";
import axiosInstance from "../../../Connection/Axios";
import { motion } from "framer-motion";

// eslint-disable-next-line react/prop-types
function AddTagModal({ isOpen, onClose, onTagAdded }) {
  const [tagName, setTagName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tagName.trim()) {
      toast.error("Tag name cannot be empty");
      return;
    }
    setLoading(true);

    try {
      const response = await axiosInstance.post("/admin/crm/tag/add-tag", {
        name: tagName,
      });

      if (response.status === 201) {
        toast.success("Tag added successfully!");
        onTagAdded(response.data);
        setTagName(""); 
        onClose();
      } else {
        toast.error("Failed to add tag. Try again.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            Add New Tag
          </h2>

          <label className="block font-medium text-gray-700">Tag Name</label>
          <input
            type="text"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter tag name" // ✅ Fixed placeholder
            disabled={loading} // ✅ Disable input when loading
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Tag"}
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
}

export default AddTagModal;

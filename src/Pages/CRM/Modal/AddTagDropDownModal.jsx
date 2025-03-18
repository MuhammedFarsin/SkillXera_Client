import { useState, useEffect } from "react";
import { toast } from "sonner";
import axiosInstance from "../../../Connection/Axios";
import { motion } from "framer-motion";
import { ChevronDown, PlusCircle } from "lucide-react";

// eslint-disable-next-line react/prop-types
function AddTagDropDownModal({ isOpen, onClose, onTagDropDownAdded, selectedContactId }) {
  const [tagName, setTagName] = useState("");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen) fetchTags();
  }, [isOpen]);

  const fetchTags = async () => {
    try {
      const response = await axiosInstance.get("/admin/crm/tag/get-tags");
      setTags(response.data);
      setFilteredTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleSubmit = async () => {
    if (!tagName.trim()) {
      toast.error("Tag name cannot be empty");
      return;
    }
    setLoading(true);

    try {
      const response = await axiosInstance.post("/admin/crm/contact/set-tag", {
        contactId: selectedContactId,
        tagName,
      });

      if (response.status === 200) {
        toast.success("Tag attached successfully!");
        onTagDropDownAdded(selectedContactId, response.data.tag);
        setSelectedTag(response.data.tag);
        setIsDropdownOpen(false);
        setTagName("");
        onClose();
      } else if (response.status === 400) {
        toast.error(response.data.message);
      } else {
        toast.error("Failed to attach tag. Try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setTagName(tag.name);
    setIsDropdownOpen(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setTagName(value);
    setFilteredTags(tags.filter((tag) => tag.name.toLowerCase().includes(value.toLowerCase())));
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 dark:bg-gray-900 dark:bg-opacity-75">
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-200">Select or Add Tag</h2>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-2 border rounded-md flex justify-between items-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none"
            >
              {selectedTag ? selectedTag.name : "Select a tag..."}
              <ChevronDown size={18} />
            </button>

            {isDropdownOpen && (
              <motion.div
                className="absolute w-full mt-2 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-2 max-h-40 overflow-y-auto border dark:border-gray-600"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <input
                  type="text"
                  placeholder="Search or add tag..."
                  value={tagName}
                  onChange={handleSearch}
                  className="w-full px-3 py-2 border rounded-md mb-2 focus:outline-none dark:bg-gray-600 dark:text-gray-200"
                />
                {filteredTags.length > 0 ? (
                  filteredTags.map((tag) => (
                    <div
                      key={tag._id}
                      className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer rounded-md"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag.name}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">No tags found</p>
                )}
              </motion.div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition w-full disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add New Tag"}
            <PlusCircle size={18} />
          </button>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
}

export default AddTagDropDownModal;

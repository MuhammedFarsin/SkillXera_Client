import { useState, useEffect } from "react";
import { toast } from "sonner";
import axiosInstance from "../../../Connection/Axios";
import { motion } from "framer-motion";
import { ChevronDown, PlusCircle } from "lucide-react";

// eslint-disable-next-line react/prop-types
function RemovTagContactModal({ isOpen, onClose, onTagDropDownRemove, selectedContactId }) {
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
    if (!selectedTag) {
      toast.error("Please select a tag to remove");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.delete("/admin/crm/contact/remove-tag", {
        data: { contactId: selectedContactId, tagId: selectedTag._id },
      });

      if (response.status === 200) {
        toast.success("Tag removed successfully!");
        onTagDropDownRemove(selectedTag);
        setSelectedTag(null);
        setIsDropdownOpen(false);
        onClose();
      } else {
        toast.error("Failed to remove tag. Try again.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 dark:bg-opacity-70">
        <motion.div
          className="bg-white dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-lg w-full max-w-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-center">Select or Remove Tag</h2>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-2 border rounded-md flex justify-between items-center bg-gray-100 dark:bg-gray-800 focus:outline-none"
            >
              {selectedTag ? selectedTag.name : "Select a tag..."}
              <ChevronDown size={18} />
            </button>

            {isDropdownOpen && (
              <motion.div
                className="absolute w-full mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 max-h-40 overflow-y-auto border dark:border-gray-700"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <input
                  type="text"
                  placeholder="Search or select tag..."
                  value={tagName}
                  onChange={handleSearch}
                  className="w-full px-3 py-2 border rounded-md mb-2 focus:outline-none dark:bg-gray-700 dark:text-white"
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
            className="mt-4 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition w-full"
            disabled={loading}
          >
            {loading ? "Removing..." : "Remove Tag"}
            <PlusCircle size={18} />
          </button>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
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

export default RemovTagContactModal;

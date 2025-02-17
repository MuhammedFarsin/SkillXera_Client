import { useState, useEffect } from "react";
import { toast } from "sonner";
import axiosInstance from "../../../Connection/Axios";
import { motion } from "framer-motion";
import { ChevronDown, PlusCircle } from "lucide-react";

// eslint-disable-next-line react/prop-types
function AddTagDropDownModal({ isOpen, onClose, onTagDropDownAdded, selectedContactId }) {
  const [tagName, setTagName] = useState("");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]); // List of tags
  const [filteredTags, setFilteredTags] = useState([]); // Search results
  const [selectedTag, setSelectedTag] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen) fetchTags();
  }, [isOpen]);

  // Fetch existing tags
  const fetchTags = async () => {
    try {
      const response = await axiosInstance.get("/admin/crm/tag/get-tags");
      setTags(response.data);
      setFilteredTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  // Handle adding a new tag
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
        console.log('this is the selected id :',selectedContactId)
        // Immediately update UI
        onTagDropDownAdded(selectedContactId, response.data.tag); 

        setSelectedTag(response.data.tag);
        setIsDropdownOpen(false);
        setSelectedTag("")
        onClose();
        
      } else if(response.status === 400){
        toast.error(response.data.message)
      } else {
        toast.error("Failed to attach tag. Try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Bad Request");
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
};

  

  // Handle selecting an existing tag
  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setTagName(tag.name);
    setIsDropdownOpen(false);
  };

  // Handle search functionality
  const handleSearch = (e) => {
    const value = e.target.value;
    setTagName(value);
    setFilteredTags(tags.filter((tag) => tag.name.toLowerCase().includes(value.toLowerCase())));
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
          <h2 className="text-xl font-semibold mb-4 text-center">Select or Add Tag</h2>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-2 border rounded-md flex justify-between items-center bg-gray-100 focus:outline-none"
            >
              {selectedTag ? selectedTag.name : "Select a tag..."}
              <ChevronDown size={18} />
            </button>

            {isDropdownOpen && (
              <motion.div
                className="absolute w-full mt-2 bg-white shadow-lg rounded-lg p-2 max-h-40 overflow-y-auto border"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <input
                  type="text"
                  placeholder="Search or add tag..."
                  value={tagName}
                  onChange={handleSearch}
                  className="w-full px-3 py-2 border rounded-md mb-2 focus:outline-none"
                />
                {filteredTags.length > 0 ? (
                  filteredTags.map((tag) => (
                    <div
                      key={tag._id}
                      className="px-3 py-2 hover:bg-gray-200 cursor-pointer rounded-md"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag.name}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No tags found</p>
                )}
              </motion.div>
            )}
          </div>

          {/* Add New Tag Button */}
          <button
            onClick={handleSubmit}
            className="mt-4 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition w-full"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add New Tag"}
            <PlusCircle size={18} />
          </button>

          {/* Buttons */}
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

import { useState } from "react";
import { toast } from "sonner";
import axiosInstance from "../../../Connection/Axios";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const AddModuleModal = ({ isOpen, onClose, onModuleAdded }) => {
  const {courseId} = useParams()
  const [loading, setLoading] = useState(false);
  const [moduleName, setModuleName] = useState("");

  const handleSubmit = async () => {
    if (!moduleName.trim()) {
      toast.error("Module name cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/admin/assets/course/add-module/${courseId}`, {
        title: moduleName, 
      });

      if (response.status === 201) {
        console.log(response.data.module)
        onModuleAdded(response.data.module);
        toast.success("Module added successfully!");
        setModuleName(""); // Reset input field
        onClose();
      } else {
        toast.error("Failed to add module!");
      }
    } catch (error) {
      toast.error("Error adding module!");
      console.error("Error:", error);
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
          <h2 className="text-xl font-semibold mb-4 text-center">Add New Module</h2>

          <label className="block font-medium text-gray-700">Module Name</label>
          <input
            type="text"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter module name"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Module"}
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
};

export default AddModuleModal;

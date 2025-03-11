import { useState, useEffect } from "react";
import { toast } from "sonner";
import axiosInstance from "../../../Connection/Axios";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function EditModuleModel({ isOpen, onClose, onModuleUpdated, moduleId }) {
  const { courseId } = useParams();
  const [moduleName, setModuleName] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isOpen && moduleId) {
      const fetchModuleDetails = async () => {
        try {
          const response = await axiosInstance.get(
            `/admin/assets/course/edit-module/${courseId}/${moduleId}`
          );
          console.log(response.data);
          if (response.status === 200) {
            setModuleName(response.data.module.title);
          }
        } catch (error) {
          toast.error("Failed to fetch module details");
          console.error("Error fetching module details:", error);
        }
      };
      fetchModuleDetails();
    }
  }, [isOpen, moduleId, courseId]);

  const handleSubmit = async () => {
    if (!moduleName.trim()) {
      toast.error("Module name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `/admin/assets/course/edit-module/${courseId}/${moduleId}`,
        {
          title: moduleName,
        }
      );
      if (response.status === 200) {
        toast.success("Module updated successfully");
        onModuleUpdated(response.data.module);
        onClose();
      }
    } catch (error) {
      toast.error("Failed to update module");
      console.error("Error updating module:", error);
    }
    setLoading(false);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl text-white font-semibold mb-4 text-center">
            Edit Module
          </h2>

          <label className="block font-medium text-gray-300">Module Name</label>
          <input
            type="text"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            className="w-full p-2 border bg-gray-800 rounded-md mb-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter module name"
          />

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
              {loading ? "Updating..." : "Update Module"}
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
}

export default EditModuleModel;

import { useEffect, useState } from "react";
import axiosInstance from "../../../Connection/Axios";
import { toast } from "sonner";
import { FaPlus } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import AddModuleModal from "../PopUpMessage/AddModuleModel";
import EditModuleModal from "../PopUpMessage/EditModuleModel"; // Import the Edit Modal
import EmptyPage from "../../../assets/Empty.jpg";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

function ModuleTable() {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

  const fetchModules = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/assets/courses/get-modules/${courseId}`
      );
      if (response.status === 200) {
        setModules(response.data.modules);
      } else {
        toast.error("Couldn't fetch course modules");
      }
    } catch (error) {
      toast.error("Couldn't fetch course modules");
      console.error("Fetch Modules Error:", error);
    }
  };

  const handleModuleAdded = (newModule) => {
    setModules([...modules, newModule]);
  };

  const handleModuleUpdated = (updatedModule) => {
    setModules(
      modules.map((module) =>
        module._id === updatedModule._id ? updatedModule : module
      )
    );
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (module) => {
    
    setSelectedModule(module._id);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const toggleDropdown = (id) =>
    setDropdownOpen(dropdownOpen === id ? null : id);

  const handleDeleteModule = async (moduleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This module will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(
            `/admin/assets/courses/delete-module/${courseId}/${moduleId}`
          );
          if (response.status === 200) {
            setModules(modules.filter((module) => module._id !== moduleId));
            toast.success("Module deleted successfully");
          } else {
            toast.error("Failed to delete module");
          }
        } catch (error) {
          toast.error("Error deleting module");
          console.error("Delete Module Error:", error);
        }
      }
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen pt-20">
      <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
        Modules
      </h2>

      {modules.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <img
            src={EmptyPage}
            alt="No Modules"
            className="w-40 h-40 object-contain rounded-full"
          />
          <p className="text-gray-500 text-lg mt-4">No modules available</p>
          <button
            onClick={openAddModal}
            className="bg-green-600 text-white px-6 py-3 mt-4 rounded-lg shadow-md flex items-center"
          >
            <FaPlus className="mr-2" /> Add Module
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {modules.map((module, index) => (
            <div
              key={module._id || index}
              className="bg-white p-4 rounded-lg shadow-md relative"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-green-800">
                  {module.title}
                </h3>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(module._id)}
                    className="text-gray-900"
                  >
                    <HiOutlineDotsHorizontal />
                  </button>
                  {dropdownOpen === module._id && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                      <button className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(module)}
                        className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module._id)}
                        className="block w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-6">
            <button
              onClick={openAddModal}
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md flex items-center"
            >
              <FaPlus className="mr-2" /> Add Module
            </button>
          </div>
        </div>
      )}

      <AddModuleModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onModuleAdded={handleModuleAdded}
      />

      <EditModuleModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        moduleId={selectedModule}
        onModuleUpdated={handleModuleUpdated}
      />
    </div>
  );
}

export default ModuleTable;

import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../../Connection/Axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FaPlus } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import AddModuleModal from "../PopUpMessage/AddModuleModel";
import EditModuleModal from "../PopUpMessage/EditModuleModel";
import AddLectureModal from "../PopUpMessage/AddLectureModel";
import EditLectureModal from "../PopUpMessage/EditLectureModel";
import EmptyPage from "../../../assets/Empty.jpg";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { format } from "date-fns";

function ModuleTable() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [modules, setModules] = useState([]);
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isEditModuleOpen, setIsEditModuleOpen] = useState(false);
  const [isAddLectureOpen, setIsAddLectureOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isEditLectureOpen, setIsEditLectureOpen] = useState(false);
  const [selectedLectureId, setSelectedLectureId] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const modulesResponse = await axiosInstance.get(
          `/admin/assets/courses/get-modules/${courseId}`
        );

        if (modulesResponse.status === 200) {
          const modulesData = modulesResponse.data.modules;

          // Fetch lectures for each module
          const modulesWithLectures = await Promise.all(
            modulesData.map(async (module) => {
              try {
                const lecturesResponse = await axiosInstance.get(
                  `/admin/assets/courses/get-lectures/${courseId}/${module._id}`
                );
                return {
                  ...module,
                  lectures: lecturesResponse.data.lectures || [],
                };
              } catch (error) {
                console.error(
                  `Error fetching lectures for module ${module._id}:`,
                  error
                );
                return { ...module, lectures: [] };
              }
            })
          );

          setModules(modulesWithLectures);
        } else {
          toast.error("Couldn't fetch course modules and lectures");
        }
      } catch (error) {
        toast.error("Couldn't fetch course modules and lectures");
        console.error("Fetch Modules & Lectures Error:", error);
      }
    };
    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

  const toggleDropdownLecture = (lectureId) => {
    setDropdownOpen((prev) => (prev === lectureId ? null : lectureId));
  };
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setDropdownOpen(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

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

  const handleLectureAdded = (moduleId, newLecture) => {
    setModules((prevModules) =>
      prevModules.map((module) =>
        module._id === moduleId
          ? { ...module, lectures: [...(module.lectures || []), newLecture] }
          : module
      )
    );
  };

  const openAddModuleModal = () => setIsAddModuleOpen(true);
  const closeAddModuleModal = () => setIsAddModuleOpen(false);

  const openEditModuleModal = (module) => {
    setSelectedModule(module._id);
    setIsEditModuleOpen(true);
  };
  const closeEditModuleModal = () => setIsEditModuleOpen(false);

  const openAddLectureModal = (module) => {
    setSelectedModule(module._id);
    setIsAddLectureOpen(true);
  };
  const closeAddLectureModal = () => setIsAddLectureOpen(false);

  const toggleDropdown = (id) =>
    setDropdownOpen(dropdownOpen === id ? null : id);

  const handleEditLecture = (lectureId, moduleId) => {
    setSelectedLectureId(lectureId);
    setSelectedModuleId(moduleId);
    setIsEditLectureOpen(true);
  };
  const closeModal = () => {
    setIsEditLectureOpen(false);
    setSelectedLectureId(null);
    setSelectedModuleId(null);
  };
  const handleLectureUpdate = (updatedLecture) => {
    console.log("this is the updated lecture :", updatedLecture);
    setModules((prevModules) =>
      prevModules.map((module) =>
        module._id === updatedLecture.moduleId
          ? {
              ...module,
              lectures: module.lectures.map((lecture) =>
                lecture._id === updatedLecture._id ? updatedLecture : lecture
              ),
            }
          : module
      )
    );
  };

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
  const handleDeleteLecture = async (courseId, moduleId, lectureId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this lecture!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Call API to delete lecture
          const response = await axiosInstance.delete(
            `/admin/assets/courses/delete-lecture/${courseId}/${moduleId}/${lectureId}`
          );

          if (response.status === 200) {
            setModules((prevModules) => {
              // Ensure prevModules is not undefined
              if (!prevModules) return prevModules;

              return prevModules.map((module) => {
                if (module._id === moduleId) {
                  return {
                    ...module,
                    lectures: module.lectures
                      ? module.lectures.filter(
                          (lecture) => lecture._id !== lectureId
                        )
                      : [],
                  };
                }
                return module;
              });
            });

            toast.success("Lecture deleted successfully...");
          }
        } catch (error) {
          console.error("Error!", "Failed to delete lecture.", error);
          toast.error("Failed to delete lecture");
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
            onClick={openAddModuleModal}
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
                <h2 className="text-2xl font-semibold text-green-800">
                  {module.title}
                </h2>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(module._id)}
                    className="text-gray-900"
                  >
                    <HiOutlineDotsHorizontal />
                  </button>
                  {dropdownOpen === module._id && (
                    <div className="absolute right-0 mt-0 w-24 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                      <button
                        onClick={() => {
                          if (module.lectures.length > 0) {
                            navigate(
                              `/admin/assets/courses/watch-lecture/${courseId}/${module._id}/0`
                            );
                          }
                        }}
                        className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        View
                      </button>

                      <button
                        onClick={() => openEditModuleModal(module)}
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

              {/* Display Lectures under the module */}

              <div className="mt-3">
                {module.lectures && module.lectures.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {module.lectures.map((lecture) => (
                      <li
                        key={lecture._id}
                        className="grid grid-cols-3 items-center p-3 border rounded-lg hover:bg-gray-100 transition duration-200"
                      >
                        {/* Lecture Title - Left Aligned */}
                        <div className="text-green-600 font-medium hover:text-green-800 transition duration-200">
                          {lecture.title}
                        </div>

                        {/* Creation Date - Centered */}
                        <div className="text-gray-500 text-sm text-center">
                          {format(new Date(lecture.createdAt), "PPpp")}
                        </div>

                        {/* Options Button - Right Aligned */}
                        <div
                          className="relative flex justify-end"
                          ref={dropdownRef}
                        >
                          <button
                            onMouseEnter={() =>
                              toggleDropdownLecture(lecture._id)
                            }
                            className="p-2 rounded-full hover:bg-gray-200 transition"
                          >
                            <HiOutlineDotsHorizontal className="text-gray-600" />
                          </button>

                          {dropdownOpen === lecture._id && (
                            <div className="absolute right-0 mt-10 w-32 bg-white border rounded-lg shadow-lg z-10">
                              <ul className="text-sm text-gray-700">
                                <li
                                  onClick={() =>
                                    handleEditLecture(lecture._id, module._id)
                                  }
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  Edit
                                </li>
                                <li
                                  onClick={() =>
                                    handleDeleteLecture(
                                      courseId,
                                      module._id,
                                      lecture._id
                                    )
                                  }
                                  className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                                >
                                  Delete
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm mt-2">
                    No lectures available
                  </p>
                )}
              </div>

              <div className="flex justify-center mt-2">
                <button
                  onClick={() => openAddLectureModal(module)}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center"
                >
                  <FaPlus className="mr-2" /> Add Lecture
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-6">
            <button
              onClick={openAddModuleModal}
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md flex items-center"
            >
              <FaPlus className="mr-2" /> Add Module
            </button>
          </div>
        </div>
      )}

      <AddModuleModal
        isOpen={isAddModuleOpen}
        onClose={closeAddModuleModal}
        onModuleAdded={handleModuleAdded}
      />

      <EditModuleModal
        isOpen={isEditModuleOpen}
        onClose={closeEditModuleModal}
        moduleId={selectedModule}
        onModuleUpdated={handleModuleUpdated}
      />

      <AddLectureModal
        isOpen={isAddLectureOpen}
        onClose={closeAddLectureModal}
        moduleId={selectedModule}
        onLectureAdded={handleLectureAdded}
      />
      <EditLectureModal
        isOpen={isEditLectureOpen}
        onClose={closeModal}
        moduleId={selectedModuleId}
        lectureId={selectedLectureId}
        onLectureUpdated={handleLectureUpdate}
      />
    </div>
  );
}

export default ModuleTable;

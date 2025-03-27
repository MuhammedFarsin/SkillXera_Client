import { useEffect, useState, useRef } from "react";
import Admin_Navbar from "../../Common/AdminNavbar";
import EmptyImage from "../../../assets/Empty.jpg";
import axiosInstance from "../../../Connection/Axios";
import AddTag_Modal from "../Modal/AddTagModal";
import EditTag_Modal from "../Modal/EditTagModal";
import { toast } from "sonner";
import { format } from "date-fns";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Swal from "sweetalert2";

function TagTable() {
  const [tags, setTags] = useState([]);
  const [isOpenTagModal, setIsOpenTagModal] = useState(false);
  const [isOpenEditTagModal, setIsOpenEditTagModal] = useState(false);
  const [editingTagId, setEditingTagId] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axiosInstance.get("/admin/crm/tag/get-tags");
        if (response.status === 200) {
          setTags(response.data);
        }
      } catch (error) {
        toast.error("Something went wrong!");
        console.error(error);
      }
    };
    fetchTags();
  }, []);

  const handleTagAdded = (newTag) => {
    setTags((prevTags) => [...prevTags, newTag]);
  };

  const handleTagModalOpen = () => setIsOpenTagModal(true);
  const handleTagModalClose = () => setIsOpenTagModal(false);

  const handleEditTagModalOpen = (tagId) => {
    setEditingTagId(tagId);
    setIsOpenEditTagModal(true);
  };
  const handleEditTagModalClose = () => setIsOpenEditTagModal(false);

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };


  const handleTagEdited = (updatedTag) => {
    setTags((prevTags) =>
      prevTags.map((tag) => (tag._id === updatedTag._id ? updatedTag : tag))
    );
  };

  
  console.log(tags)

  const handleDelete = async (tagId) => {
    console.log('this is clicking')
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(
            `/admin/crm/tag/delete-tag/${tagId}`
          );
          if (response.status === 200) {
            setTags((prevTags) => prevTags.filter((tag) => tag._id !== tagId));
            toast.success("Tag deleted successfully!");
          }
        } catch (error) {
          toast.error("Failed to delete tag.");
          console.error(error);
        }
      }
    });
  };

  return (
    <div className="relative bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-200 text-sm">
      <Admin_Navbar />
      <div className="p-10 mx-auto py-10 mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tags</h2>
          <button
            onClick={handleTagModalOpen}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            New Tag
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          {tags.length > 0 && (
            <div className="grid grid-cols-3 text-center font-semibold bg-gray-200 dark:bg-gray-700 p-3 rounded-md">
              <div>Tag Name</div>
              <div>Date Registration</div>
              <div>Actions</div>
            </div>
          )}

          {tags.length > 0 ? (
            <div>
              {tags.map((tag, index) => (
                <div
                  key={tag._id}
                  className="grid grid-cols-3 text-center p-3 border-b border-gray-300 dark:border-gray-600 items-center hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                >
                  <div>{tag.name}</div>
                  <div>{format(new Date(tag.createdAt), "PPpp")}</div>
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => toggleMenu(index)}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <HiOutlineDotsHorizontal className="text-lg" />
                    </button>
                    {openMenuIndex === index && (
                      <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md z-10">
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => handleEditTagModalOpen(tag._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => handleDelete(tag._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <img
                src={EmptyImage}
                alt="No Tags"
                className="w-40 h-40 rounded-full"
              />
              <p className="text-gray-500 dark:text-gray-400 mt-4">No tags found.</p>
            </div>
          )}
        </div>
      </div>

      <AddTag_Modal
        onTagAdded={handleTagAdded}
        isOpen={isOpenTagModal}
        onClose={handleTagModalClose}
      />
      <EditTag_Modal
        isOpen={isOpenEditTagModal}
        onClose={handleEditTagModalClose}
        tagId={editingTagId}
        onTagEdited={handleTagEdited}
      />
    </div>
  );
}

export default TagTable;

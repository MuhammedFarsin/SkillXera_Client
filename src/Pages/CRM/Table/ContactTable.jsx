import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Common/AdminNavbar";
import axiosInstance from "../../../Connection/Axios";
import AddContact_Modal from "../Modal/AddContactModal";
import EmptyImage from "../../../assets/Empty.jpg";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

function ContactTable() {
  const [contactsData, setContactsData] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const contactsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axiosInstance.get(
          "/admin/crm/contact/get-contacts"
        );
        if (response.status === 200) {
          setContactsData(response.data);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast.error("Failed to fetch contacts...");
      }
    };
    fetchContacts();
  }, []);

  const filteredContacts = contactsData.filter((contact) =>
    (contact.email || "")
      .toLowerCase()
      .includes((searchFilter || "").toLowerCase())
  );

  const handleSelect = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleContactAdded = (newContact) => {
    console.log("New Contact Added:", newContact);
    if (!newContact || !newContact._id) {
      console.error("Invalid contact data received:", newContact);
      return;
    }
    setContactsData([newContact, ...contactsData]);
  };

  const handleSelectAll = () => {
    setSelectedContacts(
      selectedContacts.length === filteredContacts.length
        ? []
        : filteredContacts.map((contact) => contact._id)
    );
  };
  const handleDelete = async () => {
    if (selectedContacts.length === 0) {
      toast.error("No contacts selected.");
      return;
    }
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
            `/admin/crm/contact/delete-contact`,
            {
              data: { ids: selectedContacts },
            }
          );
          if (response.status === 200) {
            setContactsData((prev) =>
              prev.filter((contact) => !selectedContacts.includes(contact._id))
            );
            setSelectedContacts([]);
            toast.success("Contacts deleted successfully.");
          }
        } catch (error) {
          console.error("Error deleting contacts:", error);
          toast.error("Failed to delete contacts.");
        }
      }
    });
  };

  return (
    <div className="relative bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-10 mx-auto py-10 mt-12 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Contacts</h2>
          <button
            onClick={handleOpenModal}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
          >
            New Contact
          </button>
        </div>

        <div className="flex gap-10">
          <div className="h-80 w-64 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <input
              type="text"
              placeholder="Search by email..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex-1 p-6 bg-white rounded-lg shadow-md relative">
            {filteredContacts.length > 0 ? (
              <>
                <div className="grid grid-cols-4 bg-gray-200 p-3 rounded-t-lg font-semibold text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedContacts.length === filteredContacts.length
                    }
                  />
                  <div>Date Registered</div>
                  <div>Email</div>
                  <div>Tags</div>
                </div>

                <div>
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact._id}
                      className="grid grid-cols-4 border-b h-16 rounded-lg p-3 text-center items-center hover:border-green-500 hover:border-2 transition-all"
                    >
                      {/* Checkbox with Tick */}
                      <label className="relative cursor-pointer flex justify-center">
                        <input
                          type="checkbox"
                          onChange={() => handleSelect(contact._id)}
                          checked={selectedContacts.includes(contact._id)}
                          className="appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:bg-green-500 checked:border-green-500 transition-all cursor-pointer"
                        />
                        {/* Checkmark SVG (Visible Only When Checked) */}
                        {selectedContacts.includes(contact._id) && (
                          <svg
                            className="absolute w-4 h-4 text-white pointer-events-none"
                            viewBox="0 0 24 18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </label>

                      {/* Date Registered */}
                      <div>{format(new Date(contact.createdAt), "PPpp")}</div>

                      {/* Email as a Link */}
                      <div
                        className="text-green-500 cursor-pointer"
                        onClick={() => navigate(`/edit/${contact._id}`)}
                      >
                        {contact.email}
                      </div>

                      {/* Tags */}
                      <div className="flex justify-center gap-2 flex-wrap">
                        {contact.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-gray-300 rounded-lg"
                          >
                            {tag.name}{" "}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <img
                  src={EmptyImage}
                  alt="No Tags"
                  className="w-40 h-40 rounded-full"
                />
                <p className="text-gray-500 mt-4">No tags found.</p>
              </div>
            )}

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={
                selectedContacts.length > 0
                  ? { y: 0, opacity: 1 }
                  : { y: 100, opacity: 0 }
              }
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed bottom-0 left-0 right-0 bg-gray-700 text-white shadow-md p-4 flex justify-end gap-10 items-center"
            >
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Add More Options
                </button>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute bottom-full left-0 mb-2 bg-white shadow-md rounded-md p-3"
                  >
                    <button className="block w-full text-left rounded-lg text-black px-4 py-2 hover:bg-gray-100">
                      Add Tag
                    </button>
                    <button className="block w-full text-left rounded-lg text-black px-4 py-2 hover:bg-gray-100">
                      Edit
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <AddContact_Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onContactAdded={handleContactAdded}
      />
    </div>
  );
}

export default ContactTable;

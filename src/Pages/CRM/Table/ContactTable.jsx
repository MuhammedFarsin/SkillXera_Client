import { useState } from "react";
import { Plus, Upload, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { motion } from "framer-motion";

const contactsData = [
  { date: "01/30/2025, 07:53 A", email: "farsinmuhammed044@gmail.com", firstName: "Farsin", lastName: "P.T", phone: "9876543210", tags: ["VIP", "Work"] },
  { date: "01/29/2025, 02:06 P", email: "muhammedfarsin103@gmail.com", firstName: "Muhammed", lastName: "Farsin", phone: "9876541230", tags: ["Personal"] },
  { date: "01/28/2025, 10:12 A", email: "example@gmail.com", firstName: "John", lastName: "Doe", phone: "9123456780", tags: ["Client"] },
];

function ContactTable() {
  const [searchFilters, setSearchFilters] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const contactsPerPage = 2;
  const [sortBy, setSortBy] = useState("date");

  const filteredContacts = contactsData
    .filter((contact) =>
      Object.keys(searchFilters).every((key) =>
        contact[key].toLowerCase().includes(searchFilters[key].toLowerCase())
      )
    )
    .sort((a, b) => (sortBy === "date" ? new Date(b.date) - new Date(a.date) : 0));

  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex pt-24">
      {/* Sidebar for Filters */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.4 }}
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-5 z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Filter Contacts</h3>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        {["email", "firstName", "lastName", "phone"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={`Search by ${field}...`}
            value={searchFilters[field]}
            onChange={(e) => setSearchFilters({ ...searchFilters, [field]: e.target.value })}
            className="w-full px-3 py-2 mb-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#004d40] transition"
          />
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-3xl font-bold">Contacts</h2>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 text-white rounded-lg bg-gradient-to-r from-[#1a1a1a] to-[#004d40] shadow-lg hover:scale-105 transition">
              <Plus size={16} />
              <span>Add Contact</span>
            </button>
            <button className="flex items-center px-4 py-2 border rounded-lg bg-white shadow hover:shadow-lg hover:scale-105 transition">
              <Upload size={16} />
              <span>Import</span>
            </button>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center px-4 py-2 border rounded-lg bg-white shadow hover:shadow-lg hover:scale-105 transition"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-5 rounded-xl shadow-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Contacts List</h3>
            <button
              className="text-blue-600 underline"
              onClick={() => setSortBy(sortBy === "date" ? "" : "date")}
            >
              Sort by Date
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="p-2">Date Registered</th>
                <th className="p-2">Email</th>
                <th className="p-2">Name</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Tags</th>
              </tr>
            </thead>
            <tbody>
              {paginatedContacts.map((contact, index) => (
                <motion.tr
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-3">{contact.date}</td>
                  <td className="p-3">{contact.email}</td>
                  <td className="p-3">{contact.firstName} {contact.lastName}</td>
                  <td className="p-3">{contact.phone}</td>
                  <td className="p-3 flex space-x-2">
                    {contact.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-gray-300 transition"
                      >
                        {tag}
                      </span>
                    ))}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-1 border rounded-lg shadow hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-1 border rounded-lg shadow hover:bg-gray-200 disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ContactTable;

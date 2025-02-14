import { useState } from "react";
import Navbar from "../../Common/AdminNavbar";

const contactsData = [
  { date: "01/30/2025, 07:53 A", email: "farsinmuhammed044@gmail.com", tags: ["VIP", "Work"] },
  { date: "01/29/2025, 02:06 P", email: "muhammedfarsin103@gmail.com", tags: ["Personal"] },
  { date: "01/28/2025, 10:12 A", email: "example@gmail.com", tags: ["Client"] },
];

function ContactTable() {
  const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 5;

  const filteredContacts = contactsData.filter((contact) =>
    contact.email.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );

  return (
    <div className="relative">
      <Navbar />
      
      {/* Main Container */}
      <div className="p-20 mx-auto py-10 mt-12">
        
        {/* Page Header with Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Contacts</h2>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
            New Contact
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="flex gap-3 bg-gray-00 rounded-lg">

          {/* Filter Section */}
          <div className="w-1/3 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <input
              type="text"
              placeholder="Search by email..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Contact Table Section */}
          <div className="w-4/5 p-6 bg-white rounded-lg shadow-md">
            <table className="w-full border-collapse bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left">Date Registered</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Tags</th>
                </tr>
              </thead>
              <tbody>
                {paginatedContacts.map((contact, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{contact.date}</td>
                    <td className="p-3">{contact.email}</td>
                    <td className="p-3">
                      {contact.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-gray-300 rounded-lg mr-2">
                          {tag}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            
          </div>

        </div>
      </div>
    </div>
  );
}

export default ContactTable;

import { motion } from "framer-motion";
import { X } from "lucide-react";

// eslint-disable-next-line react/prop-types
export default function ViewContactModal({ isOpen, contact, loading, error, onClose }) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-80 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-lg p-6 w-[500px] md:w-[600px] max-h-[80vh] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          View Contact
        </h2>

        {/* Contact Details */}
        <div className="space-y-4 max-h-[65vh] overflow-y-auto px-1">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium">Username</label>
                <p className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                  {contact?.username || "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium">Email</label>
                <p className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                  {contact?.email || "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium">Phone</label>
                <p className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                  {contact?.phone || "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium">Status</label>
                <p className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                  {contact?.statusTag || "N/A"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-500 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
}
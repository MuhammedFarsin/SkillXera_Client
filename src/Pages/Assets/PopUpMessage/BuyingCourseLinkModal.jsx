import { motion } from "framer-motion";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
function BuyingCourseLinkModal({ isOpen, onClose, buyLink }) {
  const [copied, setCopied] = useState(false);

  // Copy the link to the clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(buyLink);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Copy Your Course Link
        </h2>

        <label className="block font-medium text-white">
          Buying Course Link
        </label>
        <div className="flex items-center">
          <input
            type="text"
            value={buyLink}
            readOnly
            className="w-full p-2 border rounded-md focus:outline-none bg-gray-700 focus:ring-2 focus:ring-green-500 text-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={handleCopy}
            className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}


export default BuyingCourseLinkModal;

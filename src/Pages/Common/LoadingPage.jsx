import { motion } from "framer-motion";

function LoadingPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#004d40] flex flex-col items-center justify-center px-4">
      {/* Glowing Orb Animation */}
      <motion.div
        initial={{ opacity: 0.5, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.2 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
        className="w-20 h-20 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full shadow-lg shadow-violet-500/50"
      ></motion.div>

      {/* Loading Text */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="text-white text-lg font-semibold mt-6"
      >
        Please wait...
      </motion.h1>
    </div>
  );
}

export default LoadingPage;

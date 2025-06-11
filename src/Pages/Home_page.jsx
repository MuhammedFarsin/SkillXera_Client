import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Common/Navbar";
import axiosInstance from "../Connection/Axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Spinner from "./Common/spinner";
import {
  FaPlay,
  FaExternalLinkAlt,
  FaFileDownload,
  FaBook,
  FaFileAlt,
  FaBoxOpen,
} from "react-icons/fa";

const tabConfig = [
  {
    id: "courses",
    name: "My Courses",
    icon: <FaBook />,
    color: "blue",
  },
  {
    id: "digitalProducts",
    name: "Digital Products",
    icon: <FaFileAlt />,
    color: "purple",
  },
  {
    id: "orderBumps",
    name: "Bonus Resources",
    icon: <FaBoxOpen />,
    color: "green",
  },
];

function Home_page() {
  const user = useSelector((state) => state.user);
  const userId = user?._id;
  const [purchases, setPurchases] = useState({
    courses: [],
    digitalProducts: [],
    orderBumps: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses");
  const BASE_URL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchUserPurchases = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/user-orders/${userId}`);
        if (response.status === 200) {
          setPurchases({
            courses: response.data.courses || [],
            digitalProducts: response.data.digitalProducts || [],
            orderBumps: response.data.orderBumps || [],
          });
        } else {
          toast.info("You haven't made any purchases yet.");
        }
      } catch (error) {
        toast.error(error.response.data.messa);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserPurchases();
  }, [userId]);

  const currentItems = purchases[activeTab] || [];
  const activeTabConfig =
    tabConfig.find((tab) => tab.id === activeTab) || tabConfig[0];

  const renderProductCard = (item) => {
    const cardBase =
      "rounded-xl shadow-md border border-gray-200 bg-white overflow-hidden";
    const buttonBase =
      "w-full flex items-center justify-center gap-2 text-white py-2 px-4 rounded-lg";
    switch (activeTab) {
      case "courses":
        return (
          <>
            <div className="relative h-48">
              {item.product?.images?.[0] && (
                <img
                  src={`${BASE_URL}${item.product.images[0]}`}
                  alt={item.product.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xl font-bold">
                {item.product.title}
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-4 line-clamp-2">
                {item.product.description}
              </p>
              {item.product.modules?.length > 0 ? (
                <Link
                  to={`/learn/${item.productId}/module/${item.product.modules[0]._id}/lectures/0`}
                  state={{ courseData: { course: item.product } }}
                >
                  <motion.button
                    className={`${buttonBase} bg-blue-600 hover:bg-blue-700`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaPlay size={14} />
                    Start Learning
                  </motion.button>
                </Link>
              ) : (
                <p className="text-gray-500 text-center text-sm">
                  Content coming soon
                </p>
              )}
            </div>
          </>
        );

      case "digitalProducts":
        return (
          <>
            <div className="relative h-48 bg-gradient-to-br from-purple-500 to-indigo-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <FaFileAlt className="text-6xl text-white opacity-30" />
              </div>
              <div className="absolute bottom-4 left-4 text-xl text-white font-bold">
                {item.product.title}
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-4">{item.product.description}</p>
              <div className="space-y-2">
                {item.product.fileUrl && (
                  <a
                    href={`${BASE_URL}${item.product.fileUrl}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.button
                      className={`${buttonBase} bg-purple-600 hover:bg-purple-700`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaFileDownload size={14} />
                      Download
                    </motion.button>
                  </a>
                )}
                {item.product.externalUrl && (
                  <a
                    href={item.product.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.button
                      className={`${buttonBase} bg-indigo-600 hover:bg-indigo-700`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaExternalLinkAlt size={14} />
                      Access Resource
                    </motion.button>
                  </a>
                )}
              </div>
            </div>
          </>
        );

      case "orderBumps":
        return (
          <>
            <div className="relative h-48 bg-gradient-to-br from-green-500 to-teal-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <FaBoxOpen className="text-6xl text-white opacity-30" />
              </div>
              <div className="absolute bottom-4 left-4 text-white font-bold text-xl">
                {item.title}
                <div className="text-sm opacity-90">
                  Bonus for: {item.parentProduct.title}
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="space-y-2">
                {item.fileUrl && (
                  <a
                    href={`${BASE_URL}${item.fileUrl}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.button
                      className={`${buttonBase} bg-green-600 hover:bg-green-700`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaFileDownload size={14} />
                      Download
                    </motion.button>
                  </a>
                )}
                {item.externalUrl && (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.button
                      className={`${buttonBase} bg-teal-600 hover:bg-teal-700`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaExternalLinkAlt size={14} />
                      Access Resource
                    </motion.button>
                  </a>
                )}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Purchases
        </motion.h2>

        {/* Tab Navigation */}
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-full p-1 flex gap-2 shadow-inner">
            {tabConfig.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? `bg-white text-${tab.color}-600 shadow`
                      : `text-gray-500 hover:bg-white/80`
                  }`}
                >
                  <span className={`text-lg`}>
                    {React.cloneElement(tab.icon, {
                      className: isActive
                        ? `text-${tab.color}-600`
                        : "text-gray-400",
                    })}
                  </span>
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        ) : currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {currentItems.map((item) => (
                <motion.div
                  key={item.orderId || item._id}
                  className="transition-transform"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="rounded-xl overflow-hidden shadow border border-gray-200 bg-white h-full">
                    {renderProductCard(item)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-6 text-center mt-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-${activeTabConfig.color}-100`}
            >
              {React.cloneElement(activeTabConfig.icon, {
                className: `text-${activeTabConfig.color}-600 text-3xl`,
              })}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {activeTab === "courses"
                ? "No courses yet"
                : activeTab === "digitalProducts"
                ? "No digital products yet"
                : "No bonus resources yet"}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === "courses"
                ? "Start your journey by exploring our courses."
                : activeTab === "digitalProducts"
                ? "Explore our premium resources."
                : "Bonus content will be unlocked with eligible purchases."}
            </p>
            <Link to="/explore">
              <motion.button
                className={`w-full py-2 px-6 rounded-lg bg-${activeTabConfig.color}-600 text-white hover:bg-${activeTabConfig.color}-700`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse {activeTabConfig.name}
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Home_page;

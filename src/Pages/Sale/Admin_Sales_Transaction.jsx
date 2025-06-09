import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import Admin_Navbar from "../Common/AdminNavbar";
import ToastHot from "../Common/ToasterHot";
import EmptyImage from "../../assets/Empty.jpg";
import { motion } from "framer-motion";
import axiosInstance from "../../Connection/Axios";
import { toast } from "sonner";
import Swal from "sweetalert2";

function Admin_Sales_Transaction() {
  const [payments, setPayments] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [selectedPayment, setSelectedPayment] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axiosInstance.get("/admin/payments");
        console.log("API Response:", response.data);
        setPayments(response.data.payment);
      } catch (error) {
        console.error("Error fetching payment details:", error);
        setPayments([]);
      }
    };
    fetchPayments();
  }, []);

  const handleSelect = (id) => {
    setSelectedPayment((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const handleSelectAll = () => {
    setSelectedPayment(
      selectedPayment.length === filteredPayments.length
        ? []
        : filteredPayments.map((payment) => payment._id)
    );
  };

  const handleDelete = async () => {
    if (selectedPayment.length === 0) {
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
            `/admin/sales/transaction/delete-transaction`,
            {
              data: { ids: selectedPayment },
            }
          );
          if (response.status === 200) {
            setPayments((prev) =>
              prev.filter((payment) => !selectedPayment.includes(payment._id))
            );
            setSelectedPayment([]);
            toast.success("Contacts deleted successfully.");
          }
        } catch (error) {
          console.error("Error deleting contacts:", error);
          toast.error("Failed to delete contacts.");
        }
      }
    });
  };
  const handleResendPaymentMail = async (orderId) => {
    try {
      console.log("this is the order_id", orderId);
      if (!orderId) {
        toast.error("Order ID is missing");
        return;
      }

      const response = await axiosInstance.post(
        "/admin/sales/transaction/resend-transaction-mail",
        {
          order_id: orderId,
        }
      );

      if (response.status === 200) {
        toast.success("Resend Email Successfully Sent");
      }
    } catch (error) {
      toast.error("Error while resending Email");
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "success":
      return "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800";
    case "failed":
      return "text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800";
    case "pending":
      return "text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800";
    case "refunded":
      return "text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800";
    case "processing":
      return "text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800";
    case "cancelled":
      return "text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800";
    default:
      return "text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800";
  }
};

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesEmail = payment.email.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesStatus = statusFilter
        ? payment.status.toLowerCase() === statusFilter.toLowerCase()
        : true;
      const matchesPaymentMethod = paymentFilter
        ? payment.paymentMethod === paymentFilter
        : true;

      return matchesEmail && matchesStatus && matchesPaymentMethod;
    });
  }, [payments, searchFilter, statusFilter, paymentFilter]);
  
  

  return (
    <div className="relative bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-200 text-sm">
      <Admin_Navbar />

      <div className="p-10 mx-auto py-10 mt-12 bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Transactions</h2>
        </div>
        <div className="flex gap-10">
          <div className="h-80 w-64 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by email..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-200"
            />

            {/* Dropdown for Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 mt-4 border rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-200"
            >
              <option value="">Select Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="processing">Processing</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 mt-4 border rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-200"
            >
              <option value="">Select Payment</option>
              <option value="Razorpay">Razorpay</option>
              <option value="Cashfree">Cashfree</option>
            </select>
          </div>

          <div className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md relative">
            {filteredPayments.length > 0 ? (
              <>
                <div className="grid grid-cols-12 bg-gray-200 dark:bg-gray-600 p-3 rounded-t-lg font-semibold text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedPayment.length === filteredPayments.length}
                  />
                  <div className="col-span-3">Date</div>
                  <div className="col-span-2">Email</div>
                  <div className="col-span-2">Payment</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Status</div>
                </div>

                <div>
                  {filteredPayments.map((payment) => (
                    <div
                      key={payment._id}
                      className={`grid grid-cols-12 border-b h-16 rounded-lg p-3 text-center items-center transition-all dark:border-gray-600 hover:border-green-500 hover:border-2`}
                    >
                      <label className="relative cursor-pointer flex justify-center">
                        <input
                          type="checkbox"
                          onChange={() => handleSelect(payment._id)}
                          checked={selectedPayment.includes(payment._id)}
                          className="appearance-none w-5 h-5 border-2 border-gray-400 dark:border-gray-500 rounded-full checked:bg-green-500 checked:border-green-500 transition-all cursor-pointer"
                        />
                        {selectedPayment.includes(payment._id) && (
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
                      <div className="col-span-3">
                        {format(new Date(payment.createdAt), "PPpp")}
                      </div>
                      <div className="col-span-2 text-green-500 cursor-pointer">
                        {payment.email}
                      </div>
                      <div className="col-span-2 text-green-500 cursor-pointer">
                        {payment.paymentMethod}
                      </div>
                      <div className="col-span-2">₹{payment.amount}</div>
                      <div
                        className={`col-span-2 font-semibold px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}
                      >
                        {payment.status}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <img
                  src={EmptyImage}
                  alt="No Payments"
                  className="w-40 h-40 rounded-full"
                />
                <p className="text-gray-500 dark:text-gray-400 mt-4">
                  No payment records found.
                </p>
              </div>
            )}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={
                selectedPayment.length > 0
                  ? { y: 0, opacity: 1 }
                  : { y: 100, opacity: 0 }
              }
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed bottom-0 left-0 right-0 bg-gray-700 dark:bg-gray-800 text-white shadow-md p-4 flex justify-end gap-10 items-center"
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
                    className="absolute bottom-full left-0 mb-2 bg-gray-100 dark:bg-gray-700 shadow-md rounded-md p-3"
                  >
                    {payments.map((payment) => (
                      <button
                        key={payment._id}
                        onClick={() => handleResendPaymentMail(payment._id)}
                        className="block w-full text-left rounded-lg text-black dark:text-gray-200 px-4 py-2 hover:bg-white dark:hover:bg-gray-600"
                      >
                        Resend Email
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
        <ToastHot />
      </div>
    </div>
  );
}

export default Admin_Sales_Transaction;
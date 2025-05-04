import { useState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import axiosInstance from "../../Connection/Axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ToasterHot from "../Common/ToasterHot";
import ReactPixel from "react-facebook-pixel";
import { loadRazorpayScript } from "../../Utils/RazorpayScript";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Spinner from "../Common/spinner";

const PaymentPage = () => {
  const { courseId } = useParams();
  const BASE_URL = axiosInstance.defaults.baseURL;

  const [checkoutData, setCheckoutData] = useState({
    checkoutPage: null,
    course: null,
    loading: true,
    error: null,
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cashfree");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const response = await axiosInstance.get(
          `/sale/buy-course/course/${courseId}`
        );

        if (!response.data.data || !response.data.data.courseId) {
          throw new Error("Invalid checkout data structure");
        }
        
        setCheckoutData({
          checkoutPage: response.data.data,
          course: response.data.data.courseId, // This is the populated course
          loading: false,
          error: null,
        });
      } catch (error) {
        setCheckoutData((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        toast.error("Failed to fetch checkout data");
        console.error(error);
      }
    };
    fetchCheckoutData();
  }, [courseId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    if (checkoutData.loading) return;
    if (!checkoutData.course || !checkoutData.course.salesPrice) {
      return toast.error("Invalid course price");
    }

    const amount = Number(checkoutData.course.salesPrice);
    if (isNaN(amount) || amount <= 0) {
      return toast.error("Invalid course pricing");
    }

    if (paymentMethod === "cashfree") {
      handleCashfreePayment(amount);
    } else if (paymentMethod === "razorpay") {
      handleRazorpayPayment(amount);
    }
  };

  const handleCashfreePayment = async (amount) => {
    if (isSubmitting) return; // Early return if already submitting
  setIsSubmitting(true);
    try {
      ReactPixel.track("InitiateCheckout", {
        
        content_name: checkoutData.course.title,
        content_ids: [checkoutData.course._id],
        value: amount,
        currency: "INR",
      });

      const cashfree = await load({ mode: "sandbox" }); 

      const rawPhone = formData.phone.replace(/\D/g, '');

      const response = await axiosInstance.post(
        "/sale/salespage/create-cashfree-order",
        {
          amount: amount,
          currency: "INR",
          courseId: checkoutData.course._id,
          customer_details: {
            customer_name: formData.username, // Changed from username
            customer_email: formData.email,
            customer_phone: rawPhone, // Unformatted numbers only
          }
        }
      );

      if (!response.data.payment_session_id) {
        throw new Error("Invalid Payment Session ID");
      }

      ReactPixel.track("AddPaymentInfo", {
        content_name: checkoutData.course.title,
        content_ids: [checkoutData.course._id],
        value: amount,
        currency: "INR",
        payment_method: "Cashfree",
      });

      cashfree.checkout({
        paymentSessionId: response.data.payment_session_id,
        return_url: `${import.meta.env.VITE_FRONTEND_URL}/sale/payment-success?order_id=${response.data.cf_order_id}&courseId=${response.data.courseId}&gateway=cashfree`,
      });
    } catch (error) {
      toast.error("Cashfree Payment failed");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRazorpayPayment = async (amount) => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay. Check your internet connection.");
        return;
      }

      const response = await axiosInstance.post(
        "/sale/salespage/create-razorpay-order",
        {
          amount: amount,
          currency: "INR",
          courseId: checkoutData.course._id,
          customer_details: {
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
          },
        }
      );

      const { id: order_id, currency } = response.data.data || {};

      if (!order_id || !currency) {
        toast.error("Invalid Razorpay response: Order ID or Currency missing");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: "INR",
        order_id: order_id,
        name: import.meta.env.VITE_SKILLXERA_COMPANY_NAME,
        description: checkoutData.course.title,
        handler: function (response) {
          window.location.href = `/sale/payment-success?order_id=${order_id}&courseId=${courseId}&gateway=razorpay&razorpay_order_id=${response.razorpay_order_id}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_signature=${response.razorpay_signature}`;
        },
        prefill: {
          name: formData.username,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#F37254" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Razorpay Payment failed");
      console.error("Razorpay Error:", error);
    }
  };

  // Function to render HTML content safely
  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  if (checkoutData.loading) {
    return (
      <div className="flex justify-center items-center h-40">
    <Spinner />
  </div>
    );
  }

  if (checkoutData.error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Error: {checkoutData.error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {checkoutData.checkoutPage && (
        <div className="bg-gray-800 text-center py-6">
          <h1
            className="text-3xl font-bold"
            dangerouslySetInnerHTML={renderHTML(
              checkoutData.checkoutPage.topHeading
            )}
          />
        </div>
      )}

      <div className="p-6 md:p-12 max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start">
        <div className="md:w-1/2">
          {checkoutData.checkoutPage && (
            <>
              <h2
                className="text-xl font-semibold"
                dangerouslySetInnerHTML={renderHTML(
                  checkoutData.checkoutPage.subHeading
                )}
              />
            </>
          )}

          {checkoutData.checkoutPage?.checkoutImage && (
            <img
              src={`${BASE_URL}/uploads/${checkoutData.checkoutPage.checkoutImage}`}
              alt="Checkout"
              className="mt-4 rounded-lg shadow-lg w-full max-w-md bg-white"
            />
          )}

          {checkoutData.checkoutPage.lines &&
            checkoutData.checkoutPage.lines.map((line, index) => (
              <div
                key={index}
                className="mt-2"
                dangerouslySetInnerHTML={renderHTML(line)}
              />
            ))}
        </div>

        <div className="md:w-1/2 mt-6 md:mt-0 md:pl-10">
          <h3 className="text-yellow-400 text-lg font-semibold">
            Contact Information
          </h3>
          <form className="mt-4 space-y-4" onSubmit={handlePayment}>
            <input
              name="username"
              type="text"
              placeholder="Name"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-100 text-black"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-100 text-black"
              required
            />
            <PhoneInput
              name="phone"
              placeholder="  Phone"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              className="w-full px-4 py-2 border space-x-3 border-gray-600 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />

            <div className="flex gap-4 mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cashfree"
                  checked={paymentMethod === "cashfree"}
                  onChange={() => setPaymentMethod("cashfree")}
                  className="accent-yellow-400"
                />
                Cashfree
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  className="accent-yellow-400"
                />
                Razorpay
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 text-black py-2 rounded-md font-bold mt-4"
            >
               {isSubmitting ? 'Processing...' : `Pay Now ₹${checkoutData.course?.salesPrice}`}
            </button>
          </form>
        </div>
      </div>
      <ToasterHot />
    </div>
  );
};

export default PaymentPage;

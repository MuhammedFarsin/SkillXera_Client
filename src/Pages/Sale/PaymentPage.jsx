import { useState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js"; // Import correctly
import axiosInstance from "../../Connection/Axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ToasterHot from "../Common/ToasterHot";
import ReactPixel from "react-facebook-pixel";
import { loadRazorpayScript } from "../../Utils/RazorpayScript";


const PaymentPage = () => {
  const { courseId } = useParams();
  // const navigate = useNavigate();
  const BASE_URL = axiosInstance.defaults.baseURL;

  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cashfree"); // Default to Cashfree

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/sale/buy-course/course/${courseId}`
        );
        setCourse(response.data);
      } catch (error) {
        toast.error("Failed to fetch course details");
        console.error(error);
      }
    };
    fetchCourseDetails();
  }, [courseId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!course || !course.salesPrice) {
      return toast.error("Invalid course price");
    }

    const amount = Number(course.salesPrice);
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
    try {

      ReactPixel.track("InitiateCheckout", {
        content_name: course.title,
        content_ids: [course._id],
        value: amount,
        currency: "INR",
      });
      console.log('cashfree is loading')
      const cashfree = await load({ mode: "sandbox" });

      const response = await axiosInstance.post("/sale/salespage/create-cashfree-order", {
        amount: amount,
        currency: "INR",
        courseId: course._id,
        customer_details: {
          _id: `CF_${Date.now()}`,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
        },
      });
      console.log(response)
      if (!response.data.payment_session_id) {
        throw new Error("Invalid Payment Session ID");
      }

      ReactPixel.track("AddPaymentInfo", {
        content_name: course.title,
        content_ids: [course._id],
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
    }
  };

  const handleRazorpayPayment = async (amount) => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      console.log(scriptLoaded);
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay. Check your internet connection.");
        return;
      }
      let response;
      try {
        response = await axiosInstance.post("/sale/salespage/create-razorpay-order", {
          amount: amount,
          currency: "INR",
          courseId: course._id,
          customer_details: {
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
          },
        });
        console.log("✅ Razorpay API Response:", response);
      } catch (error) {
        console.error("❌ API Request Failed:", error);
      }

      console.log("🛠️ Razorpay API Response:", response);

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
        description: course.title,
        handler: function (response) {
         window.location.href = `/sale/payment-success?order_id=${order_id}&courseId=${courseId}&gateway=razorpay&razorpay_order_id=${response.razorpay_order_id}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_signature=${response.razorpay_signature}`;

          console.log("✅ Razorpay Payment Response:", response);
        },
        prefill: {
          name: formData.username,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#F37254" },
      };

      const razorpay = new window.Razorpay(options);
      console.log('this is the response',razorpay);

      razorpay.open();
    } catch (error) {
      toast.error("Razorpay Payment failed");
      console.error("❌ Razorpay Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gray-800 text-center py-6">
        <h1 className="text-3xl font-bold">
          Congrats! You&apos;re 1 Step Away from <br />
          <span className="text-yellow-400">FOZATO YOUTUBE AUTO SEO APP!</span>
        </h1>
      </div>
      <div className="p-6 md:p-12 max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start">
        <div className="md:w-1/2">
          <h2 className="text-xl font-semibold">
            Register before the deadline to unlock <br />
            <span className="text-yellow-400">
              bonuses worth Rs. 97,000 for FREE!
            </span>
          </h2>
          {course?.images?.length > 0 && (
            <img
              src={`${BASE_URL}${course.images[0]}`}
              alt={course.title}
              className="mt-4 rounded-lg shadow-lg"
            />
          )}
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
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-100 text-black"
              required
            />

            {/* Payment Method Selection */}
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
              Pay Now ₹{course?.salesPrice}
            </button>
          </form>
        </div>
      </div>
      <ToasterHot />
    </div>
  );
};

export default PaymentPage;

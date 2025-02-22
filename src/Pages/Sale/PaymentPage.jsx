import { useState, useEffect } from "react";
import { loadScript } from "../../Utils/LoadScript";
import axiosInstance from "../../Connection/Axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ToasterHot from "../Common/ToasterHot";
import phonePe from "../../assets/phonepe-logo.png"
import razorPay from "../../assets/razorpay-logo.png"
import LogoImg from "../../assets/logo.jpg"

const PaymentPage = () => {
  const { courseId } = useParams();
  const BASE_URL = axiosInstance.defaults.baseURL;
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    paymentMethod: "razorpay",
  });

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axiosInstance.get(`/sale/buy-course/course/${courseId}`);
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

    if (!course) {
      toast.error("Course details not available");
      return;
    }

    const isScriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!isScriptLoaded) {
      toast.error("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    try {
      const response = await axiosInstance.post("/payment/create-order", {
        amount: course.price * 100, // Convert to paise
        currency: "INR",
      });

      const { amount, id: order_id, currency } = response.data;

      const options = {
        // eslint-disable-next-line no-undef
        key: process.env.REACT_APP_RAZORPAY_KEY || "YOUR_RAZORPAY_KEY", // Use environment variable
        amount,
        currency,
        name: "Your Company",
        description: course.title,
        image: "https://yourlogo.com/logo.png",
        order_id,
        handler: async function (response) {
          try {
            await axiosInstance.post("/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment Successful!");
          } catch (error) {
            toast.error("Payment verification failed.",error);
          }
        },
        prefill: {
          name: formData.username,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#3182ce",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      toast.error("Payment initiation failed");
      console.error("Payment initiation failed", error);
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
            <span className="text-yellow-400">bonuses worth Rs. 97,000 for FREE!</span>
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
          <h3 className="text-yellow-400 text-lg font-semibold">Contact Information</h3>
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
            <h3 className="text-yellow-400 text-lg font-semibold">Choose Payment Method</h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 border p-2 rounded-lg cursor-pointer w-1/2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  onChange={handleChange}
                  className="w-5 h-5"
                  required
                />
                <img src={razorPay} alt="Razorpay" className="w-32 h-10 rounded-lg object-cover" />
              </label>
              <label className="flex items-center space-x-2 border p-2 rounded-lg cursor-pointer w-1/2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="phonepe"
                  onChange={handleChange}
                  className="w-5 h-5"
                  required
                />
                <img src={phonePe} alt="PhonePe" className="w-32 h-10 object-cover rounded-lg" />
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black py-2 rounded-md font-bold mt-4"
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>
      <div className="text-right p-4">
        <img
          src={LogoImg}
          alt="Powered by Systeme.io"
          className="w-32 mx-auto"
        />
      </div>
      <ToasterHot />
    </div>
  );
  
};

export default PaymentPage;

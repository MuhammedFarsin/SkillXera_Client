import { useState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js"; // Import correctly
import axiosInstance from "../../Connection/Axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ToasterHot from "../Common/ToasterHot";

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
  console.log(course)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCashfreePayment = async (e) => {
    e.preventDefault();

    if (!course || !course.price) {
      return toast.error("Invalid course price");
    }

    const amount = Number(course.price);
    if (isNaN(amount) || amount <= 0) {
      return toast.error("Invalid course pricing");
    }

    try {
      const cashfree = await load({ mode: "sandbox" }); // Load Cashfree SDK

      const response = await axiosInstance.post("/sale/create-cashfree-order", {
        amount: amount,
        currency: "INR",
        courseId : course._id,
        customer_details: {
          _id: `CF_${Date.now()}`,
          username : formData.username,
          email: formData.email,
          phone: formData.phone,
        },
      });

      console.log("Cashfree Response:", response.data);

      if (!response.data.payment_session_id) {
        throw new Error("Invalid Payment Session ID");
      }

      cashfree.checkout({
        paymentSessionId: response.data.payment_session_id,
        returnUrl: `http://localhost:5173/sale/payment-success?order_id=${response.data.cf_order_id}&courseId=${response.data.courseId}`,
      });
      
      
    } catch (error) {
      toast.error("Cashfree Payment failed");
      console.error("Error:", error.response?.data || error);
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
          <form className="mt-4 space-y-4" onSubmit={handleCashfreePayment}>
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
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black py-2 rounded-md font-bold mt-4"
            >
              Pay Now ₹{course?.price}
            </button>
          </form>
        </div>
      </div>
      <ToasterHot />
    </div>
  );
};

export default PaymentPage;

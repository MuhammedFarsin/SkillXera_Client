import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Lottie from "lottie-react";
import successAnimation from "../../assets/SuccessAnimation"; // ✅ JSON animation file
import TosterHot from "../Common/ToasterHot";
import axiosInstance from "../../Connection/Axios";
import ReactPixel from "react-facebook-pixel";
import { initFacebookPixel } from "../../utils/metaPixel";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id");
  const courseId = queryParams.get("courseId");

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    initFacebookPixel(); // ✅ Initialize Facebook Pixel

    if (!orderId) {
      toast.error("Invalid payment request! Order ID is missing.");
      navigate("/sale/payment-failed");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await axiosInstance.post("/sale/verify-cashfree-payment", {
          order_id: orderId,
          courseId,
        });

        if (response.status === 200 && response.data.status === "success") {
          setVerified(true);
          setPaymentDetails(response.data.payment);
          toast.success("Payment Verified!");

          // ✅ Track Facebook Pixel Event
          ReactPixel.track("Purchase", {
            value: response.data.payment.amount,
            currency: "INR",
            orderId,
          });
        } else {
          navigate(`/sale/buy-course/course/payment/${courseId}`)
        }
      } catch (error) {
        console.error("Verification Error:", error);
        toast.error("Error verifying payment");
        navigate(`/sale/buy-course/course/payment/${courseId}`);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/payment-success-bg.jpg')` }} // ✅ Add a relevant background image
    >
      <div className="p-8 bg-white shadow-xl rounded-lg text-center w-[400px] ">
        {loading ? (
          <p className="text-gray-700 text-lg font-semibold">Verifying payment...</p> 
        ) : verified ? (
          <>
            <Lottie animationData={successAnimation} className="w-60 h-60 mx-auto" loop={false} />
            <h2 className="text-2xl font-bold text-green-600 mt-4">Payment Successful!</h2>
            <p className="text-gray-700 mt-2">
              Thank you for your payment. Your Order ID is: <strong>{orderId}</strong>
            </p>
            {paymentDetails && (
              <div className="mt-4 p-4 border border-green-300 rounded-md text-left bg-green-50">
                <h3 className="text-lg font-semibold text-green-800">Payment Details:</h3>
                <p className="text-green-700"><strong>Amount:</strong> ₹{paymentDetails.amount}</p>
                <p className="text-green-700"><strong>Email:</strong> {paymentDetails.email}</p>
                <p className="text-green-700"><strong>Phone:</strong> {paymentDetails.phone}</p>
              </div>
            )}
            <button
              className="mt-5 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>
          </>
        ) : (
          <h2 className="text-2xl font-bold text-red-600">Payment Verification Failed</h2>
        )}
      </div>
      <TosterHot />
    </div>
  );
};

export default PaymentSuccess;

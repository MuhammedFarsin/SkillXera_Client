import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Lottie from "lottie-react";
import successAnimation from "../../assets/SuccessAnimation";
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
  const email = queryParams.get("email");

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [resetLink, setResetLink] = useState("");

  useEffect(() => {
    initFacebookPixel();

    if (!orderId) {
      toast.error("Invalid payment request! Order ID is missing.");
      navigate("/sale/payment-failed");
      return;
    }

    // ✅ Check if payment is already verified
    const storedPayment = localStorage.getItem(`verifiedPayment_${orderId}`);

    if (storedPayment) {
      const parsedData = JSON.parse(storedPayment);
      setVerified(true);
      setPaymentDetails(parsedData);
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await axiosInstance.post("/sale/verify-cashfree-payment", {
          order_id: orderId,
          courseId,
          email,
        });

        if (response.status === 200 && response.data.status === "success") {
          setVerified(true);
          setPaymentDetails(response.data.payment);
          setUserDetails(response.data.user);
          setResetLink(response.data.resetLink || ""); // ✅ Store reset link
          toast.success("Payment Verified!");

          // ✅ Store the verified payment data
          localStorage.setItem(
            `verifiedPayment_${orderId}`,
            JSON.stringify(response.data.payment)
          );

          // ✅ Track Facebook Pixel Event
          ReactPixel.track("Purchase", {
            value: response.data.payment.amount,
            currency: "INR",
            orderId,
          });

          // ✅ Prevent Back Navigation
          window.history.pushState(null, "", window.location.href);
          window.addEventListener("popstate", preventBackNavigation);
        } else if (response.status === 201) {
          toast.success(response.data.message);
        } else {
          navigate(`/sale/buy-course/course/payment/${courseId}`);
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

    return () => {
      window.removeEventListener("popstate", preventBackNavigation);
    };
  }, []);

  // ✅ Function to Prevent Back Navigation
  const preventBackNavigation = () => {
    window.history.pushState(null, "", window.location.href);
  };

  useEffect(() => {
    if (verified) {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", preventBackNavigation);
    }
    return () => {
      window.removeEventListener("popstate", preventBackNavigation);
    };
  }, [verified]);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/payment-success-bg.jpg')` }}
    >
      <div className="p-8 bg-white shadow-xl rounded-lg text-center w-[400px]">
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
            {/* ✅ Button Based on Password Status */}
            {userDetails?.passwordResetToken ? (
              <button
                className="mt-5 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={() => window.location.href = resetLink}
              >
                Set Your Password
              </button>
            ) : (
              <button
                className="mt-5 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
                onClick={() => navigate("/home")} // ✅ Navigate to dashboard
              >
                Go to Dashboard
              </button>
            )}
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

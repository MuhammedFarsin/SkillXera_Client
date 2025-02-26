import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import TosterHot from "../Common/ToasterHot"
import axiosInstance from "../../Connection/Axios";

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
    if (!orderId) {
      toast.error("Invalid payment request! Order ID is missing.");
      navigate("/sale/payment-failed");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await axiosInstance.post("/sale/verify-cashfree-payment", {
          order_id: orderId,
          courseId : courseId
          
        });
        console.log(response)
        if (response.status === 200) {
          setVerified(true);
          setPaymentDetails(response.data.paymentDetails); // Store payment details
          toast.success("Payment Verified!");
        } else {
          toast.error("Payment verification failed");
          navigate("/sale/payment-failed");
        }
      } catch (error) {
        console.error("Verification Error:", error);
        toast.error("Error verifying payment");
        navigate("/sale/payment-failed");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white shadow-md rounded-lg text-center">
        {loading ? (
          <p className="text-gray-700">Verifying payment...</p>
        ) : verified ? (
          <>
            <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-gray-700 mt-2">
              Thank you for your payment. Your Order ID is: <strong>{orderId}</strong>
            </p>
            {paymentDetails && (
              <div className="mt-4 p-4 border rounded-md text-left">
                <h3 className="text-lg font-semibold">Payment Details:</h3>
                <p><strong>Amount:</strong> ₹{paymentDetails.amount}</p>
                <p><strong>Payment Method:</strong> {paymentDetails.paymentMethod}</p>
                <p><strong>Email:</strong> {paymentDetails.email}</p>
                <p><strong>Phone:</strong> {paymentDetails.phone}</p>
              </div>
            )}
          </>
        ) : (
          <h2 className="text-2xl font-bold text-red-600">Payment Verification Failed</h2>
        )}
      </div>
      <TosterHot/>
    </div>
  );
};

export default PaymentSuccess;

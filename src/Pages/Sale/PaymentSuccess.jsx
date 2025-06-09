import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnimation from "../../assets/SuccessAnimation";
import axiosInstance from "../../Connection/Axios";
import ToasterHot from "../Common/ToasterHot";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const orderId = queryParams.get("order_id");
  const productId = queryParams.get("productId");
  const gateway = queryParams.get("gateway");
  const type = queryParams.get("type");

  const [paymentDetails, setPaymentDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [resetLink, setResetLink] = useState("");
  const [thankYouPage, setThankYouPage] = useState(null);

  useEffect(() => {
    // 1. Find ALL keys that might contain payment data
    const allKeys = Object.keys(localStorage);
    console.log("All localStorage keys:", allKeys);

    // 2. Find the key that contains this orderId
    const paymentKey = allKeys.find((key) => {
      try {
        const item = localStorage.getItem(key);
        if (!item) return false;

        const data = JSON.parse(item);
        return (
          key.includes("verifiedPayment") || // matches any payment key
          data?.orderId === orderId || // matches orderId in data
          data?.payment?.orderId === orderId // matches nested orderId
        );
      } catch {
        return false;
      }
    });

    if (paymentKey) {
      console.log("Found matching key:", paymentKey);
      const storedData = localStorage.getItem(paymentKey);

      try {
        const parsedData = JSON.parse(storedData);
        const paymentData = parsedData.payment || parsedData;
        const userData = parsedData.user || paymentData.user || null;
        const link = parsedData.resetLink || paymentData.resetLink || "";

        setPaymentDetails(paymentData);
        setUserDetails(userData);
        setResetLink(link);
      } catch (error) {
        console.error("Error parsing payment data:", error);
      }
    } else {
      console.error(`No payment data found for order ${orderId}`);
      console.log("Available keys:", allKeys);
      console.log("Sample data:", localStorage.getItem(allKeys[0]));
    }
  }, [orderId]);

  useEffect(() => {
    const storedPayment = localStorage.getItem(`verifiedPayment_${orderId}`);
    console.log(storedPayment);
    if (storedPayment) {
      const parsedData = JSON.parse(storedPayment);

      setPaymentDetails(parsedData); // Since payment data is at root
      setUserDetails(parsedData.user);
      setResetLink(parsedData.resetLink);
    }
    console.log(resetLink);

    const fetchThankYouPage = async () => {
      try {
        if (productId) {
          const response = await axiosInstance.get(
            `/sale/get-thank-you-page/${type}/${productId}`
          );
          setThankYouPage(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching thank you page:", error);
      }
    };

    fetchThankYouPage();
  }, [orderId, productId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        {/* Animation + Header */}
        <div className="text-center mb-8">
          <Lottie
            animationData={successAnimation}
            className="w-48 h-48 mx-auto"
            loop={false}
          />
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-700">
            Your order has been placed successfully.
          </p>
          <p className="text-gray-500 mt-1">
            Order ID: <span className="font-medium">{orderId}</span>
          </p>
        </div>

        {/* Payment Details */}
        {paymentDetails && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-green-700 mb-4">
              Payment Summary
            </h2>
            <div className="space-y-2 text-sm text-green-800">
              <p>
                <strong>Amount:</strong> ₹{paymentDetails.amount}
              </p>
              <p>
                <strong>Email:</strong> {paymentDetails.email}
              </p>
              <p>
                <strong>Phone:</strong> {paymentDetails.phone}
              </p>
              <p>
                <strong>Gateway:</strong> {gateway}
              </p>
            </div>
          </div>
        )}

        {/* Thank You Content */}
        {thankYouPage && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              {thankYouPage.title}
            </h2>
            {thankYouPage.note && (
              <div
                className="prose max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: thankYouPage.note }}
              />
            )}
            {thankYouPage.embedCode && (
              <div
                className="mt-4"
                dangerouslySetInnerHTML={{ __html: thankYouPage.embedCode }}
              />
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center mt-6">
          {userDetails?.passwordResetToken ? (
            <button
              onClick={() => (window.location.href = resetLink)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Set Your Password
            </button>
          ) : (
            <button
              onClick={() => navigate("/home")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>

      <ToasterHot />
    </div>
  );
};

export default PaymentSuccess;

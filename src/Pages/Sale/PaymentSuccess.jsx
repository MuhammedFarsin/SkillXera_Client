import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id");

  useEffect(() => {
    console.log("Payment Successful for Order ID:", orderId);
  }, [orderId]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white shadow-md rounded-lg text-center">
        <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
        <p className="text-gray-700 mt-2">
          Thank you for your payment. Your Order ID is: <strong>{orderId}</strong>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;

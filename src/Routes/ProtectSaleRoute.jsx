import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Check if payment verification exists in localStorage
  const orderId = new URLSearchParams(location.search).get("order_id");
  const isPaymentVerified = localStorage.getItem(`verifiedPayment_${orderId}`);

  // 🔥 Prevent Back Navigation
  useEffect(() => {
    const handleBackButton = () => {
      navigate(location.pathname, { replace: true }); // Stay on the same page
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate, location]);

  // 🔴 Redirect if payment is not verified
  if (!isPaymentVerified) {
    return <Navigate to="/sale/buy-course/course/payment" replace />;
  }

  return children;
};

export default ProtectedRoute;

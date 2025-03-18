import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children }) {
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  console.log(auth)
  useEffect(() => {
    if (auth) {
      window.history.replaceState(null, "", location.pathname);
    }
  }, [auth, location.pathname]);

  return auth ? children : <Navigate to="/" />;
}

export default ProtectedRoute;

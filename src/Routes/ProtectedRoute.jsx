import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children }) {
  const auth = useSelector((state) => state.auth.isAuthenticated);
  

  return auth ? children : <Navigate to="/" />;
}

export default ProtectedRoute;

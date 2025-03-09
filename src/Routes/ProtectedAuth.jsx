import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


// eslint-disable-next-line react/prop-types
function ProtectedAuth({ children }) {
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.user);
  console.log(user.isAdmin)
  return auth ? (
    user.isAdmin ? (
      <Navigate to={"/admin/dashboard"} />
    ) : (
      <Navigate to={"/home"} />
    )
  ) : (
    children
  );
}
export default ProtectedAuth;

import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("access");

  if (!token || token === "undefined") {
    return <Navigate to="/" replace />;
  }

  try {

    const decoded = jwtDecode(token);

    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      return <Navigate to="/" replace />;
    }

  } catch (error) {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
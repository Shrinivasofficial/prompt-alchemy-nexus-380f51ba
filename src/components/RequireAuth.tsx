
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user === undefined) {
    // Still loading user (optional: show loader)
    return null;
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return children;
}

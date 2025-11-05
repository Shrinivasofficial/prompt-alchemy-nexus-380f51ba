import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ✅ Step 1: Wait until auth finishes loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // ✅ Step 2: Once loading is done, check if user exists
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // ✅ Step 3: If logged in, show protected content
  return children;
}

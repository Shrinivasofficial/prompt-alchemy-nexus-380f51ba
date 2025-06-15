
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";

export default function MainNavbar({ signOut }: { signOut: () => void }) {
  const { user } = useAuth();

  return (
    <nav className="hidden md:flex items-center gap-6">
      <Link to="/" className="text-sm font-medium hover-underline">
        Home
      </Link>
      <Link to="/dashboard" className="text-sm font-medium hover-underline">
        Dashboard
      </Link>
      <Link to="/about" className="text-sm font-medium hover-underline">
        About
      </Link>
      <Link to="/contact" className="text-sm font-medium hover-underline">
        Contact
      </Link>
      {/* Add Profile link for logged-in users */}
      {user && (
        <Link to="/profile" className="text-sm font-medium hover-underline">
          Profile
        </Link>
      )}
    </nav>
  );
}

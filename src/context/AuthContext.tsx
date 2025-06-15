
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextProps {
  user: { email: string } | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  signIn: async () => false,
  signUp: async () => false,
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[email] && users[email].password === password) {
      setUser({ email });
      localStorage.setItem("user", JSON.stringify({ email }));
      return true;
    }
    return false;
  };

  const signUp = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[email]) {
      return false;
    }
    users[email] = { password };
    localStorage.setItem("users", JSON.stringify(users));
    setUser({ email });
    localStorage.setItem("user", JSON.stringify({ email }));
    return true;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


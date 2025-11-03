import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean; // ✅ added
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: true, // ✅ default to true
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: () => {},
});

// Password validation helper
const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (password.length < 8)
    return { isValid: false, error: "Password must be at least 8 characters long" };
  if (!/(?=.*[a-z])/.test(password))
    return { isValid: false, error: "Password must contain at least one lowercase letter" };
  if (!/(?=.*[A-Z])/.test(password))
    return { isValid: false, error: "Password must contain at least one uppercase letter" };
  if (!/(?=.*\d)/.test(password))
    return { isValid: false, error: "Password must contain at least one number" };
  if (!/(?=.*[@$!%*?&])/.test(password))
    return { isValid: false, error: "Password must contain at least one special character (@$!%*?&)" };
  return { isValid: true };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // ✅ added

  useEffect(() => {
    const initAuth = async () => {
      // 1️⃣ Try restoring session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initAuth();

    // 2️⃣ Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    setSession(data.session);
    setUser(data.user);
    return { success: true };
  };

  const signUp = async (email: string, password: string) => {
    const validation = validatePassword(password);
    if (!validation.isValid) return { success: false, error: validation.error };

    const redirectUrl = `${window.location.origin}/`;
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    if (error) return { success: false, error: error.message };
    setSession(data.session);
    setUser(data.user);
    return { success: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextProps {
  user: { id: string; email: string } | null;
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
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    // Listen to Auth changes and set the user state accordingly.
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(
        session?.user
          ? { id: session.user.id, email: session.user.email ?? "" }
          : null
      );
    });

    // On mount, fetch the current session.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(
        session?.user
          ? { id: session.user.id, email: session.user.email ?? "" }
          : null
      );
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error && data?.user) {
      setUser({
        id: data.user.id,
        email: data.user.email ?? ""
      });
      return true;
    }
    return false;
  };

  const signUp = async (email: string, password: string) => {
    // Always set a redirect URL for email confirmation
    const redirectUrl = `${window.location.origin}/`;
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    if (!error && data?.user) {
      setUser({
        id: data.user.id,
        email: data.user.email ?? ""
      });
      return true;
    }
    return false;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("raaga_auth");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setIsLoggedIn(true);
        setUserName(data.name || data.email || "");
      } catch {
        // ignore
      }
    }
  }, []);

  const login = useCallback((email: string, name?: string) => {
    localStorage.setItem("raaga_auth", JSON.stringify({ email, name: name || email }));
    setIsLoggedIn(true);
    setUserName(name || email);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("raaga_auth");
    setIsLoggedIn(false);
    setUserName("");
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

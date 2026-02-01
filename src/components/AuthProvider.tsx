"use client"

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";


export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role?: "user" | "admin"; 
};


type AuthState =
  | { status: "loading"; user: null }
  | { status: "unauthenticated"; user: null }
  | { status: "authenticated"; user: User };


type AuthContextType = AuthState & {
  login: (user: User) => void;
  logout: () => void;
};


const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading", user: null });

  
  const login = (user: User) => setState({ status: "authenticated", user });
  const logout = () => setState({ status: "unauthenticated", user: null });

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.user) login(data.user);
        else logout();
      })
      .catch(() => logout());
  }, []);


  const value = useMemo(() => ({ ...state, login, logout }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

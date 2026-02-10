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

  
  const login = (user: User) => setState({ status: "authenticated", user });//login menja state 
  const logout = () => setState({ status: "unauthenticated", user: null });//logout menja state

  useEffect(() => {         //cookie se automatski salje
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.user) login(data.user); //ako vrati user-a onda odradi login
        else logout();
      })
      .catch(() => logout());
  }, []);


  const value = useMemo(() => ({ ...state, login, logout }), [state]); 
  //sprečava nepotrebne rerendere,  context vrednost se menja samo kad se state promeni


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

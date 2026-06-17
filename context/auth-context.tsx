"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import type { User } from "@/app/types/user";
import { getCurrentUser } from "@/services/auth.service";

export type AuthContextType = {
  user: User | null;
  loading: boolean;

  setUser: Dispatch<SetStateAction<User | null>>;

  refreshUser: () => Promise<void>;

  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");

    setUser(null);

    window.location.href = "/login";
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
    } catch {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

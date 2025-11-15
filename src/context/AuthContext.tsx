// Define the Auth Context Interface

import { createContext, useContext, useState, useEffect } from "react";

// User : email, name, theme, id (unique)
interface User {
  id: string;
  email: string;
  name: string;
  theme: "light" | "dark";
}

// AuthContext : Login, register, Logout, user, password, isAuthenticated, isLoading
interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContext | undefined>(undefined);

// Custom Hook for using the Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // LOGIC 5: Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Validate token by fetching user profile
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  // LOGIC 6: Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      const api = await import("../utils/api").then((m) => m.default);
      const response = await api.get("/api/auth/me");
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setIsLoading(false);
    }
  };

  // LOGIC 7: Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const api = await import("../utils/api").then((m) => m.default);
      const response = await api.post("/api/auth/login", { email, password });

      // Save tokens
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      // Set user
      setUser(response.data.user);
    } finally {
      setIsLoading(false);
    }
  };

  // LOGIC 8: Register function
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const api = await import("../utils/api").then((m) => m.default);
      const response = await api.post("/api/auth/register", {
        email,
        password,
        name,
      });

      // Save tokens
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      // Set user
      setUser(response.data.user);
    } finally {
      setIsLoading(false);
    }
  };

  // LOGIC 9: Logout function
  const logout = async () => {
    try {
      const api = await import("../utils/api").then((m) => m.default);
      await api.post("/api/auth/logout");
    } finally {
      // Clear local state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  };

  const value: AuthContext = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const[isLoggedIn , setIsLoggedIn] = useState(false);
  const isAuthenticated = Boolean(user || token);
  const isAdmin = user?.role === "admin";

  const checkAuth = async () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (res.token) {
        setToken(res.token);
        localStorage.setItem("token", res.token);
      }
      if (res.user) {
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      }

      setIsLoggedIn(true);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ username, email, password, role }) => {
    setLoading(true);
    try {
      const res = await authService.register({ username, email, password, role });
      return res;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (tokenParam) => {
    return await authService.verifyEmail(tokenParam);
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        checkAuth,
        verifyEmail,
        setIsLoggedIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
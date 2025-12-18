import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // data user
  const [loading, setLoading] = useState(true); // cek token awal

  //  cek token saat app pertama kali jalan
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    // ambil profile user dari backend
    apiFetch("/auth/me")
      .then((res) => {
        if (res.success) {
          setUser(res.data);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  //  LOGIN
  const login = async (email, password) => {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  //  LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        role: user?.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

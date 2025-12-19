import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // data user
  const [loading, setLoading] = useState(true); // cek token awal

  //  cek token saat app pertama kali jalan
  // AuthContext.jsx
useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    setUser(null);
    setLoading(false);
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    
    setUser({
      id: payload.user_id,
      email: payload.email,
      role: payload.role,
    });
  } catch (err) {
    localStorage.removeItem("token");
    setUser(null);
  } finally {
    setLoading(false);
  }
}, []);


  //  LOGIN
  const login = async (email, password) => {
    const res = await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!res.success) {
      throw new Error(res.error || "Login gagal");
    }

    // Backend mengembalikan token di root response, bukan di res.data
    localStorage.setItem("token", res.token);
    setUser(res.data);
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
        setUser,
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

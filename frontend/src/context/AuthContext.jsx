import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // data user
  const [loading, setLoading] = useState(true); // cek token awal

  // Helper function to decode JWT
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  // cek token saat app pertama kali jalan
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    // Attempt to fetch user from /api/auth/me
    const fetchUserString = async () => {
      try {
        const res = await apiFetch("/api/auth/me");
        if (res.success) {
          setUser(res.data);
        } else {
          throw new Error("Auth me failed");
        }
      } catch (error) {
        console.warn("Auth check failed, trying fallback...", error);
        
        // Fallback: Check Role from Token
        const decoded = parseJwt(token);
        if (decoded && decoded.role === "seeker") {
          try {
            // Seeker Fallback: /api/profile/me
            // Note: /api/profile/me results in data: { id, name, email, role, profile: {...} }
            const resProfile = await apiFetch("/api/profile/me");
            if (resProfile.success) {
               // We reconstruct a user object compatible with what auth/me would return
               setUser({
                 id: resProfile.data.id,
                 name: resProfile.data.name,
                 email: resProfile.data.email,
                 role: resProfile.data.role,
                 // profile: resProfile.data.profile // we can store this if needed, but Context usually just needs basic info
               });
               return; // Success
            }
          } catch (e2) {
             console.error("Fallback profile fetch failed", e2);
          }
        } else if (decoded && decoded.role === 'employer') {
            // Employer Fallback: We don't have a reliable endpoint for Name/Email if auth/me is dead.
            // We'll set what we have from the token.
             setUser({
               id: decoded.user_id, // ensure this matches token payload key
               role: decoded.role,
               email: "", // unknown
               name: "Employer", // unknown
             });
             return;
        }

        // If all fails:
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserString();
  }, []);

  //  LOGIN
  const login = async (email, password) => {
    const res = await apiFetch("/api/login", {
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

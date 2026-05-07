import { createContext, useContext, useMemo, useState } from "react";
import { authService } from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.getSession());
  const [loading, setLoading] = useState(false);

  async function login(credentials) {
    setLoading(true);
    try {
      const nextSession = await authService.login(credentials);
      setSession(nextSession);
      return nextSession;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    authService.logout();
    setSession(null);
    window.history.pushState({}, "", "/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  const value = useMemo(
    () => ({
      user: session?.user || null,
      token: session?.token || null,
      isAuthenticated: Boolean(session?.token),
      loading,
      login,
      logout,
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

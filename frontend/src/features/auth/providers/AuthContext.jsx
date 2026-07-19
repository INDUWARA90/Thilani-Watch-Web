import { useCallback, useEffect, useMemo, useState } from "react";

import { authApi } from "@/features/auth/api/authApi";
import { setAuthToken } from "@/shared/api/apiClient";
import { AuthContext } from "./authContextValue";

import {
  clearStoredAuth,
  loadStoredAuth,
  saveStoredAuth,
} from "@/features/auth/lib/authStorage";

export const AuthProvider = ({ children }) => {
  const [initialToken] = useState(() => loadStoredAuth().token);
  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  const saveAuth = useCallback((auth) => {
    setToken(auth.token);
    setUser(auth.user);
    setAuthToken(auth.token);
    saveStoredAuth(auth);
  }, []);

  const clearAuth = useCallback(() => {
    setToken("");
    setUser(null);
    setAuthToken("");
    clearStoredAuth();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const restoreAuth = async () => {
      if (!initialToken) {
        setIsRestoring(false);
        return;
      }

      setAuthToken(initialToken);

      try {
        const currentUser = await authApi.getCurrentUser();

        if (isMounted) {
          setUser(currentUser);
          saveStoredAuth({ token: initialToken });
        }
      } catch {
        if (isMounted) {
          clearAuth();
        }
      } finally {
        if (isMounted) {
          setIsRestoring(false);
        }
      }
    };

    restoreAuth();

    return () => {
      isMounted = false;
    };
  }, [clearAuth, initialToken]);

  const register = useCallback(async (payload) => {
    const auth = await authApi.register(payload);
    saveAuth(auth);
    return auth;
  }, [saveAuth]);

  const login = useCallback(async (payload) => {
    const auth = await authApi.login(payload);
    saveAuth(auth);
    return auth;
  }, [saveAuth]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const updateProfile = useCallback(async (payload) => {
    const updatedUser = await authApi.updateProfile(payload);

    setUser(updatedUser);
    return updatedUser;
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "admin",
      isRestoring,
      register,
      login,
      logout,
      updateProfile,
      clearAuth,
    }),
    [
      clearAuth,
      isRestoring,
      login,
      logout,
      register,
      token,
      updateProfile,
      user,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

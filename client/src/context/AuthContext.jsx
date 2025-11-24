import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { loginRequest, registerRequest, meRequest, logoutRequest } from '../services/api.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'lms_token';
const REFRESH_KEY = 'lms_refresh';
const USER_KEY = 'lms_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem(REFRESH_KEY));
  const [loading, setLoading] = useState(false);

  const logout = useCallback(async () => {
    const storedRefresh = localStorage.getItem(REFRESH_KEY);
    if (storedRefresh) {
      try {
        await logoutRequest(storedRefresh);
      } catch (error) {
        console.error('Failed to revoke refresh token', error);
      }
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token || user) return;

    (async () => {
      try {
        setLoading(true);
        const profile = await meRequest();
        setUser(profile);
      } catch (error) {
        console.error('Failed to hydrate session', error);
        await logout();
      } finally {
        setLoading(false);
      }
    })();
  }, [token, user, logout]);

  const persistSession = (authPayload) => {
    localStorage.setItem(TOKEN_KEY, authPayload.tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, authPayload.tokens.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authPayload.user));
    setToken(authPayload.tokens.accessToken);
    setRefreshToken(authPayload.tokens.refreshToken);
    setUser(authPayload.user);
  };

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    persistSession(response);
    return response.user;
  };

  const register = async (data) => {
    const response = await registerRequest(data);
    persistSession(response);
    return response.user;
  };

  const value = useMemo(
    () => ({ user, token, refreshToken, login, register, logout, loading, isAuthenticated: Boolean(user) }),
    [user, token, refreshToken, loading, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};


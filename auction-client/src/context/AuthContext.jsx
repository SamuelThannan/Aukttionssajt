import { createContext, useCallback, useMemo, useState } from 'react';
import { loginUser, registerUser } from '../api/userApi';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'auction-user';

function readStoredUser() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const saveUser = useCallback((loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
  }, []);

  const login = useCallback(
    async (credentials) => saveUser(await loginUser(credentials)),
    [saveUser]
  );

  const register = useCallback(
    async (newUser) => saveUser(await registerUser(newUser)),
    [saveUser]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, isLoggedIn: user !== null, login, register, logout }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

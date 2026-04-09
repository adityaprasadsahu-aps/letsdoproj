import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'auth_user';

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  // Call this on successful login
  const login = (userId, fullName) => {
    const userData = { userId, fullName };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  // Call this on logout
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('cart_items');
    setUser(null);
  };

  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

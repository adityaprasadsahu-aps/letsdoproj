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
  const login = (userId, fullName, isAdmin = false, address = null) => {
    const userData = { userId, fullName, isAdmin, address };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const updateUser = (updates) => {
    const newData = { ...user, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setUser(newData);
  };

  // Call this on logout
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('cart_items');
    setUser(null);
  };

  const isLoggedIn = user !== null;
  const isAdmin = user?.isAdmin === true;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

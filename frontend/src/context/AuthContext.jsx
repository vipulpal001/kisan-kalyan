import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('kisan_user');
    const token = localStorage.getItem('kisan_token');
    
    if (savedUser && token && token !== 'demo-kisan-token-12345') {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('kisan_user');
        localStorage.removeItem('kisan_token');
        setUser(null);
      }
    } else {
      // Clean any stale or mock tokens
      localStorage.removeItem('kisan_user');
      localStorage.removeItem('kisan_token');
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('kisan_token', userData.token);
    localStorage.setItem('kisan_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('kisan_token');
    localStorage.removeItem('kisan_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      isAuthenticated: !!user && !!localStorage.getItem('kisan_token') 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      login: () => {},
      logout: () => {},
      loading: false,
      isAuthenticated: false,
    };
  }
  return context;
};

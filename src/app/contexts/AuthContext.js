// app/contexts/AuthContext.js
'use client';

import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading', 'authenticated', 'unauthenticated'

  useEffect(() => {
    async function loadUserFromCookies() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const { user } = await res.json();
          setUser(user);
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      } catch (error) {
        setStatus('unauthenticated');
      }
    }
    loadUserFromCookies();
  }, []);

  return (
    <AuthContext.Provider value={{ user, status }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
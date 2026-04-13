import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('bb_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('bb_token'));
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('bb_user', JSON.stringify(data.user));
      localStorage.setItem('bb_token', data.token);
      showToast('Logged in successfully', 'success');
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', payload);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('bb_user', JSON.stringify(data.user));
      localStorage.setItem('bb_token', data.token);
      showToast('Account created', 'success');
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bb_user');
    localStorage.removeItem('bb_token');
    showToast('Logged out', 'info');
  };

  useEffect(() => {
    // placeholder for future auto-refresh logic
  }, []);

  const toastTone =
    toast?.type === 'success'
      ? 'bg-emerald-600'
      : toast?.type === 'error'
      ? 'bg-rose-600'
      : 'bg-slate-900/90';

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, toast, showToast }}
    >
      {children}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded-2xl px-4 py-2 text-xs font-medium text-white shadow-xl shadow-slate-900/25 ${toastTone}`}
        >
          {toast.message}
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


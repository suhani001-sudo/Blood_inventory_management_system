import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const onChange = (e) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (res.success) {
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'hospital') navigate('/hospital/dashboard');
      else navigate('/user/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 py-10">
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="bg-white rounded-3xl p-8 shadow-xl shadow-[#E21B2F]/10 border border-[#FFE8EC]/50 w-full max-w-md"
        >
          <div className="flex flex-col items-center mb-6">
            <img 
              src="/images/Untitled design.png" 
              alt="BloodLink" 
              className="w-20 h-20 object-contain mb-4"
            />
            <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900 text-center">
              Welcome to BloodLink
            </h1>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Sign in to manage blood inventory and save lives
            </p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@hospital.com"
                value={form.email}
                onChange={onChange}
                required
                className="w-full rounded-2xl border border-[#FFE8EC] bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition-all focus:border-[#E21B2F] focus:bg-white focus:ring-2 focus:ring-[#E21B2F]/20"
              />
            </div>

            <PasswordInput
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={onChange}
              required
              label="Password"
            />

            <button
              type="submit"
              disabled={loading}
              className="relative mt-6 inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-[#E21B2F] px-4 py-3 text-sm font-medium text-white shadow-lg shadow-[#E21B2F]/25 transition-all hover:bg-[#C91A2C] hover:shadow-xl hover:shadow-[#E21B2F]/35 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="relative">
                {loading ? 'Signing in...' : 'Sign In'}
              </span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-xs text-gray-500">
              Don&apos;t have an account?
            </span>
            <Link
              to="/register"
              className="ml-1 text-xs font-medium text-[#E21B2F] hover:text-[#C91A2C] transition-colors"
            >
              Create account
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
          className="pointer-events-none hidden flex-1 items-center justify-center lg:flex"
        >
          <div className="bg-gradient-to-br from-[#E21B2F] to-[#FF6B6B] rounded-3xl p-8 text-white shadow-2xl w-full max-w-md">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-lg">
                <span className="text-3xl">🩸</span>
              </div>
              <div>
                <div className="font-display text-2xl font-bold tracking-tight">
                  BloodLink
                </div>
                <div className="mt-2 text-sm text-white/90">
                  Modern Blood Bank Management System
                </div>
              </div>
              <div className="space-y-2 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span>Real-time inventory tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span>Multi-role dashboard access</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span>Secure request management</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;


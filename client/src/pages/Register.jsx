import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    bloodGroup: '',
    organizationName: '',
  });

  const onChange = (e) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (payload.role !== 'user') payload.bloodGroup = undefined;
    if (payload.role !== 'hospital') payload.organizationName = undefined;

    const res = await register(payload);
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
              Join BloodLink
            </h1>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Create your account to start managing blood inventory
            </p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Full name</label>
              <input
                name="name"
                placeholder="Dr. Jane Doe"
                value={form.name}
                onChange={onChange}
                required
                className="w-full rounded-2xl border border-[#FFE8EC] bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition-all focus:border-[#E21B2F] focus:bg-white focus:ring-2 focus:ring-[#E21B2F]/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={onChange}
                required
                className="w-full rounded-2xl border border-[#FFE8EC] bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition-all focus:border-[#E21B2F] focus:bg-white focus:ring-2 focus:ring-[#E21B2F]/20"
              />
            </div>

            <PasswordInput
              name="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={onChange}
              required
              minLength={6}
              label="Password"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={onChange}
                className="w-full rounded-2xl border border-[#FFE8EC] bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition-all focus:border-[#E21B2F] focus:bg-white focus:ring-2 focus:ring-[#E21B2F]/20"
              >
                <option value="admin">Admin</option>
                <option value="hospital">Hospital</option>
                <option value="user">User / Requester</option>
              </select>
            </div>

            {form.role === 'user' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Blood group
                </label>
                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={onChange}
                  required
                  className="w-full rounded-2xl border border-[#FFE8EC] bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition-all focus:border-[#E21B2F] focus:bg-white focus:ring-2 focus:ring-[#E21B2F]/20"
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            )}

            {form.role === 'hospital' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Organization name
                </label>
                <input
                  name="organizationName"
                  placeholder="City Hospital"
                  value={form.organizationName}
                  onChange={onChange}
                  required
                  className="w-full rounded-2xl border border-[#FFE8EC] bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition-all focus:border-[#E21B2F] focus:bg-white focus:ring-2 focus:ring-[#E21B2F]/20"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="relative mt-6 inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-[#E21B2F] px-4 py-3 text-sm font-medium text-white shadow-lg shadow-[#E21B2F]/25 transition-all hover:bg-[#C91A2C] hover:shadow-xl hover:shadow-[#E21B2F]/35 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="relative">
                {loading ? 'Creating account...' : 'Create Account'}
              </span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-xs text-gray-500">
              Already have an account?
            </span>
            <Link
              to="/login"
              className="ml-1 text-xs font-medium text-[#E21B2F] hover:text-[#C91A2C] transition-colors"
            >
              Sign in
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
          className="pointer-events-none hidden flex-1 flex-col gap-4 lg:flex"
        >
          <div className="bg-gradient-to-br from-[#E21B2F] to-[#FF6B6B] rounded-3xl p-8 text-white shadow-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight mb-4">
              Built for Modern Blood Banks
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">🏥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Multi-Role Access</h3>
                  <p className="text-xs text-white/80 mt-1">Admins, hospitals, and users collaborate seamlessly</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Real-time Inventory</h3>
                  <p className="text-xs text-white/80 mt-1">Track blood units and availability instantly</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">✅</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Smart Requests</h3>
                  <p className="text-xs text-white/80 mt-1">Streamlined approval workflow for blood requests</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;


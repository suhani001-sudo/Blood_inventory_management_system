import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Droplets, Heart, ArrowRight } from 'lucide-react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';

const UserDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [invRes, reqRes] = await Promise.all([
        api.get('/inventory'),
        api.get('/request'),
      ]);
      setInventory(invRes.data);
      setRequests(reqRes.data);
    };
    load().catch((err) => console.error(err));
  }, []);

  const totalUnits = inventory.reduce(
    (sum, i) => sum + Math.max(i.available || 0, 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-gray-900">
          User dashboard
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          See global availability, track your blood requests, and save lives by donating.
        </p>
      </div>

      {/* Donate Blood Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#E21B2F] to-[#C91A2C] rounded-3xl p-6 text-white shadow-lg shadow-[#E21B2F]/20"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Donate Blood</h3>
              <p className="text-sm text-white/90">
                Your donation can save up to 3 lives
              </p>
            </div>
          </div>
          <Link
            to="/user/donate-blood"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#E21B2F] transition-all hover:bg-white/90 hover:scale-105"
          >
            <Droplets className="h-4 w-4" />
            Donate Blood
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <DashboardCard
          title="Total units available"
          value={totalUnits}
          subtitle="Across all hospitals"
          tone="red"
        />
        <DashboardCard
          title="My requests"
          value={requests.length}
          subtitle="Submitted to hospitals"
          tone="pink"
        />
      </div>

      <div className="glass-panel p-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-900">My requests</h3>
        <div className="max-h-[420px] overflow-auto rounded-2xl border border-slate-100 bg-white/70">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Hospital</th>
                <th className="px-3 py-2 text-left">Blood Group</th>
                <th className="px-3 py-2 text-left">Qty</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr
                  key={r._id}
                  className="border-b border-slate-50/80 last:border-none hover:bg-slate-50/60"
                >
                  <td className="px-3 py-2">{r.hospital?.organizationName}</td>
                  <td className="px-3 py-2">{r.bloodGroup}</td>
                  <td className="px-3 py-2">{r.quantity}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        r.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-600'
                          : r.status === 'rejected'
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-[11px] text-slate-500"
                  >
                    You haven&apos;t requested blood yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;


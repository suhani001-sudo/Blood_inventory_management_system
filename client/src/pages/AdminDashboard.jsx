import React, { useEffect, useState } from 'react';
import { Droplets, Hospital, Users } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalHospitals: 0,
    totalUsers: 0,
    totalRequests: 0,
    totalUnits: 0,
  });
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [inventorySummary, setInventorySummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [usersRes, requestsRes, inventoryRes] = await Promise.all([
          api.get('/users').catch(() => ({ data: [] })),
          api.get('/request').catch(() => ({ data: [] })),
          api.get('/inventory').catch(() => ({ data: [] })),
        ]);

        const totalHospitals = usersRes.data.filter((u) => u.role === 'hospital').length;
        const totalUsers = usersRes.data.filter((u) => u.role === 'user').length;
        const totalRequests = requestsRes.data.length;
        const totalUnits = inventoryRes.data.reduce(
          (sum, item) => sum + Math.max(item.available || 0, 0),
          0,
        );

        setUsers(usersRes.data);
        setRequests(requestsRes.data);
        setStats({ totalHospitals, totalUsers, totalRequests, totalUnits });
        setInventorySummary(inventoryRes.data);
      } catch (err) {
        console.error('Dashboard loading error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const chartData = inventorySummary.map((row) => ({
    bloodGroup: row.bloodGroup,
    available: Math.max(row.available || 0, 0),
  }));

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="h-3 w-3 rounded-full bg-[#E21B2F] animate-pulse"
                  style={{ animationDelay: `${index * 0.2}s` }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-sm mb-2">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-[#E21B2F] text-white rounded-lg text-sm hover:bg-[#C91A2C] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900">
                Admin overview
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Monitor hospitals, requests, and global blood availability in real time.
              </p>
            </div>
          </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Hospitals"
          value={stats.totalHospitals}
          subtitle="Connected organizations"
          icon={Hospital}
          tone="red"
        />
        <DashboardCard
          title="Registered Users"
          value={stats.totalUsers}
          subtitle="Donors & requesters"
          icon={Users}
          tone="pink"
        />
        <DashboardCard
          title="Open Requests"
          value={stats.totalRequests}
          subtitle="Awaiting hospital action"
          icon={Droplets}
          tone="red"
        />
        <DashboardCard
          title="Total Units"
          value={stats.totalUnits}
          subtitle="Across all hospitals"
          icon={Droplets}
          tone="pink"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="bg-white rounded-3xl p-6 shadow-lg shadow-[#E21B2F]/10 border border-[#FFE8EC]/50 col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Blood inventory distribution
            </h3>
            <span className="rounded-full bg-[#FFE8EC] px-3 py-1 text-[11px] font-medium text-[#E21B2F]">
              Live
            </span>
          </div>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="bloodGroup" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip
                  cursor={{ fill: 'rgba(226,27,47,0.08)' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgba(226,27,47,0.2)',
                    fontSize: 11,
                    backgroundColor: 'white',
                  }}
                />
                <Bar
                  dataKey="available"
                  radius={[12, 12, 4, 4]}
                  fill="#E21B2F"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg shadow-[#E21B2F]/10 border border-[#FFE8EC]/50">
          <h3 className="text-sm font-semibold text-gray-900">Recent requests</h3>
          <div className="mt-4 space-y-3 overflow-y-auto text-xs max-h-64">
            {requests.slice(0, 6).map((r) => (
              <div
                key={r._id}
                className="flex items-center justify-between rounded-2xl bg-[#FFE8EC]/30 px-3 py-3 hover:bg-[#FFE8EC]/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="font-medium text-gray-900">
                    {r.requester?.name || 'Unknown'}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {r.hospital?.organizationName} • {r.bloodGroup} • {r.quantity} units
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                    r.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : r.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {r.status}
                </span>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-[11px] text-gray-500 text-center py-4">No requests yet.</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg shadow-[#E21B2F]/10 border border-[#FFE8EC]/50 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">All requests</h3>
          <div className="max-h-64 overflow-auto rounded-2xl border border-[#FFE8EC]/50 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-[#FFE8EC]/30 text-[11px] uppercase tracking-[0.14em] text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Hospital</th>
                    <th className="px-4 py-3 text-left">Group</th>
                    <th className="px-4 py-3 text-left">Qty</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr
                      key={r._id}
                      className="border-b border-[#FFE8EC]/30 last:border-none hover:bg-[#FFE8EC]/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-900">{r.requester?.name}</td>
                      <td className="px-4 py-3 text-gray-900">{r.hospital?.organizationName}</td>
                      <td className="px-4 py-3 text-gray-900">{r.bloodGroup}</td>
                      <td className="px-4 py-3 text-gray-900">{r.quantity}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                            r.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : r.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
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
                        className="px-4 py-4 text-center text-[11px] text-gray-500"
                        colSpan={5}
                      >
                        No requests yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Users</h3>
          <div className="max-h-64 overflow-auto rounded-2xl border border-[#FFE8EC]/50 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-[#FFE8EC]/30 text-[11px] uppercase tracking-[0.14em] text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Org / Group</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-[#FFE8EC]/30 last:border-none hover:bg-[#FFE8EC]/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-900">{u.name}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                          u.role === 'admin' 
                            ? 'bg-[#E21B2F]/10 text-[#E21B2F]' 
                            : u.role === 'hospital'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900">{u.email}</td>
                      <td className="px-4 py-3 text-gray-900">
                        {u.role === 'hospital' ? u.organizationName : u.bloodGroup || '-'}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td
                        className="px-4 py-4 text-center text-[11px] text-gray-500"
                        colSpan={4}
                      >
                        No users yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;


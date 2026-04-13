import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api
      .get('/request')
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900">
          All requests
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          View and monitor incoming blood requests across all connected hospitals.
        </p>
      </div>
      <div className="glass-panel overflow-hidden">
        <div className="max-h-[460px] overflow-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">User</th>
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
                  <td className="px-3 py-2">{r.requester?.name}</td>
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
                    className="px-3 py-4 text-center text-[11px] text-slate-500"
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
  );
};

export default AdminRequests;


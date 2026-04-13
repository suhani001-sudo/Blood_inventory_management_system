import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const HospitalRequests = () => {
  const { showToast } = useAuth();
  const [requests, setRequests] = useState([]);

  const load = async () => {
    const res = await api.get('/request');
    setRequests(res.data);
  };

  useEffect(() => {
    load().catch((err) => console.error(err));
  }, []);

  const approveOrReject = async (id, status) => {
    await api.put(`/request/${id}`, { status });
    showToast(`Request ${status}`, 'success');
    await load();
  };

  const incoming = requests.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900">
          Incoming requests
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Approve or reject open blood requests directed to your hospital.
        </p>
      </div>
      <div className="glass-panel overflow-hidden">
        <div className="max-h-[460px] overflow-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Requester</th>
                <th className="px-3 py-2 text-left">Blood Group</th>
                <th className="px-3 py-2 text-left">Qty</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left" />
              </tr>
            </thead>
            <tbody>
              {incoming.map((r) => (
                <tr
                  key={r._id}
                  className="border-b border-slate-50/80 last:border-none hover:bg-slate-50/60"
                >
                  <td className="px-3 py-2">{r.requester?.name}</td>
                  <td className="px-3 py-2">{r.bloodGroup}</td>
                  <td className="px-3 py-2">{r.quantity}</td>
                  <td className="px-3 py-2">
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white"
                        onClick={() => approveOrReject(r._id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white"
                        onClick={() => approveOrReject(r._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {incoming.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-[11px] text-slate-500"
                  >
                    No pending requests at the moment.
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

export default HospitalRequests;


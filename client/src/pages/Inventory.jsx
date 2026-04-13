import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api
      .get('/inventory')
      .then((res) => setInventory(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filtered = filter
    ? inventory.filter((i) => i.bloodGroup === filter)
    : inventory;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900">
            Live inventory
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Browse available units per hospital and filter by blood group.
          </p>
        </div>
        <div className="hidden rounded-full bg-white/70 px-3 py-1 text-[11px] text-slate-500 shadow-sm lg:block">
          Data synced from all connected hospitals.
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          <span>Online</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <label className="text-slate-500">Filter by group</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-900 shadow-sm outline-none ring-0 transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All</option>
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
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="max-h-[420px] overflow-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-4 py-2 text-left">Hospital</th>
                <th className="px-4 py-2 text-left">Blood Group</th>
                <th className="px-4 py-2 text-left">Available Units</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-4 text-center text-[11px] text-slate-500"
                  >
                    No inventory data.
                  </td>
                </tr>
              )}
              {filtered.map((row, idx) => (
                <tr
                  key={`${row.organization?._id}-${row.bloodGroup}-${idx}`}
                  className="border-b border-slate-50/80 last:border-none hover:bg-slate-50/60"
                >
                  <td className="px-4 py-2 text-xs text-slate-800">
                    {row.organization?.organizationName}
                  </td>
                  <td className="px-4 py-2 text-xs font-medium text-slate-900">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px]">
                      {row.bloodGroup}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-800">
                    {Math.max(row.available || 0, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;


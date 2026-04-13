import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const HospitalInventory = () => {
  const { user, showToast } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({
    bloodGroup: 'A+',
    quantity: 1,
    type: 'IN',
  });

  const loadData = async () => {
    const [inventoryRes] = await Promise.all([api.get('/inventory')]);
    setInventory(inventoryRes.data);
  };

  useEffect(() => {
    loadData().catch((err) => console.error(err));
  }, []);

  const onChange = (e) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const onSubmit = async (e) => {
    e.preventDefault();
    await api.post('/inventory/add', {
      bloodGroup: form.bloodGroup,
      quantity: Number(form.quantity),
      type: form.type,
    });
    showToast('Inventory updated', 'success');
    setForm((prev) => ({ ...prev, quantity: 1 }));
    await loadData();
  };

  const hospitalInventory = inventory.filter(
    (i) => i.organization?._id === user.id,
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900">
          Blood inventory
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Manage your hospital&apos;s stored units and keep availability up to date.
        </p>
      </div>

      <div className="glass-panel grid gap-4 p-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Add / update inventory
          </h3>
          <form className="mt-2 flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1 space-y-1.5 text-xs">
              <label className="text-slate-600">Blood group</label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={onChange}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-900 shadow-sm outline-none ring-0 transition focus:border-primary/60 focus:bg-white focus:ring-2 focus:ring-primary/20"
              >
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

            <div className="w-28 space-y-1.5 text-xs">
              <label className="text-slate-600">Quantity</label>
              <input
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={onChange}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-900 shadow-sm outline-none ring-0 transition focus:border-primary/60 focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="w-28 space-y-1.5 text-xs">
              <label className="text-slate-600">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={onChange}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-900 shadow-sm outline-none ring-0 transition focus:border-primary/60 focus:bg-white focus:ring-2 focus:ring-primary/20"
              >
                <option value="IN">IN</option>
                <option value="OUT">OUT</option>
              </select>
            </div>

            <button
              type="button"
              onClick={onSubmit}
              className="mt-2 inline-flex items-center justify-center rounded-2xl bg-[#E21B2F] px-4 py-2 text-xs font-medium text-white shadow-lg shadow-[#E21B2F]/25 transition-all hover:bg-[#C91A2C] hover:shadow-xl hover:shadow-[#E21B2F]/35"
            >
              Save
            </button>
          </form>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Current stock
          </h3>
          <div className="max-h-60 overflow-auto rounded-2xl border border-slate-100 bg-white/70">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Blood group</th>
                  <th className="px-3 py-2 text-left">Available units</th>
                </tr>
              </thead>
              <tbody>
                {hospitalInventory.map((row) => (
                  <tr
                    key={row.bloodGroup}
                    className="border-b border-slate-50/80 last:border-none hover:bg-slate-50/60"
                  >
                    <td className="px-3 py-2">{row.bloodGroup}</td>
                    <td className="px-3 py-2">
                      {Math.max(row.available || 0, 0)}
                    </td>
                  </tr>
                ))}
                {hospitalInventory.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-3 py-4 text-center text-[11px] text-slate-500"
                    >
                      No inventory data yet. Add your first units above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalInventory;


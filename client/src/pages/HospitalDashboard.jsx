import React, { useEffect, useState } from "react";
import api from "../services/api";
import DashboardCard from "../components/DashboardCard";
import { useAuth } from "../context/AuthContext";

const HospitalDashboard = () => {
  const { user, showToast } = useAuth();

  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);

  const [form, setForm] = useState({
    bloodGroup: "A+",
    quantity: 1,
    type: "IN",
  });

  const loadData = async () => {
    const [inventoryRes, requestsRes] = await Promise.all([
      api.get("/inventory"),
      api.get("/request"),
    ]);

    setInventory(inventoryRes.data);
    setRequests(requestsRes.data);
  };

  useEffect(() => {
    loadData().catch((err) => console.error(err));
  }, []);

  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    await api.post("/inventory/add", {
      bloodGroup: form.bloodGroup,
      quantity: Number(form.quantity),
      type: form.type,
    });

    showToast("Inventory updated", "success");

    setForm((prev) => ({
      ...prev,
      quantity: 1,
    }));

    await loadData();
  };

  const approveOrReject = async (id, status) => {
    await api.put(`/request/${id}`, { status });

    showToast(`Request ${status}`, "success");

    await loadData();
  };

  const hospitalSummary = inventory.filter(
    (i) => i.organization?._id === user.id
  );

  const totalUnits = hospitalSummary.reduce(
    (sum, i) => sum + Math.max(i.available || 0, 0),
    0
  );

  const pending = requests.filter((r) => r.status === "pending");

  return (
    <div className="space-y-4">

      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900">
          Hospital Dashboard
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Keep your stock updated and respond quickly to incoming requests.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <DashboardCard
          title="Total Units"
          value={totalUnits}
          subtitle="In your hospital"
        />

        <DashboardCard
          title="Open Requests"
          value={pending.length}
          subtitle="Awaiting your action"
          tone="secondary"
        />
      </div>

      {/* Main Section */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg shadow-[#E21B2F]/10 border border-[#FFE8EC]/50 grid gap-6 grid-cols-1 lg:grid-cols-2">

        {/* Inventory Form */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Add / Update Inventory
          </h3>

          <form
            onSubmit={onSubmit}
            className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end"
          >

            <div className="flex-1 space-y-1.5 text-xs">
              <label className="text-slate-600">Blood Group</label>

              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={onChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200"
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

            <div className="w-full sm:w-28 space-y-1.5 text-xs">
              <label className="text-slate-600">Quantity</label>

              <input
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={onChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200"
              />
            </div>

            <div className="w-full sm:w-28 space-y-1.5 text-xs">
              <label className="text-slate-600">Type</label>

              <select
                name="type"
                value={form.type}
                onChange={onChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200"
              >
                <option value="IN">IN</option>
                <option value="OUT">OUT</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-2 sm:mt-0 rounded-2xl bg-[#E21B2F] px-4 py-2 text-xs font-medium text-white shadow-lg hover:bg-[#C91A2C]"
            >
              Save
            </button>
          </form>
        </div>

        {/* Requests Table */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Incoming Requests
          </h3>

          <div className="max-h-64 overflow-auto rounded-2xl border border-[#FFE8EC]/50 bg-white">
            <div className="overflow-x-auto">

              <table className="min-w-full text-xs">

                <thead className="bg-[#FFE8EC]/30 text-[11px] uppercase tracking-[0.14em] text-gray-600">
                  <tr>
                    <th className="px-3 py-2 text-left">Requester</th>
                    <th className="px-3 py-2 text-left">Blood Group</th>
                    <th className="px-3 py-2 text-left">Qty</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {pending.map((r) => (
                    <tr
                      key={r._id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >

                      <td className="px-3 py-2">
                        {r.requester?.name}
                      </td>

                      <td className="px-3 py-2">
                        {r.bloodGroup}
                      </td>

                      <td className="px-3 py-2">
                        {r.quantity}
                      </td>

                      <td className="px-3 py-2">
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-[10px] font-semibold text-yellow-700">
                          {r.status}
                        </span>
                      </td>

                      <td className="px-3 py-2">
                        <div className="flex gap-1">

                          <button
                            type="button"
                            onClick={() => approveOrReject(r._id, "approved")}
                            className="rounded-full bg-green-500 px-2 py-1 text-[10px] font-semibold text-white"
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() => approveOrReject(r._id, "rejected")}
                            className="rounded-full bg-red-500 px-2 py-1 text-[10px] font-semibold text-white"
                          >
                            Reject
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                  {pending.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-3 py-4 text-center text-[11px] text-slate-500"
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

      </div>

    </div>
  );
};

export default HospitalDashboard;
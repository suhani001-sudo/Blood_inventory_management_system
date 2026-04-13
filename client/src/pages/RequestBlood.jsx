import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const RequestBlood = () => {
  const { showToast } = useAuth();

  const [hospitals, setHospitals] = useState([]);
  const [requests, setRequests] = useState([]);

  const [form, setForm] = useState({
    hospital: "",
    bloodGroup: "A+",
    quantity: 1,
  });

  useEffect(() => {
    const load = async () => {
      const usersRes = await api.get("/users");
      const hosps = usersRes.data.filter((u) => u.role === "hospital");
      setHospitals(hosps);

      const reqsRes = await api.get("/request");
      setRequests(reqsRes.data);
    };

    load().catch((err) => console.error(err));
  }, []);

  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    await api.post("/request", {
      hospital: form.hospital,
      bloodGroup: form.bloodGroup,
      quantity: Number(form.quantity),
    });

    showToast("Request submitted", "success");

    const reqsRes = await api.get("/request");
    setRequests(reqsRes.data);
  };

  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900">
          Request Blood
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Choose a hospital, select a blood group, and send a request in a few
          clicks.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">

        {/* Request Form */}
        <div className="glass-panel p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            New Request
          </h3>

          <form className="space-y-4 text-xs" onSubmit={onSubmit}>
            {/* Hospital */}
            <div className="space-y-1.5">
              <label className="text-slate-600">Hospital</label>

              <select
                name="hospital"
                value={form.hospital}
                onChange={onChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-900 shadow-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-200"
              >
                <option value="">Select hospital</option>

                {hospitals.map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.organizationName}
                  </option>
                ))}
              </select>
            </div>

            {/* Blood Group */}
            <div className="space-y-1.5">
              <label className="text-slate-600">Blood Group</label>

              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={onChange}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-900 shadow-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-200"
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

            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="text-slate-600">Quantity</label>

              <input
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={onChange}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-900 shadow-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-200"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-1 w-full rounded-2xl bg-[#E21B2F] px-4 py-2 text-xs font-medium text-white shadow-lg transition hover:bg-[#C91A2C]"
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* Requests Table */}
        <div className="glass-panel p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            My Requests
          </h3>

          <div className="max-h-[420px] overflow-auto rounded-2xl border border-[#FFE8EC]/50 bg-white">
            <div className="overflow-x-auto">

              <table className="min-w-full text-xs">
                <thead className="bg-[#FFE8EC]/30 text-[11px] uppercase tracking-[0.14em] text-gray-600">
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
                      className="border-b border-[#FFE8EC]/30 last:border-none hover:bg-[#FFE8EC]/20 transition-colors"
                    >
                      <td className="px-3 py-2">
                        {r.hospital?.organizationName}
                      </td>

                      <td className="px-3 py-2">{r.bloodGroup}</td>

                      <td className="px-3 py-2">{r.quantity}</td>

                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            r.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : r.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
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

export default RequestBlood;
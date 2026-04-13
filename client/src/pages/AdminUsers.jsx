import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';

const AdminUsers = () => {
  const { user: currentUser, showToast } = useAuth();
  const [users, setUsers] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const loadUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers().catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/users/${id}`);
      showToast('User deleted', 'success');
      await loadUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete user';
      showToast(msg, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900">
          Users
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Overview of admins, hospitals, and requesters. Admins can remove accounts when
          necessary.
        </p>
      </div>
      <div className="glass-panel overflow-hidden">
        <div className="max-h-[460px] overflow-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Role</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Org / Group</th>
                <th className="px-3 py-2 text-left" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-slate-50/80 last:border-none hover:bg-slate-50/60"
                >
                  <td className="px-3 py-2">{u.name}</td>
                  <td className="px-3 py-2">
                    <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">
                    {u.role === 'hospital' ? u.organizationName : u.bloodGroup || '-'}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {currentUser?.id !== u._id && (
                      <button
                        type="button"
                        onClick={() => handleDelete(u._id)}
                        disabled={deletingId === u._id}
                        className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-600 hover:bg-rose-100 disabled:opacity-60"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-4 text-center text-[11px] text-slate-500"
                    colSpan={5}
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
  );
};

export default AdminUsers;


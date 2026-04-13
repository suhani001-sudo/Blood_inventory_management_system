import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Phone, User, Droplet, Building } from 'lucide-react';

const DonateBlood = () => {
  const { user, showToast } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    bloodGroup: user?.bloodGroup || 'A+',
    phone: '',
    age: '',
    lastDonationDate: '',
    donationDate: '',
    hospital: '',
  });

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const usersRes = await api.get('/users');
        const hosps = usersRes.data.filter((u) => u.role === 'hospital');
        setHospitals(hosps);
      } catch (error) {
        console.error('Error loading hospitals:', error);
      }
    };

    loadHospitals();
  }, []);

  const onChange = (e) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/donations', form);
      showToast('Donation request submitted successfully!', 'success');
      
      // Reset form
      setForm({
        bloodGroup: user?.bloodGroup || 'A+',
        phone: '',
        age: '',
        lastDonationDate: '',
        donationDate: '',
        hospital: '',
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit donation request';
      
      if (error.response?.data?.daysRemaining) {
        showToast(message, 'error');
      } else {
        showToast(message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-gray-900">
          Donate Blood
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Your donation can save lives. Fill out the form below to schedule your blood donation.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-6 shadow-lg shadow-[#E21B2F]/10 border border-[#FFE8EC]/50"
        >
          <h3 className="mb-6 text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Droplet className="h-5 w-5 text-[#E21B2F]" />
            Donation Form
          </h3>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Name (Auto-filled) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full rounded-2xl border border-[#FFE8EC] bg-gray-50 px-4 py-3 text-sm text-gray-600 shadow-sm outline-none transition"
              />
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Droplet className="h-4 w-4" />
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={onChange}
                required
                className="w-full rounded-2xl border border-[#FFE8EC] bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#E21B2F] focus:ring-2 focus:ring-[#E21B2F]/20"
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

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  required
                  placeholder="+1 (555) 123-4567"
                  className="w-full rounded-2xl border border-[#FFE8EC] bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#E21B2F] focus:ring-2 focus:ring-[#E21B2F]/20"
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={onChange}
                  required
                  min="18"
                  max="65"
                  placeholder="25"
                  className="w-full rounded-2xl border border-[#FFE8EC] bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#E21B2F] focus:ring-2 focus:ring-[#E21B2F]/20"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Last Donation Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Last Donation Date
                </label>
                <input
                  type="date"
                  name="lastDonationDate"
                  value={form.lastDonationDate}
                  onChange={onChange}
                  className="w-full rounded-2xl border border-[#FFE8EC] bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#E21B2F] focus:ring-2 focus:ring-[#E21B2F]/20"
                />
              </div>

              {/* Preferred Donation Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Preferred Donation Date
                </label>
                <input
                  type="date"
                  name="donationDate"
                  value={form.donationDate}
                  onChange={onChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-2xl border border-[#FFE8EC] bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#E21B2F] focus:ring-2 focus:ring-[#E21B2F]/20"
                />
              </div>
            </div>

            {/* Select Hospital */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Select Hospital
              </label>
              <select
                name="hospital"
                value={form.hospital}
                onChange={onChange}
                required
                className="w-full rounded-2xl border border-[#FFE8EC] bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#E21B2F] focus:ring-2 focus:ring-[#E21B2F]/20"
              >
                <option value="">Select a hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital._id} value={hospital._id}>
                    {hospital.organizationName}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-2xl bg-[#E21B2F] px-6 py-4 text-sm font-medium text-white shadow-lg shadow-[#E21B2F]/25 transition-all hover:bg-[#C91A2C] hover:shadow-xl hover:shadow-[#E21B2F]/35 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Droplet className="h-4 w-4" />
                  Submit Donation Request
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default DonateBlood;

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Droplets, User, Calendar, Phone, CheckCircle, XCircle, Clock } from 'lucide-react';

const DonationRequests = () => {
  const { showToast } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const response = await api.get('/donations/hospital');
        setDonations(response.data);
      } catch (error) {
        console.error('Error loading donation requests:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDonations();
  }, []);

  const updateDonationStatus = async (id, status) => {
    try {
      await api.patch(`/donations/${id}/status`, { status });
      showToast(`Donation ${status} successfully`, 'success');
      
      // Update local state
      setDonations(prev => 
        prev.map(donation => 
          donation._id === id ? { ...donation, status } : donation
        )
      );
    } catch (error) {
      console.error('Error updating donation status:', error);
      showToast('Failed to update donation status', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-700',
        icon: Clock,
        label: 'Pending',
      },
      approved: {
        color: 'bg-blue-100 text-blue-700',
        icon: CheckCircle,
        label: 'Approved',
      },
      rejected: {
        color: 'bg-red-100 text-red-700',
        icon: XCircle,
        label: 'Rejected',
      },
      completed: {
        color: 'bg-green-100 text-green-700',
        icon: CheckCircle,
        label: 'Completed',
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
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
          <p className="text-sm text-gray-500">Loading donation requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-gray-900">
          Donation Requests
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Manage blood donation requests from donors. Approve, reject, or mark as completed.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-lg shadow-[#E21B2F]/10 border border-[#FFE8EC]/50">
        {donations.length === 0 ? (
          <div className="text-center py-12">
            <Droplets className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donation requests yet</h3>
            <p className="text-sm text-gray-500">
              Donation requests from users will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[#FFE8EC]/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Donor Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Donation Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation, index) => (
                  <motion.tr
                    key={donation._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-[#FFE8EC]/30 last:border-none hover:bg-[#FFE8EC]/20 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {donation.donor?.name || 'Unknown Donor'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-[#E21B2F]" />
                        <span className="text-sm font-medium text-gray-900">
                          {donation.bloodGroup}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(donation.donationDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {donation.donor?.phone || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(donation.status)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        {donation.status === 'pending' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateDonationStatus(donation._id, 'approved')}
                              className="rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600 transition-colors"
                            >
                              Approve
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateDonationStatus(donation._id, 'rejected')}
                              className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 transition-colors"
                            >
                              Reject
                            </motion.button>
                          </>
                        )}
                        {donation.status === 'approved' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateDonationStatus(donation._id, 'completed')}
                            className="rounded-full bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 transition-colors"
                          >
                            Mark Completed
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationRequests;

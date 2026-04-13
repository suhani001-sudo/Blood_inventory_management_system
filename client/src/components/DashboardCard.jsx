import React from 'react';
import { motion } from 'framer-motion';

const DashboardCard = ({ title, value, subtitle, icon: Icon, tone = 'primary' }) => {
  const getToneClasses = () => {
    switch (tone) {
      case 'red':
        return 'from-[#E21B2F]/5 via-[#FFE8EC]/50 to-white border-[#FFE8EC]';
      case 'pink':
        return 'from-[#FFE8EC]/30 via-white to-white border-[#FFE8EC]';
      default:
        return 'from-[#E21B2F]/5 via-[#FFE8EC]/50 to-white border-[#FFE8EC]';
    }
  };

  const getIconClasses = () => {
    switch (tone) {
      case 'red':
        return 'bg-[#E21B2F] text-white shadow-lg shadow-[#E21B2F]/25';
      case 'pink':
        return 'bg-[#FFE8EC] text-[#E21B2F] shadow-md shadow-[#FFE8EC]/50';
      default:
        return 'bg-[#E21B2F] text-white shadow-lg shadow-[#E21B2F]/25';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-3xl border ${getToneClasses()} bg-white p-6 shadow-lg shadow-[#E21B2F]/10 hover:shadow-xl hover:shadow-[#E21B2F]/15`}
    >
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
            {title}
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{value}</div>
          {subtitle && (
            <div className="mt-1 text-sm text-gray-600">{subtitle}</div>
          )}
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${getIconClasses()}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardCard;


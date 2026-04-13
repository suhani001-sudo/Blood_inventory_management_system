import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  Bell,
  Droplets,
  LayoutDashboard,
  Layers,
  MapPin,
  Users,
  Heart,
} from 'lucide-react';

const baseLinkClasses =
  'flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-medium transition-colors';

const Sidebar = ({ mobileOpen = false, onClose }) => {
  const { user } = useAuth();
  if (!user) return null;

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/inventory', label: 'Inventory', icon: Layers },
    { to: '/admin/requests', label: 'Requests', icon: Bell },
    { to: '/admin/users', label: 'Users', icon: Users },
  ];

  const hospitalLinks = [
    { to: '/hospital/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/hospital/inventory', label: 'Blood Inventory', icon: Droplets },
    { to: '/hospital/requests', label: 'Incoming Requests', icon: Bell },
    { to: '/hospital/donation-requests', label: 'Donation Requests', icon: Heart },
    { to: '/hospital/history', label: 'Request History', icon: Layers },
  ];

  const userLinks = [
    { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/user/donate-blood', label: 'Donate Blood', icon: Droplets },
    { to: '/user/my-donations', label: 'My Donations', icon: Bell },
    { to: '/user/request-blood', label: 'Request Blood', icon: Droplets },
    { to: '/user/nearby-inventory', label: 'Nearby Inventory', icon: MapPin },
  ];

  const navItems =
    user.role === 'admin'
      ? adminLinks
      : user.role === 'hospital'
      ? hospitalLinks
      : userLinks || [];

  if (!navItems || navItems.length === 0) {
    return null;
  }

  const navContent = (
    <div className="bg-white rounded-2xl p-4 shadow-lg shadow-[#E21B2F]/10 border border-[#FFE8EC]/50">
      <div className="mb-4 flex items-center justify-between px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500">
        <span>Navigation</span>
        <Activity className="h-3 w-3 text-[#E21B2F]" />
      </div>
      <nav className="space-y-1">
        {navItems?.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to || label}
            to={to || '#'}
            className={({ isActive }) =>
              [
                baseLinkClasses,
                isActive
                  ? 'bg-[#E21B2F] text-white shadow-md shadow-[#E21B2F]/30'
                  : 'text-gray-600 hover:bg-[#FFE8EC] hover:text-[#E21B2F]',
              ]
                .filter(Boolean)
                .join(' ')
            }
            onClick={() => {
              if (onClose) onClose();
            }}
          >
            {({ isActive }) => (
              <>
                <span className={`flex h-6 w-6 items-center justify-center rounded-xl text-sm shadow-sm ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#FFE8EC] text-[#E21B2F]'
                }`}>
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                </span>
                <span className="text-xs">{label || 'Navigation'}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-20 hidden w-60 shrink-0 lg:block">
        {navContent}
      </aside>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Sidebar */}
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80vw] overflow-y-auto bg-white shadow-2xl">
            <div className="p-3">
              {navContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;


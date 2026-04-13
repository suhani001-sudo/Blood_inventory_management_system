import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Droplets, LogOut, Menu, X } from 'lucide-react';

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-[#FFE8EC]/40 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {user && (
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#FFE8EC] bg-white text-[#E21B2F] shadow-sm transition-colors hover:bg-[#FFE8EC] lg:hidden"
              onClick={onToggleSidebar}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E21B2F] text-white shadow-lg shadow-[#E21B2F]/30">
              <img 
                src="/images/Untitled design.png" 
                alt="BloodLink" 
                className="h-6 w-6 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-sm font-semibold tracking-tight text-gray-900">
                BloodLink
              </div>
              <div className="text-xs text-gray-500">Blood Bank Management System</div>
            </div>
          </div>
        </div>
        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right text-xs sm:block">
              <div className="font-medium text-gray-900">{user.name}</div>
              <div className="text-[11px] uppercase tracking-wide text-gray-500">
                {user.role}
              </div>
            </div>
            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#E21B2F] text-xs font-semibold text-white shadow-md sm:flex">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1 rounded-full border border-[#FFE8EC] bg-white px-2 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-all hover:border-[#E21B2F] hover:bg-[#FFE8EC] hover:text-[#E21B2F]"
              aria-label="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;


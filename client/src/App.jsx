import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import SplashScreen from './components/SplashScreen';
import AdminDashboard from './pages/AdminDashboard';
import AdminRequests from './pages/AdminRequests';
import AdminUsers from './pages/AdminUsers';
import HospitalDashboard from './pages/HospitalDashboard';
import HospitalInventory from './pages/HospitalInventory';
import HospitalRequests from './pages/HospitalRequests';
import HospitalHistory from './pages/HospitalHistory';
import UserDashboard from './pages/UserDashboard';
import UserMyRequests from './pages/UserMyRequests';
import DonateBlood from './pages/DonateBlood';
import MyDonations from './pages/MyDonations';
import DonationRequests from './pages/DonationRequests';
import Inventory from './pages/Inventory';
import RequestBlood from './pages/RequestBlood';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { useAuth } from './context/AuthContext';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell min-h-screen bg-[#FAFAFA]">
      <Navbar 
        onToggleSidebar={() => setSidebarOpen((open) => !open)} 
        sidebarOpen={sidebarOpen} 
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 pb-8 pt-20 lg:flex-row lg:gap-6 lg:px-8 lg:pt-24">
        <Sidebar 
          mobileOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        <motion.main
          className="flex-1 overflow-x-hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className="w-full">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

const App = () => {
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={
                  user.role === 'admin'
                    ? '/admin/dashboard'
                    : user.role === 'hospital'
                    ? '/hospital/dashboard'
                    : '/user/dashboard'
                }
                replace
              />
            ) : (
              <SplashScreen />
            )
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={['admin']}>
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <ProtectedRoute roles={['admin']}>
              <AppLayout>
                <Inventory />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute roles={['admin']}>
              <AppLayout>
                <AdminRequests />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <AppLayout>
                <AdminUsers />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Hospital routes */}
        <Route
          path="/hospital/dashboard"
          element={
            <ProtectedRoute roles={['hospital']}>
              <AppLayout>
                <HospitalDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital/inventory"
          element={
            <ProtectedRoute roles={['hospital']}>
              <AppLayout>
                <HospitalInventory />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital/requests"
          element={
            <ProtectedRoute roles={['hospital']}>
              <AppLayout>
                <HospitalRequests />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital/donation-requests"
          element={
            <ProtectedRoute roles={['hospital']}>
              <AppLayout>
                <DonationRequests />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital/history"
          element={
            <ProtectedRoute roles={['hospital']}>
              <AppLayout>
                <HospitalHistory />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* User routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute roles={['user']}>
              <AppLayout>
                <UserDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/donate-blood"
          element={
            <ProtectedRoute roles={['user']}>
              <AppLayout>
                <DonateBlood />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/my-donations"
          element={
            <ProtectedRoute roles={['user']}>
              <AppLayout>
                <MyDonations />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/request-blood"
          element={
            <ProtectedRoute roles={['user']}>
              <AppLayout>
                <RequestBlood />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/my-requests"
          element={
            <ProtectedRoute roles={['user']}>
              <AppLayout>
                <UserMyRequests />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/nearby-inventory"
          element={
            <ProtectedRoute roles={['user']}>
              <AppLayout>
                <Inventory />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Backwards-compatible redirects */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route
          path="/hospital"
          element={<Navigate to="/hospital/dashboard" replace />}
        />
        <Route
          path="/user"
          element={<Navigate to="/user/dashboard" replace />}
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute roles={['admin', 'hospital', 'user']}>
              <AppLayout>
                <Inventory />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/request-blood"
          element={
            <ProtectedRoute roles={['user']}>
              <AppLayout>
                <RequestBlood />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
    </ErrorBoundary>
  );
};

export default App;


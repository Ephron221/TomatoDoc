import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import FarmerLayout from './components/FarmerLayout';

import Home from './pages/public/Home';
import HowItWorks from './pages/public/HowItWorks';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Pricing from './pages/public/Pricing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import VerifyOTP from './pages/public/VerifyOTP';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';

import Dashboard from './pages/farmer/Dashboard';
import ChatHistory from './pages/farmer/ChatHistory';
import NewChat from './pages/farmer/NewChat';
import Experts from './pages/farmer/Experts';
import PaymentForm from './pages/farmer/PaymentForm';
import ImageDetection from './pages/farmer/ImageDetection';
import FarmerProfile from './pages/farmer/FarmerProfile';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPayments from './pages/admin/AdminPayments';
import AdminUsers from './pages/admin/AdminUsers';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminProfile from './pages/admin/AdminProfile';
import AdminExperts from './pages/admin/AdminExperts';
import AdminContacts from './pages/admin/AdminContacts';
import AdminSettings from './pages/admin/AdminSettings';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Public Routes with Main Layout */}
            <Route element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Outlet />
                </main>
                <Footer />
              </>
            }>
              <Route path="/" element={<Home />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Farmer Routes with Farmer Layout */}
            <Route element={<ProtectedRoute role="farmer" />}>
              <Route element={<FarmerLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/chats" element={<ChatHistory />} />
                <Route path="/dashboard/chat/new" element={<NewChat />} />
                <Route path="/dashboard/chat/:id" element={<NewChat />} />
                <Route path="/dashboard/detect" element={<ImageDetection />} />
                <Route path="/dashboard/experts" element={<Experts />} />
                <Route path="/dashboard/payment" element={<PaymentForm />} />
                <Route path="/profile" element={<FarmerProfile />} />
              </Route>
            </Route>

            {/* Admin Routes with Admin Layout */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/payments" element={<AdminPayments />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
                <Route path="/admin/experts" element={<AdminExperts />} />
                <Route path="/admin/contacts" element={<AdminContacts />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Routes>
        </div>
        <Toaster position="top-right" richColors />
      </Router>
    </AuthProvider>
  );
};

export default App;

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ── Eager-loaded (critical path) ─────────────────────────────────────────────
import Home from '../pages/Home';
import Login from '../pages/admin/Login';

// ── Lazy-loaded (public routes) ──────────────────────────────────────────────
const Booking = lazy(() => import('../pages/Booking'));
const BookingSuccess = lazy(() => import('../pages/BookingSuccess'));

// ── Lazy-loaded (admin routes) ───────────────────────────────────────────────
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminServices = lazy(() => import('../pages/admin/Services'));
const Slots = lazy(() => import('../pages/admin/Slots'));
const Bookings = lazy(() => import('../pages/admin/Bookings'));

// ── 404 ──────────────────────────────────────────────────────────────────────
const NotFound = lazy(() => import('../pages/NotFound'));

// ── Protected Route Wrapper ───────────────────────────────────────────────────
import ProtectedRoute from './ProtectedRoute';

// ── Loader ────────────────────────────────────────────────────────────────────
import PageLoader from '../components/ui/PageLoader';

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="slots" element={<Slots />} />
          <Route path="bookings" element={<Bookings />} />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import useAuth from './auth/useAuth';
import {
  getDefaultRouteForRole,
  ROLE_ADMIN,
  ROLE_PATIENT,
  ROLE_PROVIDER,
} from './auth/roleRoutes';

import LandingPage from './screens/marketing/LandingPage';
import LoginPage from './screens/auth/LoginPage';

import PatientHome from './screens/patient/PatientHome';
import PatientSubmit from './screens/patient/PatientSubmit';
import PatientResults from './screens/patient/PatientResults';
import PatientHistory from './screens/patient/PatientHistory';

import ProviderDashboard from './screens/provider/ProviderDashboard';
import AdminDashboard from './screens/admin/AdminDashboard';

function RequireRole({ allowedRoles }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return <Outlet />;
}

function CatchAllRedirect() {
  const { isAuthenticated, role } = useAuth();

  return <Navigate to={isAuthenticated ? getDefaultRouteForRole(role) : '/'} replace />;
}

export default function Router() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Patient */}
      <Route element={<RequireRole allowedRoles={[ROLE_PATIENT]} />}>
        <Route path="/patient" element={<PatientHome />} />
        <Route path="/patient/submit" element={<PatientSubmit />} />
        <Route path="/patient/results" element={<PatientResults />} />
        <Route path="/patient/history" element={<PatientHistory />} />
      </Route>

      {/* Provider */}
      <Route element={<RequireRole allowedRoles={[ROLE_PROVIDER]} />}>
        <Route path="/provider" element={<ProviderDashboard />} />
      </Route>

      {/* Admin */}
      <Route element={<RequireRole allowedRoles={[ROLE_ADMIN]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<CatchAllRedirect />} />
    </Routes>
  );
}

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Spin, ConfigProvider } from 'antd';
import { useSelector } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import { ProtectedRoute } from '@core';
import { ROUTES, USER_ROLES } from '@constants';
import { LoginPage } from './pages/auth';
import { useTheme } from './contexts/ThemeContext';

// Lazy-loaded components for code splitting
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const ForgetPasswordPage = React.lazy(() => import('./pages/auth/ForgetPasswordPage'));
const DashboardPage = React.lazy(() => import('./pages/admin/DashboardPage'));
const ExamsPage = React.lazy(() => import('./pages/admin/ExamsPage'));
const AddEditExam = React.lazy(() => import('./pages/admin/AddEditExam'));
const UserHomePage = React.lazy(() => import('./pages/user/HomePage'));
const AvailableExamsPage = React.lazy(() => import('./pages/user/AvailableExamsPage'));
const WriteExam = React.lazy(() => import('./pages/user/WriteExam'));
const ResultPage = React.lazy(() => import('./pages/user/ResultPage'));
const ReportsPage = React.lazy(() => import('./pages/user/ReportsPage'));
const AdminReportsPage = React.lazy(() => import('./pages/admin/ReportsPage'));
const ProfilePage = React.lazy(() => import('./pages/user/ProfilePage'));
const NotFoundPage = React.lazy(() => import('./pages/common/NotFoundPage'));
const ErrorFallback = React.lazy(() => import('./components/common/ErrorFallback'));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <Spin size="large" tip="Loading page..." />
  </div>
);

/**
 * Main App Component
 * Uses React Router for navigation and protects routes with ProtectedRoute
 */
function App() {
  const { currentTheme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4f46e5',
          borderRadius: 6,
        },
        algorithm: currentTheme === 'dark' ? 'dark' : 'light',
      }}
    >
      <BrowserRouter>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Authentication Routes - Public */}
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgetPasswordPage />} />
              
              {/* Admin Routes - Protected */}
              <Route 
                path={ROUTES.HOME} 
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.EXAMS} 
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                    <ExamsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/exams/add" 
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                    <AddEditExam />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/exams/edit/:id" 
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                    <AddEditExam />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.REPORTS_ADMIN} 
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                    <AdminReportsPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* User Routes - Protected */}
              <Route 
                path="/user" 
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.USER]}>
                    <UserHomePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.USER_EXAMS} 
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.USER]}>
                    <AvailableExamsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={`${ROUTES.WRITE_EXAM}/:id`} 
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.USER]}>
                    <WriteExam />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user/result/:resultId" 
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.USER]}>
                    <ResultPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.REPORTS_USER} 
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.USER]}>
                    <ReportsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.PROFILE} 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Default redirection */}
              <Route 
                path="/" 
                element={<Navigate to="/available-exams" replace />} 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
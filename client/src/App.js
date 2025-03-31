import React, { lazy, Suspense } from 'react';
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider, App as AntApp, Spin } from 'antd';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { MessageProvider } from './components/MessageProvider';
import AppContent from './components/AppContent';
import ErrorBoundary from './components/ErrorBoundary';
import SkeletonLoader from './components/SkeletonLoader';
import ResourcePreloader from './components/ResourcePreloader';

// Import only our centralized stylesheet instead of multiple CSS files
// This helps avoid style conflicts and overlapping

// Page imports - use React lazy for code splitting
const Login = lazy(() => import('./pages/common/Login'));
const Register = lazy(() => import('./pages/common/Register'));
const Home = lazy(() => import('./pages/common/Home'));
const Profile = lazy(() => import('./pages/common/Profile'));
const WriteExam = lazy(() => import('./pages/user/WriteExam/index.jsx'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const UserReports = lazy(() => import('./pages/user/UserReports'));
const Exams = lazy(() => import('./pages/admin/Exams'));
const AddEditExam = lazy(() => import('./pages/admin/Exams/AddEditExam'));
const AddEditQuestion = lazy(() => import('./pages/admin/Exams/AddEditQuestion'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const ForgotPassword = lazy(() => import('./pages/common/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/common/ResetPassword'));
const AvailableExams = lazy(() => import('./pages/user/AvailableExams'));
const PaymentPortal = lazy(() => import('./pages/user/PaymentPortal'));
const Leaderboard = lazy(() => import('./pages/common/Leaderboard'));
const StudyRoom = lazy(() => import('./pages/user/StudyRoom'));
const Flashcards = lazy(() => import('./pages/user/Flashcards'));
const UserSettings = lazy(() => import('./pages/user/UserSettings'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const Certificates = lazy(() => import('./pages/common/Certificates'));
const ApiDebugger = lazy(() => import('./components/debug/ApiDebugger'));

// Suspense fallback component
const PageLoader = () => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="text-center">
      <Spin size="large" tip="Loading...">
        <div className="content" style={{ padding: '50px', opacity: 0 }}>
          {/* Content placeholder for the Spin component to work in nested mode */}
        </div>
      </Spin>
    </div>
  </div>
);

// Wrap components with Suspense for code splitting
const wrapWithSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <ErrorBoundary>
      {Component}
    </ErrorBoundary>
  </Suspense>
);

// Create router outside the component to avoid recreating it on every render
const router = createBrowserRouter(
  [
    { path: "/login", element: wrapWithSuspense(<Login />) },
    { path: "/register", element: wrapWithSuspense(<Register />) },
    { 
      path: "/", 
      element: wrapWithSuspense(<ProtectedRoute><Home /></ProtectedRoute>) 
    },
    { 
      path: "/profile", 
      element: wrapWithSuspense(<ProtectedRoute><Profile /></ProtectedRoute>) 
    },
    { 
      path: "/user/reports", 
      element: wrapWithSuspense(<ProtectedRoute><UserReports /></ProtectedRoute>) 
    },
    { 
      path: "/available-exams", 
      element: wrapWithSuspense(<ProtectedRoute><AvailableExams /></ProtectedRoute>) 
    },
    { 
      path: "/user/write-exam", 
      element: wrapWithSuspense(<ProtectedRoute><Navigate to="/available-exams" replace /></ProtectedRoute>) 
    },
    { 
      path: "/user/write-exam/:id", 
      element: wrapWithSuspense(<ProtectedRoute><WriteExam /></ProtectedRoute>) 
    },
    { 
      path: "/admin/reports", 
      element: wrapWithSuspense(<ProtectedRoute><AdminReports /></ProtectedRoute>) 
    },
    { 
      path: "/admin/exams", 
      element: wrapWithSuspense(<ProtectedRoute><Exams /></ProtectedRoute>) 
    },
    { 
      path: "/admin/exams/add", 
      element: wrapWithSuspense(<ProtectedRoute><AddEditExam /></ProtectedRoute>) 
    },
    { 
      path: "/admin/exams/edit/:id", 
      element: wrapWithSuspense(<ProtectedRoute><AddEditExam /></ProtectedRoute>) 
    },
    { 
      path: "/admin/exams/questions/:id", 
      element: wrapWithSuspense(<ProtectedRoute><AddEditQuestion /></ProtectedRoute>) 
    },
    { path: "/forgot-password", element: wrapWithSuspense(<ForgotPassword />) },
    { path: "/reset-password/:email", element: wrapWithSuspense(<ResetPassword />) },
    { 
      path: "/payment-portal/:examId", 
      element: wrapWithSuspense(<ProtectedRoute><PaymentPortal /></ProtectedRoute>) 
    },
    { 
      path: "/leaderboard", 
      element: wrapWithSuspense(<ProtectedRoute><Leaderboard /></ProtectedRoute>) 
    },
    { 
      path: "/study-room", 
      element: wrapWithSuspense(<ProtectedRoute><StudyRoom /></ProtectedRoute>) 
    },
    { 
      path: "/flashcards", 
      element: wrapWithSuspense(<ProtectedRoute><Flashcards /></ProtectedRoute>) 
    },
    { 
      path: "/user/settings", 
      element: wrapWithSuspense(<ProtectedRoute><UserSettings /></ProtectedRoute>) 
    },
    { 
      path: "/admin/settings", 
      element: wrapWithSuspense(<ProtectedRoute><AdminSettings /></ProtectedRoute>) 
    },
    { 
      path: "/admin/users", 
      element: wrapWithSuspense(<ProtectedRoute><UserManagement /></ProtectedRoute>) 
    },
    { 
      path: "/certificates", 
      element: wrapWithSuspense(<ProtectedRoute><Certificates /></ProtectedRoute>) 
    },
    {
      path: "/debug",
      element: wrapWithSuspense(<ProtectedRoute><ApiDebugger /></ProtectedRoute>)
    },
    // Add a catch-all route to handle any undefined paths
    {
      path: "*",
      element: <Navigate to="/" replace />
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    },
    // Add router performance optimization
    defaultBehavior: {
      preventScrollReset: false
    }
  }
);

// Theme-aware ConfigProvider
const ThemedConfigProvider = ({ children }) => {
  const { getAntTheme } = useTheme();
  return (
    <ConfigProvider theme={getAntTheme()}>
      {children}
    </ConfigProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ThemedConfigProvider>
        <AntApp>
          <ErrorBoundary>
            <ResourcePreloader />
            <MessageProvider>
              <AppContent>
                <RouterProvider router={router} />
              </AppContent>
            </MessageProvider>
          </ErrorBoundary>
        </AntApp>
      </ThemedConfigProvider>
    </ThemeProvider>
  );
}

export default App;

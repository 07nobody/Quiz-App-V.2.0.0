import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import Login from './pages/common/Login';
import Register from './pages/common/Register';
import Home from './pages/common/Home';
import Profile from './pages/common/Profile';
import WriteExam from './pages/user/WriteExam/index.jsx';
import AdminReports from './pages/admin/AdminReports';
import UserReports from './pages/user/UserReports';
import Exams from './pages/admin/Exams';
import AddEditExam from './pages/admin/Exams/AddEditExam';
import AddEditQuestion from './pages/admin/Exams/AddEditQuestion';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/common/ForgotPassword';
import ResetPassword from './pages/common/ResetPassword';
import AvailableExams from './pages/user/AvailableExams';
import PaymentPortal from './pages/user/PaymentPortal';
import './stylesheets/theme.css';
import './stylesheets/alignments.css';
import './stylesheets/textelements.css';
import './stylesheets/custom-components.css';
import './stylesheets/form-elements.css';
import './stylesheets/layout.css';

// Create router outside the component to avoid recreating it on every render
const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { 
    path: "/", 
    element: <ProtectedRoute><Home /></ProtectedRoute> 
  },
  { 
    path: "/profile", 
    element: <ProtectedRoute><Profile /></ProtectedRoute> 
  },
  { 
    path: "/user/reports", 
    element: <ProtectedRoute><UserReports /></ProtectedRoute> 
  },
  { 
    path: "/available-exams", 
    element: <ProtectedRoute><AvailableExams /></ProtectedRoute> 
  },
  { 
    path: "/user/write-exam", 
    element: <ProtectedRoute><Navigate to="/available-exams" replace /></ProtectedRoute> 
  },
  { 
    path: "/user/write-exam/:id", 
    element: <ProtectedRoute><WriteExam /></ProtectedRoute> 
  },
  { 
    path: "/admin/reports", 
    element: <ProtectedRoute><AdminReports /></ProtectedRoute> 
  },
  { 
    path: "/admin/exams", 
    element: <ProtectedRoute><Exams /></ProtectedRoute> 
  },
  { 
    path: "/admin/exams/add", 
    element: <ProtectedRoute><AddEditExam /></ProtectedRoute> 
  },
  { 
    path: "/admin/exams/edit/:id", 
    element: <ProtectedRoute><AddEditExam /></ProtectedRoute> 
  },
  { 
    path: "/admin/exams/questions/:id", 
    element: <ProtectedRoute><AddEditQuestion /></ProtectedRoute> 
  },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:email", element: <ResetPassword /> },
  { 
    path: "/payment-portal/:examId", 
    element: <ProtectedRoute><PaymentPortal /></ProtectedRoute> 
  },
  // Add a catch-all route to handle any undefined paths
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);

function App() {
  const { loading } = useSelector(state => state.loader);
  
  return (
    <>
      {loading && (
        <div className="loader-parent">
          <Spin size="large" />
        </div>
      )}
      <RouterProvider router={router} />
    </>
  );
}

export default App;

import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import RecruiterDashboard from '../pages/RecruiterDashboard';
import CandidateDashboard from '../pages/CandidateDashboard';
import Layout from '../components/Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/register',
          element: <Register />
        },
        {
          element: <ProtectedRoute role="recruiter" />,
          children: [
            {
              path: '/recruiter/dashboard',
              element: <RecruiterDashboard />
            }
          ]
        },
        {
          element: <ProtectedRoute role="candidate" />,
          children: [
            {
              path: '/candidate/dashboard',
              element: <CandidateDashboard />
            }
          ]
        }
      ]
  }
]);
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Layout from '../components/Layout';

// Candidate Components
import CandidateDashboard from '../pages/CandidateDashboard/CandidateDashboard';
import Applications from '../pages/CandidateDashboard/Applications';
import ApplyForm from '../pages/CandidateDashboard/ApplyForm';
import OfferDetails from '../pages/CandidateDashboard/OfferDetails';
import OfferList from '../pages/CandidateDashboard/OfferList';

// Recruiter Components
import RecruiterDashboard from '../pages/RecruiterDashboard/RecruiterDashboard';
import OfferForm from '../pages/RecruiterDashboard/OfferForm';
import RecruiterApplications from '../pages/RecruiterDashboard/RecruiterApplications';
import Stats from '../pages/RecruiterDashboard/Stats';
import RecruiterOffers from '../pages/RecruiterDashboard/RecruiterOffers';

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
        element: <ProtectedRoute role="candidate" />,
        children: [
          {
            path: '/candidate/dashboard',
            element: <CandidateDashboard />,
            children: [
              {
                index: true,
                element: <Applications />
              },
              {
                path: 'offers',
                children: [
                  {
                    index: true,
                    element: <OfferList />
                  },
                  {
                    path: ':id',
                    element: <OfferDetails />
                  },
                  {
                    path: ':id/apply',
                    element: <ApplyForm />
                  }
                ]
              }
            ]
          }
        ]
      },

      {
        element: <ProtectedRoute role="recruiter" />,
        children: [
          {
            path: '/recruiter/dashboard',
            element: <RecruiterDashboard />,
            children: [
              {
                index: true,
                element: <RecruiterApplications />
              },
              {
                path: 'stats',
                element: <Stats />
              },
              {
                path: 'offers',
                children: [
                  {
                    index: true,
                    element: <RecruiterOffers />
                  },
                  {
                    path: 'new',
                    element: <OfferForm />
                  },
                  {
                    path: ':id/edit',
                    element: <OfferForm editMode={true} />
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]);
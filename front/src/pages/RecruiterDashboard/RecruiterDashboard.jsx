import { Outlet, Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  return (
    <div className="dashboard recruiter-dashboard">
      <nav>
        <Link to="/recruiter/dashboard">Applications</Link>
        <Link to="/recruiter/dashboard/stats">Statistics</Link>
        <Link to="/recruiter/dashboard/offers">Offers</Link>
      </nav>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default RecruiterDashboard;
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

const CandidateDashboard = () => {
  return (
    <div className="dashboard candidate-dashboard">
      <nav>
        <Link to="/candidate/dashboard">Applications</Link>
        <Link to="/candidate/dashboard/offers">Offers</Link>
      </nav>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default CandidateDashboard;
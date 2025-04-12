import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/candidate/applications');
        setApplications(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleWithdraw = async (appID) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    
    try {
      await api.delete(`/applications/${appID}/withdraw`);
      setApplications(prev => prev.filter(app => app.id !== appID));
      alert('Application withdrawn successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Withdrawal failed');
    }
  };
  console.log('Applications:', applications);
  if (loading) return <div className="loading">Loading applications...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!applications.length) return <p>No applications found. <Link to="/offers">Browse jobs</Link></p>;

  return (
    <div className="applications-list">
      <h2>My Applications</h2>
      {applications.map(app => (
        <div key={app.id} className="application-card">
          <div className="application-header">
            <h3>{app.offer?.title || 'Untitled Offer'}</h3>
            <span className={`status ${app.status}`}>
              {app.status?.toUpperCase()}
            </span>
          </div>
          
          <div className="application-details">
            <p><strong>Applied:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {app.offer?.location || 'N/A'}</p>
          </div>
          
          <div className="application-actions">
            <Link to={`/candidate/dashboard/offers/${app.offer?.id}`}>
              View Offer
            </Link>
              
            <button
              onClick={() => handleWithdraw(app.id)}
              disabled={!['pending', 'reviewed'].includes(app.status)}
              className={`btn withdraw-btn ${!['pending', 'reviewed'].includes(app.status) ? 'disabled' : ''}`}
            >
              Withdraw
            </button>
            
            {app.cv && (
              <a 
                href={`${api.defaults.baseURL}/storage/${app.cv}`} 
                download
                className="btn download-cv"
              >
                Download CV
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Applications;
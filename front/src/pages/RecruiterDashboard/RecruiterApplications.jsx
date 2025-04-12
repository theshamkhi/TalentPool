import { useEffect, useState } from 'react';
import api from '../../api/axios';

const RecruiterApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/recruiter/applications', {
          params: { status: selectedStatus === 'all' ? null : selectedStatus }
        });
        setApplications(response.data.data);
      } catch (err) {
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedStatus]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/updateStatus`, { status: newStatus });
      
      setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="simple-applications">
      <h1>Manage Applications</h1>
      
      {/* Status filter dropdown */}
      <div className="filter">
        <label>Filter by status: </label>
        <select 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applications list */}
      <div className="applications">
        {applications.map(app => (
          <div key={app.id} className="application">
            <div className="application-info">
              <h3>{app.candidate.name}</h3>
              <p>Applied for: {app.offer.title}</p>
              <p>Date: {new Date(app.created_at).toLocaleDateString()}</p>
            </div>

            <div className="application-actions">
              {/* Status dropdown */}
              <select
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value)}
              >
                {['pending', 'reviewed', 'accepted', 'rejected'].map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              {/* CV link */}
              <a 
                href={`${api.defaults.baseURL}/storage/${app.cv}`} 
                target="_blank" 
                rel="noreferrer"
              >
                View CV
              </a>
            </div>

            {/* Cover letter */}
            <div className="cover-letter">
              <p><strong>Cover Letter:</strong></p>
              <p>{app.letter}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterApplications;
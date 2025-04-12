import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Stats = () => {
  const [stats, setStats] = useState({
    total_offers: 0,
    total_applications: 0,
    applications_by_status: {},
    applications_by_offer: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/recruiter/statistics');
        
        setStats({
          total_offers: data?.total_offers || 0,
          total_applications: data?.total_applications || 0,
          applications_by_status: data?.applications_by_status || {},
          applications_by_offer: Array.isArray(data?.applications_by_offer) 
            ? data.applications_by_offer 
            : []
        });
        
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading statistics...</div>;
  if (error) return <div className="error">{error}</div>;

  const statusChartData = stats.applications_by_status 
    ? Object.entries(stats.applications_by_status).map(([status, count]) => ({ status, count }))
    : [];

  return (
    <div className="stats-container">
      <h2>Recruitment Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Offers</h3>
          <p>{stats.total_offers}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Applications</h3>
          <p>{stats.total_applications}</p>
        </div>

        <div className="chart-card">
          <h3>Applications by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusChartData}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="offer-stats">
          <h3>Applications per Offer</h3>
          {stats.applications_by_offer.length > 0 ? (
            <ul>
              {stats.applications_by_offer.map(offer => (
                <li key={offer.offer_title || Math.random()}>
                  {offer.offer_title || 'Untitled Offer'}: {offer.total_applications || 0}
                  {offer.applications_by_status && (
                    <ul>
                      {Object.entries(offer.applications_by_status).map(([status, count]) => (
                        <li key={status}>{status}: {count}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No offer statistics available</p>
          )}
        </div>
      </div>
    </div>
  );
};


export default Stats;
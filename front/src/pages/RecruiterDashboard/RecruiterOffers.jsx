import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import api from '../../api/axios';

const RecruiterOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await api.get('/offers');
        setOffers(data);
      } catch (error) {
        setError('Failed to load offers');
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    
    try {
      await api.delete(`/offers/${id}`);
      setOffers(offers.filter(offer => offer.id !== id));
    } catch (error) {
      alert('Failed to delete offer');
      console.error('Error deleting offer:', error);
    }
  };

  if (loading) return <div>Loading your offers...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!offers.length) return <div>No offers found</div>;

  return (
    <div className="dashboard-section">
      <h2>Your Job Offers</h2>
      <Link to="new" className="create-button">
        Create New Offer
      </Link>
      
      <div className="offers-list">
        {offers.map(offer => (
          <div key={offer.id} className="offer-item">
            <h3>{offer.title}</h3>
            <div className="offer-actions">
              <Link to={`${offer.id}/edit`} className="edit-button">
                Edit
              </Link>
              <button 
                onClick={() => handleDelete(offer.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Render nested routes */}
      <Outlet />
    </div>
  );
};

export default RecruiterOffers;
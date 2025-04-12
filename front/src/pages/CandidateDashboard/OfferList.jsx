import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const OfferList = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await api.get('/offers');
        setOffers(data);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) return <div>Loading offers...</div>;

  return (
    <div className="dashboard-section">
      <h2>Available Job Offers</h2>
      <div className="offers-grid">
        {offers.map(offer => (
          <div key={offer.id} className="offer-card">
            <h3>{offer.title}</h3>
            <p>{offer.location}</p>
            <Link to={`/candidate/dashboard/offers/${offer.id}`}>
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferList;
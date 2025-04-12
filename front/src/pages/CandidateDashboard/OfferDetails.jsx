import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const OfferDetails = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {        
        if (!id) {
          throw new Error('Missing offer ID');
        }

        const { data } = await api.get(`/offers/${id}`);
        setOffer(data);
      } catch (err) {
        console.error('API Error:', err.response);
        setError(err.response?.data?.message || 'Failed to load offer');
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  if (loading) return <div>Loading offer details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!offer) return <div>Offer not found</div>;

  return (
    <div className="offer-details">
      <h2>{offer.title}</h2>
      <div className="details">
        <p><strong>Location:</strong> {offer.location}</p>
        <p><strong>Requirements:</strong> {offer.requirements}</p>
        <p><strong>Description:</strong> {offer.description}</p>
      </div>
      <div className="offer-actions">
        <Link to={`/candidate/dashboard/offers/${offer.id}/apply`} className="apply-button">
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default OfferDetails;
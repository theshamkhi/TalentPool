import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

const OfferForm = ({ editMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    requirements: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editMode) {
      const fetchOffer = async () => {
        try {
          const { data } = await api.get(`/offers/${id}`);
          setFormData(data);
        } catch (error) {
          console.error('Error fetching offer:', error);
        }
      };
      fetchOffer();
    }
  }, [id, editMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editMode) {
        await api.put(`/offers/${id}`, formData);
      } else {
        await api.post('/offers', formData);
      }
      navigate('/recruiter/dashboard');
    } catch (error) {
      console.error('Error saving offer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-form">
      <h2>{editMode ? 'Edit Offer' : 'Create New Offer'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Requirements:</label>
          <textarea
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Offer'}
        </button>
      </form>
    </div>
  );
};

export default OfferForm;
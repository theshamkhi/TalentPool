import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ApplyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [letter, setLetter] = useState('');
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cv) return setError('Please upload your CV');
    
    setLoading(true);
    const formData = new FormData();
    formData.append('cv', cv);
    formData.append('letter', letter);
    formData.append('offer_id', id);
  
    try {
      console.log('Submitting to:', `/offers/${id}/apply`);
      await api.post(`/offers/${id}/apply`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        }
      });
      navigate('/candidate/dashboard');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('You have already applied to this position');
      } else {
        setError(err.response?.data?.message || 'Application failed. Please try again.');
      }
      console.error('Application error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-form">
      <h2>Apply to Job Offer</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>CV (PDF/DOC):</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCv(e.target.files[0])}
            required
          />
        </div>

        <div className="form-group">
          <label>Cover Letter:</label>
          <textarea
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            placeholder="Explain why you're a good fit..."
            required
          />
        </div>

        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplyForm;
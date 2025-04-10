import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role: role
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/register', formData);
      navigate('/login');
      
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create Your Account</h2>
      
      {/* Error message display */}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
            placeholder="At least 8 characters"
          />
        </div>

        {/* Role Selection */}
        <div className="form-group role-selection">
          <label>Register as:</label>
          <div className="role-options">
            <label>
              <input
                type="radio"
                name="role"
                checked={formData.role === 'candidate'}
                onChange={() => handleRoleChange('candidate')}
              />
              Candidate
            </label>
            <label>
              <input
                type="radio"
                name="role"
                checked={formData.role === 'recruiter'}
                onChange={() => handleRoleChange('recruiter')}
              />
              Recruiter
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      {/* Login Link */}
      <p className="login-link">
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const role = await login(email, password);
      navigate(role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (error) {
      alert('Login failed: ' + (
        error.response?.data?.message || 
        error.message || 
        'Unknown error'
      ));
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        {/* Password Input */}
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="auth-button">
          Login
        </button>
      </form>

      <p className="auth-link">
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      {!user && <Link to="/login">Login</Link>}
      {!user && <Link to="/register">Register</Link>}
      {user && (<button onClick={logout}>Logout ({user.role})</button>)}
    </nav>
  );
}
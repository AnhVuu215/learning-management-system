import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="nav">
      <div className="nav__brand">
        <Link to="/">LMS</Link>
      </div>
      <nav className="nav__links">
        <Link to="/">Home</Link>
        {user && <Link to="/dashboard">Dashboard</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && (
          <button type="button" onClick={handleLogout} className="btn btn--ghost">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;


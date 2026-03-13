import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>🌐 Network Monitor</h2>
      </div>
      <div className="nav-links">
        <Link to="/" className={isActive('/') ? 'active' : ''}>
          Live Monitor
        </Link>
        <Link to="/history" className={isActive('/history') ? 'active' : ''}>
          Historical Data
        </Link>
        <Link to="/alerts" className={isActive('/alerts') ? 'active' : ''}>
          Security Alerts
        </Link>
      </div>
    </nav>
  );
}
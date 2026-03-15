import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>Chopped or Not</h1>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {isAuthenticated ? (
          <>
            <Link to="/feed">Feed</Link>
            <Link to="/search">Discover</Link>
            <Link to="/saved">Saved</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/messages">Messages</Link>
            <Link to="/notifications">Notifications</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} className="logout-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

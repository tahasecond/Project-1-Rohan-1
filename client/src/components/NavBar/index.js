import React from 'react';
import logoImage from '../../assets/images/buzz.svg.png';
import { Link } from 'react-router-dom';
import './styles.css';

function NavBar() {
  return (
    <nav className="navbar">
      {/* Clickable logo button that redirects to the homepage */}
      <Link to="/" className="navbar-home-button">
        <img src={logoImage} alt="Home Logo" className="home-logo" />
        <span className="home-text">GT Movies</span>
      </Link>

        <ul className="navbar-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/movies">Movies</Link></li>
            <li><Link to="/reviews">My Reviews</Link></li>
            <li><Link to="/about">About Us</Link></li>
        </ul>

<<<<<<< Updated upstream
      <div className="navbar-auth">
        <button>Sign In</button>
        <button>Register</button>
      </div>
=======
        <div className="navbar-auth">
            <button>Sign In</button>
            <button>Register</button>
        </div>
>>>>>>> Stashed changes
    </nav>
  );
}

export default NavBar;

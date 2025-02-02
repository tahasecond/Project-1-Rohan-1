import React from 'react';
import logoImage from '../../assets/images/buzz.svg.png';
import './styles.css';

function NavBar() {
  return (
    <nav className="navbar">
      {/* Clickable logo button that redirects to the homepage */}
      <a href="/" className="navbar-home-button">
        <img src={logoImage} alt="Home Logo" className="home-logo" />
        <span className="home-text">GT Movies</span>
      </a>

      <ul className="navbar-links">
        <li><a href="/movies">Movies</a></li>
        <li><a href="/reviews">My Reviews</a></li>
        <li><a href="/cart">Cart</a></li>
      </ul>

      <div className="navbar-auth">
        <button>Sign In</button>
        <button>Register</button>
      </div>
    </nav>
  );
}

export default NavBar;

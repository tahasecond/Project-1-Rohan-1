import React from 'react';
import './styles.css';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">My Movie Site</div>
      <ul className="navbar-links">
        <li><a href="/">Home</a></li>
        <li><a href="/movies">Movies</a></li>
        <li><a href="/reviews">My Reviews</a></li>
        <li><a href="/about">About Us</a></li>
      </ul>
      <div className="navbar-auth">
        <button>Sign In</button>
        <button>Register</button>
      </div>
    </nav>
  );
}

export default NavBar;

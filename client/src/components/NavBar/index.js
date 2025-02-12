import React from 'react';
import { Link } from 'react-router-dom';
import { logoutUser } from "../../api";

import logoImage from '../../assets/images/buzz.svg.png';
import './styles.css';

function NavBar() {
  const handleLogout = () => {
    logoutUser();
    window.location.reload();
  }

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
            <li><Link to="/checkout">Checkout</Link></li>
        </ul>

      <div className="navbar-auth">
        <button onClick = {handleLogout}> Log Out </button>
      </div>
    </nav>
  );
}

export default NavBar;

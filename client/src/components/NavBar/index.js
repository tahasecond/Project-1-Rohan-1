import React, { useState, useRef, useEffect } from "react";
import logoImage from '../../assets/images/buzz.svg.png';
import { Link } from 'react-router-dom';
import './styles.css';
import { FaUserCircle } from "react-icons/fa";

function NavBar({ setIsAuthenticated }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
      <nav className="navbar">
          {/* Clickable logo button that redirects to the homepage */}
          <Link to="/" className="navbar-home-button">
              <img src={logoImage} alt="Home Logo" className="home-logo"/>
              <span className="home-text">GT Movies</span>
          </Link>

          <ul className="navbar-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/movies">Movies</Link></li>
              <li><Link to="/reviews">My Reviews</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
          </ul>
          <div className="profile-dropdown" ref={dropdownRef}>
              <FaUserCircle className="profile-icon" onClick={toggleDropdown}/>
              {isDropdownOpen && (
                  <div className="dropdown-menu">
                      <Link to="/profile" className="dropdown-item">Profile</Link>
                      <button onClick={handleLogout} className="dropdown-item">Log Out</button>
                  </div>
              )}
          </div>
      </nav>
  );
}

export default NavBar;

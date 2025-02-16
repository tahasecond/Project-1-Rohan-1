import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "../../api";

import logoImage from "../../assets/images/buzz.svg.png";
import "./styles.css";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";

function NavBar() {
  const handleLogout = () => {
    logoutUser();
    window.location.reload();
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cartDropdownRef = useRef(null);
  const [totalMovies, setMovieCount] = useState([0]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartUpdated, setCartUpdated] = useState(false);
  const token = localStorage.getItem("token");
  console.log(token);
  // Example cart items (replace with actual cart data)
  const cartItems = [
    { id: 1, price: 14.99 },
    { id: 2, price: 12.99 },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsCartOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    setIsDropdownOpen(false);
  };

  const accumulateTotal = async () => {
    try {
      if (!token) {
        console.error("Token not found. User might not be logged in.");
        return;
      }

      console.log("Fetching user email...");
      const emailResponse = await fetch(
        `http://localhost:8000/api/email/${token}/`
      );

      if (!emailResponse.ok) {
        throw new Error("Failed to fetch user email");
      }

      const emailData = await emailResponse.json();
      const userEmail = emailData.user;

      if (!userEmail) {
        throw new Error("User email not retrieved correctly");
      }

      console.log("User Email:", userEmail);

      console.log("Fetching cart data...");
      const response = await fetch(
        `http://localhost:8000/api/cart/${userEmail}/`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cart data");
      }

      let cartData = await response.json();
      console.log("Raw Cart Data:", cartData);

      // ✅ Extract cart array properly
      if (!cartData || !Array.isArray(cartData.cart)) {
        throw new Error("Invalid cart data received");
      }

      const cartArray = cartData.cart; // Extract cart array
      console.log("Extracted Cart Array:", cartArray);

      // Calculate total price and number of movies
      const totalPrice = cartArray.reduce((sum, movie) => {
        const price = parseFloat(movie.price);
        return sum + (isNaN(price) ? 0 : price); // Ensure no NaN
      }, 0);

      const movieCount = cartArray.length;

      console.log("Total Price:", totalPrice);
      console.log("Total Movies:", movieCount);

      setTotalPrice(totalPrice);
      setMovieCount(movieCount);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    accumulateTotal();
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen]);

  return (
    <nav className="navbar">
      {/* Clickable logo button that redirects to the homepage */}
      <Link to="/" className="navbar-home-button">
        <img src={logoImage} alt="Home Logo" className="home-logo" />
        <span className="home-text">GT Movies</span>
      </Link>

      <div className="nav-icons">
        <div className="cart-dropdown" ref={cartDropdownRef}>
          <div className="cart-icon-wrapper">
            <FaShoppingCart className="cart-icon" onClick={toggleCart} />
            <span className="cart-count">{totalMovies}</span>
          </div>
          {isCartOpen && (
            <div className="cart-menu">
              <h3>Cart Summary</h3>
              <div className="cart-summary">
                <p>Items: {totalMovies}</p>
                <p>Total: ${totalPrice}</p>
              </div>
              <Link to="/checkout" className="checkout-link">
                Checkout Now
              </Link>
            </div>
          )}
        </div>

        <div className="profile-dropdown" ref={dropdownRef}>
          <FaUserCircle className="profile-icon" onClick={toggleDropdown} />
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">
                Profile
              </Link>
              <button onClick={handleLogout} className="dropdown-item">
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

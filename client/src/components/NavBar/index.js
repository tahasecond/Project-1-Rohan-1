import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { logoutUser } from "../../api";

import logoImage from '../../assets/images/buzz.svg.png';
import './styles.css';
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";

function NavBar() {
    const handleLogout = () => {
        logoutUser();
        window.location.reload();
    }
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const dropdownRef = useRef(null);
    const cartDropdownRef = useRef(null);

    // Example cart items (replace with actual cart data)
    const cartItems = [
        { id: 1, price: 14.99 },
        { id: 2, price: 12.99 }
    ];
    
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        setIsCartOpen(false);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
                setIsCartOpen(false);
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
            
            <div className="nav-icons">
                <div className="cart-dropdown" ref={cartDropdownRef}>
                    <div className="cart-icon-wrapper">
                        <FaShoppingCart className="cart-icon" onClick={toggleCart}/>
                        <span className="cart-count">{cartItems.length}</span>
                    </div>
                    {isCartOpen && (
                        <div className="cart-menu">
                            <h3>Cart Summary</h3>
                            <div className="cart-summary">
                                <p>Items: {cartItems.length}</p>
                                <p>Total: ${cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</p>
                            </div>
                            <Link to="/checkout" className="checkout-link">
                                Checkout Now
                            </Link>
                        </div>
                    )}
                </div>

                <div className="profile-dropdown" ref={dropdownRef}>
                    <FaUserCircle className="profile-icon" onClick={toggleDropdown}/>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <Link to="/profile" className="dropdown-item">Profile</Link>
                            <button onClick={handleLogout} className="dropdown-item">Log Out</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;

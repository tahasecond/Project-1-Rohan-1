import React, { useState, useRef, useEffect } from "react";
import logoImage from '../../assets/images/buzz.svg.png';
import { Link } from 'react-router-dom';
import './styles.css';
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";

function NavBar({ setIsAuthenticated }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const dropdownRef = useRef(null);
    const cartDropdownRef = useRef(null);

    // Example cart items (replace with actual cart data)
    const cartItems = [
        { 
            id: 1, 
            title: "Movie 1", 
            price: 14.99,
            image: "https://image.tmdb.org/t/p/w500/example1.jpg"
        },
        { 
            id: 2, 
            title: "Movie 2", 
            price: 12.99,
            image: "https://image.tmdb.org/t/p/w500/example2.jpg"
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

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

            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/movies">Movies</Link></li>
                <li><Link to="/reviews">My Reviews</Link></li>
            </ul>
            
            <div className="nav-icons">
                <div className="cart-dropdown" ref={cartDropdownRef}>
                    <FaShoppingCart className="cart-icon" onClick={toggleCart}/>
                    {isCartOpen && (
                        <div className="cart-menu">
                            <h3>Shopping Cart</h3>
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="cart-item-image"
                                    />
                                    <div className="cart-item-details">
                                        <span className="cart-item-title">{item.title}</span>
                                        <span className="cart-item-price">${item.price}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="cart-total">
                                <strong>Total: ${cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</strong>
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

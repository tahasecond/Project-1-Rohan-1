import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
import './styles.css';

const CheckOut = ({ setIsAuthenticated }) => {
    // State to manage form input values
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
    });

    // Example movie data (replace with your actual data) //api call to get movie data
    const movieOrder = {
        title: "Example Movie", //api call to get movie title
        image: "/path-to-movie-image.jpg", //api call to get movie image
        price: 0.00 //api call to get movie price
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target; 
        setFormData(prevState => ({ //
            ...prevState,
            [name]: value
        }));
    };

    // Process form submission 
    const handleSubmit = (e) => {
        e.preventDefault();
       
        console.log('Order submitted:', formData);
    };

    return (
        <div>
            <NavBar setIsAuthenticated = {setIsAuthenticated}/>
            <div className="checkout-container">
                <div className="checkout-content">
                    <div className="order-summary">
                        <h2>Order Summary</h2>
                        <div className="movie-details">
                            <img src={movieOrder.image} alt={movieOrder.title} className="movie-image" />
                            <div className="movie-info">
                                <h3>{movieOrder.title}</h3>
                                <p>${movieOrder.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="total-section">
                            <h3>Total: ${movieOrder.price.toFixed(2)}</h3>
                        </div>
                    </div>

                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <h2>Shipping Information</h2>
                        <div className="form-row">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Shipping Address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="form-row">
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="zipCode"
                                placeholder="ZIP Code"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="checkout-button">
                            Complete Purchase
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckOut;
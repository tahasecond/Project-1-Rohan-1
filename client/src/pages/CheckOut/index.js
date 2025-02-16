import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import "./styles.css";

const CheckOut = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const emailResponse = await fetch(
        `http://localhost:8000/api/email/${token}/`
      );
      if (!emailResponse.ok) {
        throw new Error("Failed to fetch user email");
      }
      const emailData = await emailResponse.json();
      const userEmail = emailData.user;

      const cartResponse = await fetch(
        `http://localhost:8000/api/cart/${userEmail}/`
      );
      if (!cartResponse.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data = await cartResponse.json();

      setCart(data.cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const deleteFromCart = async (movieId) => {
    try {
      const emailResponse = await fetch(
        `http://localhost:8000/api/email/${token}/`
      );
      if (!emailResponse.ok) {
        throw new Error("Failed to fetch user email");
      }
      const emailData = await emailResponse.json();
      const userEmail = emailData.user;

      const response = await fetch(
        `http://localhost:8000/api/cart/${userEmail}/${movieId}/`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to remove movie from cart");
      }

      setCart(cart.filter((movie) => movie.movie_id !== movieId));
    } catch (error) {
      console.error("Error removing movie from cart:", error);
    }
  };

  const checkOut = async () => {
    try {
      // Step 1: Fetch the user's wallet
      const walletResponse = await fetch(
        `http://localhost:8000/api/wallet/${token}/`
      );
      if (!walletResponse.ok) {
        throw new Error("Failed to fetch wallet");
      }
      const walletData = await walletResponse.json();
      const currentWalletBalance = walletData.wallet;

      // Step 2: Calculate the total price of the cart
      const totalAmount = cart.reduce(
        (total, movie) => total + (movie.price || 0),
        0
      );

      // Step 3: Check if the user has sufficient funds
      if (currentWalletBalance < totalAmount) {
        alert("Insufficient funds in your wallet.");
        return;
      }

      // Step 4: Delete all items from the user's cart
      const emailResponse = await fetch(
        `http://localhost:8000/api/email/${token}/`
      );
      if (!emailResponse.ok) {
        throw new Error("Failed to fetch user email");
      }
      const emailData = await emailResponse.json();
      const userEmail = emailData.user;

      // Delete items from the cart
      for (let movie of cart) {
        const deleteResponse = await fetch(
          `http://localhost:8000/api/cart/${userEmail}/${movie.movie_id}/`,
          { method: "DELETE" }
        );
        if (!deleteResponse.ok) {
          throw new Error("Failed to remove movie from cart");
        }
      }

      // Step 5: Update the user's wallet balance
      const updatedWalletBalance = currentWalletBalance - totalAmount;
      const updateWalletResponse = await fetch(
        `http://localhost:8000/api/wallet/${token}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet: updatedWalletBalance }),
        }
      );
      if (!updateWalletResponse.ok) {
        throw new Error("Failed to update wallet");
      }

      // Step 6: Create orders for the movies in the cart

      for (let movie of cart) {
        console.log("TITLE: " + movie.title);
        console.log("ID: " + movie.movie_id);
        console.log("image: " + movie.image);
        console.log("TITLE2: " + movie.movie_title);
        const orderResponse = await fetch(`http://localhost:8000/api/order/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: userEmail, // Ensure this is correct
            movie: movie.movie_id, // Send the movie ID
            movie_title: movie.movie_title, // Send the movie title
            image: movie.image, // Send the movie image URL (if available)
          }),
        });

        if (!orderResponse.ok) {
          const errorData = await orderResponse.text(); // Log response text
          console.error("Order creation failed:", errorData);
          throw new Error(`Failed to create order: ${errorData}`);
        }
      }

      // Clear the cart after successful checkout
      setCart([]);

      alert("Purchase completed successfully!");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order submitted:", formData);
  };

  return (
    <div>
      <NavBar setIsAuthenticated={setIsAuthenticated} />
      <div className="checkout-container">
        <div className="checkout-content">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-summary">
              {cart.length > 0 ? (
                cart.map((movie) => (
                  <div key={movie.movie_id} className="movie-details">
                    <img
                      src={movie.image}
                      alt={movie.movie_title}
                      className="movie-image"
                    />
                    <div className="movie-info">
                      <h3>{movie.movie_title}</h3>
                      <p>${movie.price.toFixed(2)}</p>
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => deleteFromCart(movie.movie_id)}
                    >
                      ❌
                    </button>
                  </div>
                ))
              ) : (
                <p>Your cart is empty.</p>
              )}
              <div className="total-section">
                <h3>
                  Total: $
                  {cart
                    .reduce((total, movie) => total + (movie.price || 0), 0)
                    .toFixed(2)}
                </h3>
              </div>
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
            <button
              type="submit"
              className="checkout-button"
              onClick={checkOut}
            >
              Complete Purchase
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;

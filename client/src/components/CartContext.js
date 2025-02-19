import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    items: [],
    totalPrice: 0,
    totalMovies: 0,
  });

  // This function fetches cart data from the backend
  const updateCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // First, fetch user email
      const emailResponse = await fetch(`https://gtmovies.onrender.com/api/email/${token}/`);
      if (!emailResponse.ok) throw new Error("Failed to fetch user email");
      const { user: userEmail } = await emailResponse.json();
      if (!userEmail) throw new Error("User email not retrieved correctly");

      // Now, fetch the cart data
      const response = await fetch(`https://gtmovies.onrender.com/api/cart/${userEmail}/`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to fetch cart data");
      
      const cartData = await response.json();
      if (!cartData || !Array.isArray(cartData.cart)) {
        throw new Error("Invalid cart data received");
      }
      const items = cartData.cart;
      const totalPrice = items.reduce((sum, movie) => {
        const price = parseFloat(movie.price);
        return sum + (isNaN(price) ? 0 : price);
      }, 0);
      const totalMovies = items.length;

      setCart({ items, totalPrice, totalMovies });
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  // On mount, fetch the initial cart data.
  useEffect(() => {
    updateCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, updateCart }}>
      {children}
    </CartContext.Provider>
  );
}

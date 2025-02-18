// App.js
import "./App.css";
import LandingPage from "./pages/LandingPage";
import CheckOut from "./pages/CheckOut";
import MovieDetails from "./pages/MovieDetails";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import MyMoviesPage from "./pages/MyMoviesPage";
import ProfilePage from "./pages/ProfilePage";
import MyReviews from "./pages/MyReviews";
import ResetPassword from "./pages/ResetPassword";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { isAuthenticated } from "./api";
import { CartProvider } from "./components/CartContext"; // Import our Cart Context Provider

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  return (
    <CartProvider>
      <Router basename="/">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />
          <Route
            path="/signup"
            element={isLoggedIn ? <Navigate to="/" /> : <SignUp />}
          />
          <Route
            path="/forgotpassword"
            element={isLoggedIn ? <Navigate to="/" /> : <ForgotPassword />}
          />
          <Route
            path="/resetpassword"
            element={isLoggedIn ? <Navigate to="/" /> : <ResetPassword />}
          />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={isLoggedIn ? <PrivateRoutes /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/moviedetails/:id" element={<MovieDetails />} />
      <Route path="/mymoviespage" element={<MyMoviesPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/checkout" element={<CheckOut />} />
      <Route path="/myreviews" element={<MyReviews />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
export default App;

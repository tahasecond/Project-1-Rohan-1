import "./App.css";
import LandingPage from "./pages/LandingPage";
import CheckOut from "./pages/CheckOut";
import MovieDetails from "./pages/MovieDetails";

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import Login from "./pages/LogIn";
import SignUp from "./pages/SignUp";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // later will start at false

  useEffect(() => {
    const auth = localStorage.getItem("token");
    if (auth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    // django login logic
    setIsAuthenticated(true);
    localStorage.setItem("token", "true");
  };
  return (
    <Router basename="/">
      <Routes>
        {/* mapping routes to components */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/moviedetails/:id"
          element={
            isAuthenticated ? (
              <MovieDetails setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/checkout"
          element={
            isAuthenticated ? (
              <CheckOut setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <LandingPage setIsAuthenticated={setIsAuthenticated} /> // sending authentication check to landingpage (for logout button)
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

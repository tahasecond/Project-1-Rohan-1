import "./App.css";
import LandingPage from "./pages/LandingPage";
import CheckOut from "./pages/CheckOut";
import MovieDetails from "./pages/MovieDetails";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import { isAuthenticated } from "./api";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") == "true";
  });
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <Router basename="/">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={isLoggedIn ? <Navigate to = "/" /> : <Login setIsLoggedIn = {setIsLoggedIn} />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to = "/" /> : <SignUp />} />

        {/* Protected Routes */}
        <Route path = "/*" element = {isLoggedIn ? <PrivateRoutes /> : <Navigate to = "/login" />} />
      </Routes>
    </Router>
  );
}

function PrivateRoutes() {
  return (
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/moviedetails/:id" element={<MovieDetails />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
export default App;
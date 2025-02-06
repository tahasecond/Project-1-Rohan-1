import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import SearchBar from "../../components/SearchBar";
import MovieTile from "../../components/MovieTile";
import "./styles.css";
import { BrowserRouter as Navigate } from "react-router-dom";

function LandingPage({ setIsAuthenticated }) {
  const [movies, setMovies] = useState([]); // setting up movie request
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    fetchMovies();
  }, []); //request movies

  const fetchMovies = async () => {
    try {
      console.log("Fetching movies...");
      const response = await fetch("http://localhost:8000/api/movies/");
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      console.log("Movies data:", data); // Log the data

      const firstMovie = data[0];
      const secondMovie = data[1];
      const thirdMovie = data[2];
      const fourthMovie = data[3];
      const fifthMovie = data[4];
      const sixthMovie = data[5];
      const seventhMovie = data[6];
      const eigthMovie = data[7];
      const ninthMovie = data[8];
      const tenthMovie = data[9];

      setMovies([
        {
          id: firstMovie.id,
          title: firstMovie.title,
          image: firstMovie.image,
        },
        {
          id: secondMovie.id,
          title: secondMovie.title,
          image: secondMovie.image,
        },
        {
          id: thirdMovie.id,
          title: thirdMovie.title,
          image: thirdMovie.image,
        },
        {
          id: fourthMovie.id,
          title: fourthMovie.title,
          image: fourthMovie.image,
        },
        {
          id: fifthMovie.id,
          title: fifthMovie.title,
          image: fifthMovie.image,
        },
        {
          id: sixthMovie.id,
          title: sixthMovie.title,
          image: sixthMovie.image,
        },
        {
          id: seventhMovie.id,
          title: seventhMovie.title,
          image: seventhMovie.image,
        },
        {
          id: eigthMovie.id,
          title: eigthMovie.title,
          image: eigthMovie.image,
        },
        {
          id: ninthMovie.id,
          title: ninthMovie.title,
          image: ninthMovie.image,
        },
        {
          id: tenthMovie.id,
          title: tenthMovie.title,
          image: tenthMovie.image,
        },
      ]);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError(error.message); // Set error state
      setLoading(false); // Set loading to false if there's an error
    }
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // whatever search logic we want to find about (movies or reviews) goes here
  };

  // Example movie data (replace with actual data later)
  const exampleMovies = [
    {
      id: 1,
      title: "The Dark Knight",
      image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      price: 14.99,
    },
    {
      id: 2,
      title: "Inception",
      image: "https://image.tmdb.org/t/p/w500/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg",
      price: 12.99,
    },
  ];

  return (
      <div className="landing-page">
        <NavBar setIsAuthenticated={setIsAuthenticated}/>


        <div className="content">
          <h1>Welcome to GT Movies</h1>
          <div id="aboutContainer">
            <h3>GT MOVIES STORE LETS YOU...</h3>
            <div id="aboutBoxes">
              <ul>
                <li>
                  <div className="aboutBox">Quickly find movies by title and explore detailed information.</div>
                </li>
                <li>
                  <div className="aboutBox">Get the latest movie selections and deals.</div>
                </li>
                <li>
                  <div className="aboutBox">Enjoy a smooth and responsive experience on any device.</div>
                </li>
                <li>
                  <div className="aboutBox">Register, log in, and manage your shopping cart with ease.</div>
                </li>
                <li>
                  <div className="aboutBox">Browse, search, and shop for your favorite movies effortlessly.</div>
                </li>
                <li>
                  <div className="aboutBox">Write and share reviews!</div>
                </li>
              </ul>
            </div>
          </div>
          <SearchBar onSearch={handleSearch}/>
          <div className="movies-container">
            {movies.map((movie) => (
                <MovieTile key={movie.id} movie={movie}/>
            ))}
          </div>
        </div>
      </div>
  )
}

export default LandingPage;

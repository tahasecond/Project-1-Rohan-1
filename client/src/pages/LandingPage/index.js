import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import SearchBar from "../../components/SearchBar";
import MovieTile from "../../components/MovieTile";
import "./styles.css";
import { BrowserRouter as Navigate } from "react-router-dom";

function LandingPage({ setIsAuthenticated }) {
  const [movies, setMovies] = useState([]); // setting up movie request

  useEffect(() => {
    fetchMovies();
  }, []); //request movies

  const fetchMovies = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/movies/"); // needs to change if URL changes occur
      const data = await response.json();

      const firstMovie = data[0];
      const secondMovie = data[1];

      setMovies([
        {
          id: firstMovie.id,
          title: firstMovie.title,
          image: firstMovie.poster_path,
        },
        {
          id: secondMovie.id,
          title: secondMovie.title,
          image: secondMovie.image,
        },
      ]);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }; //method for fetching movies

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
      <NavBar setIsAuthenticated={setIsAuthenticated} />
      <div className="content">
        <h1>Welcome to GT Movies</h1>
        <SearchBar onSearch={handleSearch} />
        <div className="movies-container">
          {movies.map((movie) => (
            <MovieTile key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

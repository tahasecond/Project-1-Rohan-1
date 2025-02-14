import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import SearchBar from "../../components/SearchBar";
import MovieTile from "../../components/MovieTile";
import "./styles.css";

function SearchPage({ setIsAuthenticated }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Extract search query from URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";

  // Fetch movies when query changes
  useEffect(() => {
    if (query) {
      fetchMovies(query);
    }
  }, [query, location.search]); // Added `location.search` as a dependency

  const fetchMovies = async (query) => {
    setLoading(true); // Start loading
    setError(null); // Reset error state

    try {
      console.log("Fetching movies for:", query);
      const response = await fetch(
        `http://localhost:8000/api/movies/?search=${query}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      setMovies(data); // Only take top 10 movies
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError(error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSearch = (query) => {
    navigate(`/search?q=${query}`, { replace: false });
  };

  return (
    <div className="search-page">
      <NavBar setIsAuthenticated={setIsAuthenticated} />
      <div className="content">
        <SearchBar onSearch={handleSearch} />

        {loading && <p>Loading movies...</p>}
        {error && <p>Error: {error}</p>}

        <div className="movies-container">
          {movies.length > 0
            ? movies.map((movie) => <MovieTile key={movie.id} movie={movie} />)
            : !loading && <p>No movies found.</p>}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;

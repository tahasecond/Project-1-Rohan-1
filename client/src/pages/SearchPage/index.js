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

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (query) {
      fetchMovies(query);
    }
  }, [query, location.search]);

  const fetchMovies = async (query) => {
    setLoading(true); 
    setError(null); 

    try {
      console.log("Fetching movies for:", query);
      const response = await fetch(
        `https://gtmovies.onrender.com/api/movies/?search=${query}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError(error.message);
    } finally {
      setLoading(false); 
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

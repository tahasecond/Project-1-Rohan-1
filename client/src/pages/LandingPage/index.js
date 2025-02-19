import "./styles.css";
import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import SearchBar from "../../components/SearchBar";
import MovieTile from "../../components/MovieTile";

function LandingPage({ isLoggedIn }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch("https://gtmovies.onrender.com/api/custommovies/");
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      setMovies(
        data.slice(0, 10).map((movie) => ({
          id: movie.id,
          title: movie.title,
          image: movie.image,
        }))
      );

      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      <NavBar />

      <div className="content">
        <h1>Welcome to GT Movies</h1>
        <div id="aboutContainer">
          <h3>GT MOVIES STORE LETS YOU...</h3>
          <div id="aboutBoxes">
            <ul>
              <li>
                <div className="aboutBox">
                  Quickly find movies by title and explore detailed information.
                </div>
              </li>
              <li>
                <div className="aboutBox">
                  Get the latest movie selections and deals.
                </div>
              </li>
              <li>
                <div className="aboutBox">
                  Enjoy a smooth and responsive experience on any device.
                </div>
              </li>
              <li>
                <div className="aboutBox">
                  Register, log in, and manage your shopping cart with ease.
                </div>
              </li>
              <li>
                <div className="aboutBox">
                  Browse, search, and shop for your favorite movies
                  effortlessly.
                </div>
              </li>
              <li>
                <div className="aboutBox">Write and share reviews!</div>
              </li>
            </ul>
          </div>
        </div>
        <SearchBar />
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

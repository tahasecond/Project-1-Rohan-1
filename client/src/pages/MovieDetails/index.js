import { useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import ReviewSection from "../../components/ReviewSection";
import "./styles.css";
import React, { useEffect, useState } from "react";

function MovieDetails({ setIsAuthenticated }) {
  const [movie, setMovie] = useState([null]); // setting up movie request
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { id } = useParams();

  console.log("Movie ID from URL:", id);

  useEffect(() => {
    fetchMovies();
  }, [id]); //request movies
  const fetchMovies = async () => {
    try {
      console.log("Fetching movie...");
      const response = await fetch(`http://localhost:8000/api/movies/`);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      // Find the movie by id
      const movieDetails = data.find((movie) => movie.id === parseInt(id)); // filter by id
      setMovie(movieDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setError(error.message); // Set error state
      setLoading(false); // Set loading to false if there's an error
    }
  };

  return (
    <div>
      <NavBar setIsAuthenticated={setIsAuthenticated} />
      <div
        className="movie-container"
        style={{
          backgroundImage: movie?.image ? `url(${movie.image})` : "",
        }}
      >
        <div className="overlay"></div>
        <div className="movie-content">
          <h1 id="movie-title">{movie?.title || "No title available"}</h1>
          <p id="description">
            {movie?.description || "No description available"}
          </p>
          <p id="rating">{movie?.rating || "no rating available"}</p>
          <h4 id="movie-price">$49.99</h4>
          <div className="button-group">
            <button className="btn">Buy Now!</button>
            <button className="btn">Add to Cart</button>
          </div>
        </div>
      </div>
      <ReviewSection />
    </div>
  );
}
export default MovieDetails;

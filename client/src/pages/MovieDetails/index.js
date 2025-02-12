import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import ReviewSection from "../../components/ReviewSection";
import "./styles.css";

function MovieDetails({ setIsAuthenticated }) {
  const [movie, setMovie] = useState([null]); // setting up movie request
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { id } = useParams();

  console.log("Movie ID from URL:", id);

  const fetchMovies = async () => {
    try {
      console.log("Fetching movie...");
      const response = await fetch(`http://localhost:8000/api/movies/${id}/`); // Fetch the movie by ID
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      const data = await response.json();

      // Directly set the movie details since the response is already a single movie object
      setMovie(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [id]); //request movies

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

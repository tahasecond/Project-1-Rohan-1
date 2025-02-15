import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import ReviewSection from "../../components/ReviewSection";
import "./styles.css";
import { CartUser } from "../../api";
import ReviewPopup from "../../components/ReviewPopup";

function MovieDetails({ setIsAuthenticated }) {
  const [movie, setMovie] = useState([null]); // setting up movie request
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  //const [movieTitle,]
  useEffect(() => {
    fetchMovies();
    window.scrollTo(0, 0);
  }, [id]); //request movies

  const fetchMovies = async () => {
    try {
      console.log("Fetching movie...");

      // Try fetching the movie from the local database
      let response = await fetch(
        `http://localhost:8000/api/custommovies/${id}/`
      );

      if (!response.ok) {
        console.warn("Movie not found locally, fetching from TMDB...");

        // If not found locally, fetch from TMDB
        response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=b7e53cd3f6fdf95ed3ec34f7bbf27823`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch movie details from both sources");
        }
      }

      const data = await response.json();
      console.log("BackDrop:" + data.backdrop_path);
      console.log("BackDrop2:" + data.backdrop);
      // Ensure correct image formatting if coming from TMDB
      const movieData = {
        id: data.id, // ✅ Match Django model field name
        title: data.title,
        rating: data.vote_average || data.rating,
        description: data.description || data.overview,
        price: 10,
        image:
          data.image ||
          (data.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : ""),
        backdrop:
          data.backdrop || // Check if it's available in your local database
          `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
      };

      setMovie(movieData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  console.log(token);
  const addToCart = async (movieTitle, movieId, movieImage, price) => {
    try {
      // Fetch user email from backend
      const emailResponse = await fetch(
        `http://localhost:8000/api/email/${token}/`
      );
      if (!emailResponse.ok) throw new Error("Failed fetching user email");

      const { user: userEmail } = await emailResponse.json();

      // Check if the movie exists in the local database
      let movieData;
      const localMovieResponse = await fetch(
        `http://localhost:8000/api/custommovies/${movieId}/`
      );

      if (localMovieResponse.ok) {
        movieData = await localMovieResponse.json();
      } else {
        // Fetch from TMDB if not found in local DB
        console.warn("Movie not found locally, fetching from TMDB...");
        const tmdbResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=b7e53cd3f6fdf95ed3ec34f7bbf27823`
        );
        if (!tmdbResponse.ok) throw new Error("Movie not found in TMDB either");

        movieData = await tmdbResponse.json();
      }

      // Construct request payload using available movie data
      const payload = {
        movie_id: movieId,
        movie_title: movieData.title || movieTitle, // Use TMDB title if available
        image: movieData.poster_path
          ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
          : movieImage, // Prefer TMDB image if found
        price: price || 9.99, // Default price if not provided
      };

      console.log(
        "Sending request to:",
        `http://localhost:8000/api/cart/${userEmail}/`
      );
      console.log("Payload:", JSON.stringify(payload));

      // Send movie data to the cart API
      const cartResponse = await fetch(
        `http://localhost:8000/api/cart/${userEmail}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!cartResponse.ok) {
        const errorText = await cartResponse.text();
        console.error("Server response:", errorText);
        throw new Error("Failed adding movie to cart");
      }

      const cartData = await cartResponse.json();
      console.log("Movie added to cart:", cartData);
    } catch (error) {
      console.error("Error:", error);
    }
  };
//insert backend logic for review submission lines 141-149
  const handleReviewSubmit = async ({ rating, comment, movieId }) => {
    try {
      // Placeholder for review submission
      console.log('Review submitted:', { rating, comment, movieId });
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  return (
    <div>
      <NavBar setIsAuthenticated={setIsAuthenticated} />
      <div
        className="movie-container"
        style={{
          backgroundImage: movie?.backdrop ? `url(${movie.backdrop})` : "",
        }}
      >
        <div className="overlay"></div>
        <div className="movie-content">
          <h1 id="movie-title">{movie?.title || "No title available"}</h1>
          <p id="description">
            {movie?.description || "No description available"}
          </p>
          <p id="rating">{movie?.rating || "no rating available"}</p>
          <h3 id="movie-price">${movie?.price}</h3>
          <div className="button-group">
            <button
              className="btn"
              onClick={() => setIsReviewPopupOpen(true)}
            >
              Write Review
            </button>
            <button
              className="btn"
              onClick={() => addToCart(movie.title, movie.id, movie.image, 10)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <ReviewSection />
      <ReviewPopup
        isOpen={isReviewPopupOpen}
        onClose={() => setIsReviewPopupOpen(false)}
        onSubmit={handleReviewSubmit}
        movieId={id}
      />
    </div>
  );
}
export default MovieDetails;

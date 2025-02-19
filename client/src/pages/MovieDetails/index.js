import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import ReviewSection from "../../components/ReviewSection";
import "./styles.css";
import ReviewPopup from "../../components/ReviewPopup";
import { CartContext } from "../../components/CartContext"; // Import the context

function MovieDetails({ setIsAuthenticated }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const token = localStorage.getItem("token");

  // Access the updateCart function from our context
  const { updateCart } = useContext(CartContext);

  useEffect(() => {
    fetchMovies();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchMovies = async () => {
    try {
      let response = await fetch(`https://gtmovies.onrender.com/api/custommovies/${id}/`);
      if (!response.ok) {
        console.warn("Movie not found locally, fetching from TMDB...");
        response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=b7e53cd3f6fdf95ed3ec34f7bbf27823`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch movie details from both sources");
        }
      }
      const data = await response.json();
      const movieData = {
        id: data.id,
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
          data.backdrop ||
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

  const addToCart = async (movieTitle, movieId, movieImage, price) => {
    try {
      const emailResponse = await fetch(
        `https://gtmovies.onrender.com/api/email/${token}/`
      );
      if (!emailResponse.ok) throw new Error("Failed fetching user email");
      const { user: userEmail } = await emailResponse.json();

      let movieData;
      const localMovieResponse = await fetch(
        `https://gtmovies.onrender.com/api/custommovies/${movieId}/`
      );
      if (localMovieResponse.ok) {
        movieData = await localMovieResponse.json();
      } else {
        console.warn("Movie not found locally, fetching from TMDB...");
        const tmdbResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=b7e53cd3f6fdf95ed3ec34f7bbf27823`
        );
        if (!tmdbResponse.ok) throw new Error("Movie not found in TMDB either");
        movieData = await tmdbResponse.json();
      }

      const payload = {
        movie_id: movieId,
        movie_title: movieData.title || movieTitle,
        image: movieData.poster_path
          ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
          : movieImage,
        price: price || 9.99,
      };

      const cartResponse = await fetch(
        `https://gtmovies.onrender.com/api/cart/${userEmail}/`,
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

      // Optionally, you can process cartData here:
      const cartData = await cartResponse.json();

      // Refresh the cart in the global context after a successful add
      updateCart();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <NavBar />
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
            <button className="btn" onClick={() => setIsReviewPopupOpen(true)}>
              Write Review
            </button>
            <button
              className="btn"
              onClick={() =>
                addToCart(movie.title, movie.id, movie.image, 10)
              }
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <ReviewSection movieId={id} />
      <ReviewPopup
        isOpen={isReviewPopupOpen}
        onClose={() => setIsReviewPopupOpen(false)}
        movieId={id}
      />
    </div>
  );
}

export default MovieDetails;

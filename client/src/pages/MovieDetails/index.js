import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import ReviewSection from "../../components/ReviewSection";
import "./styles.css";
import { CartUser } from "../../api";

function MovieDetails({ setIsAuthenticated }) {
  const [movie, setMovie] = useState([null]); // setting up movie request
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");
  //const [movieTitle,]
  useEffect(() => {
    fetchMovies();
    window.scrollTo(0, 0);
  }, [id]); //request movies

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
  console.log(token);
  const addToCart = async (movieTitle, movieId, movieImage, price) => {
    try {
      // Fetch user email from backend
      const emailResponse = await fetch(
        `http://localhost:8000/api/email/${token}/`
      );
      if (!emailResponse.ok) throw new Error("Failed fetching user email");

      const { user: userEmail } = await emailResponse.json();

      // Construct request payload
      const payload = {
        movie_id: movieId,
        movie_title: movieTitle,
        image: movieImage, // Ensure image is included
        price: price,
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

  return (
    <div>
      <NavBar setIsAuthenticated={setIsAuthenticated} />
      <div
        className="movie-container"
        style={{
          backgroundImage: movie?.backdrops ? `url(${movie.backdrops})` : "",
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
    </div>
  );
}
export default MovieDetails;

import "./mymoviestyles.css";
import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";

const MyMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const emailResponse = await fetch(
          `http://localhost:8000/api/email/${token}/`
        );
        if (!emailResponse.ok) throw new Error("Failed fetching user email");

        const emailData = await emailResponse.json();
        const userEmail = emailData.user;

        const response = await fetch(
          `http://localhost:8000/api/orders/${userEmail}/`
        );
        const data = await response.json();

        if (data.success) {
          console.log("Movies Data: ", movies);

          setMovies(data.orders); // Set movies from the order data
        } else {
          console.error("Error fetching movies:", data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div
      className="container"
      style={{ flexDirection: "column", backgroundColor: "white" }}
    >
      <div className="pageHeader">
        <h1>My Movies</h1>
      </div>
      <div className="moviesGrid">
        {movies.map((order, index) => (
          <div key={index} className="movieContainer">
            <div className="movie">
              {order.image && order.image !== "0" ? (
                <img
                  src={order.image}
                  alt={order.movie_title || "Untitled Movie"}
                  className="movieImage"
                />
              ) : (
                <div className="noImage">No Image Available</div>
              )}
            </div>
            {/* Movie Title */}
            <div className="movieTitle">
              {order.movie_title && order.movie_title !== "0"
                ? order.movie_title
                : "Untitled Movie"}
            </div>
            <div className="btnContainer">
              <button>Download</button>
            </div>
          </div>
        ))}
      </div>

      <div className="extendedFooter">
        <p>Engineered by Yellow Jacket Spirit</p>
      </div>
    </div>
  );
};

export default MyMoviesPage;

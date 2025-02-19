import "./mymoviestyles.css";
import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";

const MyMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [total, setTotal] = useState();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const emailResponse = await fetch(
          `https://gtmovies.onrender.com/api/email/${token}/`
        );
        if (!emailResponse.ok) throw new Error("Failed fetching user email");

        const emailData = await emailResponse.json();
        const userEmail = emailData.user;

        const response = await fetch(
          `https://gtmovies.onrender.com/api/orders/${userEmail}/`
        );
        const data = await response.json();

        if (data.success) {
          setMovies(data.orders);
        } else {
          console.error("Error fetching movies:", data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchMovies();
  }, [token]);

  const downloadImage = (imageUrl) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageUrl.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    calculateTotal();
  }, [movies]);

  const calculateTotal = () => {
    const count = movies.length;
    setTotal(count * 10);
  };

  return (
    <div className="my-movies-page">
      <NavBar />
      <div className="movies-content">
        <h1>My Movies</h1>
        {movies.length > 0 ? (
          <>
            <div className="movies-grid">
              {movies.map((order, index) => (
                <div key={index} className="movie-card">
                  <div className="movie-info">
                    {order.image && order.image !== "0" ? (
                      <img
                        src={order.image}
                        alt={order.movie_title || "Untitled Movie"}
                        className="movie-poster"
                      />
                    ) : (
                      <div className="no-image">No Image Available</div>
                    )}

                    {order.timestamp && (
                      <p className="order-time">
                        Ordered on: {order.timestamp.substring(0, 10)}
                      </p>
                    )}

                    <h3>
                      {order.movie_title && order.movie_title !== "0"
                        ? order.movie_title
                        : "Untitled Movie"}
                    </h3>
                  </div>
                  <div className="btnContainer">
                    <button onClick={() => downloadImage(order.image)}>
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="total-spent">
              <h2>Total Spent: ${total}</h2>
            </div>
          </>
        ) : (
          <div className="no-movies">
            <p>You haven't ordered any movies yet.</p>
            <p>Start exploring movies to see them here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMoviesPage;

import NavBar from "../../components/NavBar";
import "./styles.css";
import React, {useState} from "react";

function MovieDetails({ setIsAuthenticated }) {
    const [movies, setMovies] = useState([]); // setting up movie request
    const [error, setError] = useState(null); // Error state

    const fetchMovies = async () => {
    try {
      console.log("Fetching movies...");
      const response = await fetch("http://localhost:8000/api/movies/");
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      console.log("Movies data:", data); // Log the data

      const firstMovie = data[0];
      const secondMovie = data[1];
      const thirdMovie = data[2];
      const fourthMovie = data[3];
      const fifthMovie = data[4];
      const sixthMovie = data[5];
      const seventhMovie = data[6];
      const eigthMovie = data[7];
      const ninthMovie = data[8];
      const tenthMovie = data[9];

      setMovies([
        {
          id: firstMovie.id,
          title: firstMovie.title,
          image: firstMovie.image,
        },
        {
          id: secondMovie.id,
          title: secondMovie.title,
          image: secondMovie.image,
        },
        {
          id: thirdMovie.id,
          title: thirdMovie.title,
          image: thirdMovie.image,
        },
        {
          id: fourthMovie.id,
          title: fourthMovie.title,
          image: fourthMovie.image,
        },
        {
          id: fifthMovie.id,
          title: fifthMovie.title,
          image: fifthMovie.image,
        },
        {
          id: sixthMovie.id,
          title: sixthMovie.title,
          image: sixthMovie.image,
        },
        {
          id: seventhMovie.id,
          title: seventhMovie.title,
          image: seventhMovie.image,
        },
        {
          id: eigthMovie.id,
          title: eigthMovie.title,
          image: eigthMovie.image,
        },
        {
          id: ninthMovie.id,
          title: ninthMovie.title,
          image: ninthMovie.image,
        },
        {
          id: tenthMovie.id,
          title: tenthMovie.title,
          image: tenthMovie.image,
        },
      ]);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError(error.message); // Set error state
      setLoading(false); // Set loading to false if there's an error
    }
  };

    return(
        <div>
            <NavBar setIsAuthenticated={setIsAuthenticated}/>
          <div className="movie-container" style="background-image: url('');"> <!-- add image here -->
            <div className="overlay"></div>
            <div className="movie-content">
              <h1 id="movie-title">Movie Title</h1>
              <p id="description">Walt Disney Animation Studios’ animated musical reunites Moana and Maui three years
                later for an expansive new voyage alongside a crew of unlikely seafarers. After hearing from her
                way finding ancestors, Moana must journey into long-lost waters for an adventure. Warning: Some
                flashing-lights scenes in this film may affect photosensitive viewers.</p> <!-- Make changes to description here -->
              <p id="rating">Rating: 9.8</p> <!-- Wasn't sure how the ratings were supposed to look but you can add them here. -->
              <h4 id="movie-price">$49.99</h4>
              <div className="button-group">
                <button className="btn">Buy Now!</button>
                <button className="btn">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
    );
}
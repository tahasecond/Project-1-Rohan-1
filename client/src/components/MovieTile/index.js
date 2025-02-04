import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const MovieTile = ({ movie }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/moviedetails/${movie.id}`);
    };

    return (
        <div className="movie-tile" onClick={handleClick}>
            <img 
                src={movie.image} //api call to get movie image
                alt={movie.title} //api call to get movie title
                className="movie-tile-image" 
            />
            <div className="movie-tile-info">
                <h3 className="movie-tile-title">{movie.title}</h3> //api call to get movie title
                <p className="movie-tile-price">${movie.price.toFixed(2)}</p> //api call to get movie price
            </div>
        </div>
    );
};

export default MovieTile;

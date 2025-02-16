import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import ReviewBox from "../../components/ReviewBox";
import "./styles.css";

import { fetchUserReviews, fetchMovieDetails } from "../../api";

function MyReviews () {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetchUserReviews();
            if (!response.success){
                throw new Error ("Failed to fetch user reviews");
            }
            
            const movieReviews = await Promise.all(
                response.reviews.map(async (review) => {
                    const movieData = await fetchMovieDetails(review.movieId);

                    return {
                        ...review,
                        movie: {
                            title: movieData?.title || "Unknown Movie",
                            poster: movieData?.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
                                : "/placeholder.jpg",
                        }
                    };
                })
            );
            
            setReviews(movieReviews);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-reviews-page">
            <NavBar />
            <div className="reviews-content">
                <h1>My Movie Reviews</h1>
                {loading ? (
                    <div className="loading">Loading reviews...</div>
                ) : reviews.length > 0 ? (
                    <div className="reviews-grid">
                        {reviews.map((review) => (
                            <div key={review.review_id} className="review-card">
                                <div className="movie-info">
                                    <img 
                                        src = {review.movie.poster}
                                        alt = {review.movie.title}
                                        className = "movie-poster"
                                    />
                                    <h3>{review.movie.title}</h3>
                                </div>
                                <ReviewBox
                                    key = {review.review_id}
                                    name = "You"
                                    description={review.comment}
                                    rating = {review.rating}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-reviews">
                        <p>You haven't written any reviews yet.</p>
                        <p>Start watching and reviewing movies to see them here!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReviews;
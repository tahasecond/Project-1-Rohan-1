import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import ReviewBox from "../../components/ReviewBox";
import "./styles.css";

import { fetchUserReviews } from "../../api";

function MyReviews () {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserReviews();
    }, []);

    const fetchUserReviews = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetchUserReviews(token);
            setReviews(response.reviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
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
                            <div key={review.id} className="review-card">
                                <div className="movie-info">
                                    <img 
                                        src={review.movie.image} 
                                        alt={review.movie.title}
                                        className="movie-poster"
                                    />
                                    <h3>{review.movie.title}</h3>
                                </div>
                                <ReviewBox
                                    name={review.user.username}
                                    subheading={`Rated ${review.rating}/5`}
                                    description={review.comment}
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
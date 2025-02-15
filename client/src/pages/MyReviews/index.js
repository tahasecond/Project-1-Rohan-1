import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import ReviewBox from "../../components/ReviewBox";
import "./styles.css";

const MyReviews = ({ setIsAuthenticated }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUserReviews();
    }, []);

    const fetchUserReviews = async () => {
        try {
            // TODO: Replace with actual backend logic to fetch user email from token
            const userEmail = "user@example.com"; // Placeholder for user email

            // TODO: Replace with actual backend logic to fetch user's reviews
            const reviewsData = [
                {
                    id: 1,
                    movie: {
                        image: "path/to/movie/image.jpg",
                        title: "Movie Title 1"
                    },
                    user: {
                        username: "User1"
                    },
                    rating: 4,
                    comment: "Great movie!"
                },
                {
                    id: 2,
                    movie: {
                        image: "path/to/movie/image2.jpg",
                        title: "Movie Title 2"
                    },
                    user: {
                        username: "User2"
                    },
                    rating: 5,
                    comment: "Loved it!"
                }
            ]; // Placeholder for reviews data

            setReviews(reviewsData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setLoading(false);
        }
    };

    return (
        <div className="my-reviews-page">
            <NavBar setIsAuthenticated={setIsAuthenticated} />
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
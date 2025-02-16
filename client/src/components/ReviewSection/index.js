import "./styles.css"
import ReviewBox from "../ReviewBox";
import { useState, useEffect } from 'react';
import { fetchMovieReviews } from '../../api';

const ReviewSection = ({ movieId }) => {
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
              const response = await fetchMovieReviews(movieId);
              console.log("Reviews fetched:", response.reviews);
              setReviews(response.reviews);
            } catch (error) {
              console.log("Error fetching movie reviews: ", error);
            } finally {
              setReviewsLoading(false);
            }
          };
        fetchReviews();
    }, [movieId]);

    return (
        <section id="review">
            <div className="review-heading">
                <h1>See what customers say!</h1>
            </div>
            <div className="review-box-container">
                {reviewsLoading ? (
                    <p> Loading reviews... </p>
                ) : (
                    reviews.map((review) => (
                        <ReviewBox
                            key = {review.id}
                            name = {review.user}
                            description = {review.comment}
                            rating = {review.rating}
                        />
                    ))
                )}
            </div>
        </section>
    );
}

export default ReviewSection;
import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import ReviewBox from "../../components/ReviewBox";
import EditReviewPopup from "../../components/EditReviewPopup";
import DeleteReviewPopup from "../../components/DeleteReviewPopup";
import "./styles.css";

import { fetchUserReviews, fetchMovieDetails, deleteReview } from "../../api";

function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  // State to handle popup visibility and the review being edited/deleted
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetchUserReviews();
      if (!response.success) {
        throw new Error("Failed to fetch user reviews");
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
            },
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

  // Opens the edit popup with the selected review
  const handleEditClick = (review) => {
    setCurrentReview(review);
    setIsEditPopupOpen(true);
  };

  // Opens the delete popup with the selected review
  const handleDeleteClick = (review) => {
    setCurrentReview(review);
    setIsDeletePopupOpen(true);
  };

  // Update the review in the list after editing
  const handleEditUpdate = (updatedReview) => {
    setReviews(
      reviews.map((review) =>
        review.review_id === updatedReview.review_id ? updatedReview : review
      )
    );
  };

  // Confirm deletion of the review
  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteReview(currentReview.review_id);
      if (response.success) {
        alert("Review deleted successfully!");
        setReviews(
          reviews.filter(
            (review) => review.review_id !== currentReview.review_id
          )
        );
        setIsDeletePopupOpen(false);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
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
                    src={review.movie.poster}
                    alt={review.movie.title}
                    className="movie-poster"
                  />
                  <h3>{review.movie.title}</h3>
                </div>
                <ReviewBox
                  key={review.review_id}
                  name="You"
                  description={review.comment}
                  rating={review.rating}
                />
                <div className="review-actions">
                  <button onClick={() => handleEditClick(review)}>
                    Edit Review
                  </button>
                  <button onClick={() => handleDeleteClick(review)}>
                    Delete Review
                  </button>
                </div>
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

      {/* Edit Review Popup */}
      {isEditPopupOpen && currentReview && (
        <EditReviewPopup
          isOpen={isEditPopupOpen}
          onClose={() => setIsEditPopupOpen(false)}
          review={currentReview}
          onUpdate={handleEditUpdate}
        />
      )}

      {/* Delete Review Popup */}
      {isDeletePopupOpen && currentReview && (
        <DeleteReviewPopup
          isOpen={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}
          onDelete={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

export default MyReviews;

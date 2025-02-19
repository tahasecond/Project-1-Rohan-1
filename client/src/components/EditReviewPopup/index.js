import React, { useState } from 'react';
import { editReview } from '../../api';
import './styles.css';

const EditReviewPopup = ({ isOpen, onClose, review, onUpdate }) => {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await editReview({
        id: review.review_id,
        rating,
        comment
      });
      if (response.success) {
        onUpdate(); 
        onClose();
      } else {
        alert("Failed to update review.");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="review-popup-overlay">
      <div className="review-popup">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Review</h2>
        <form onSubmit={handleSubmit}>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? 'active' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 300))}
            maxLength={300}
            required
          />
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Updating..." : "Update Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditReviewPopup;
import React, { useState } from 'react';
import './styles.css';

const EditReviewPopup = ({ isOpen, onClose, review, onUpdate }) => {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);

  const handleSubmit = (e) => {
    e.preventDefault();
    // HANDLE BACKEND LOGIC HERE
    onUpdate({ ...review, rating, comment });
    onClose();
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
          <button type="submit" className="submit-button">
            Update Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditReviewPopup;

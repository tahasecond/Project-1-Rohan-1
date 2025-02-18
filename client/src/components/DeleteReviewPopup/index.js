import React, { useState } from 'react';
import './styles.css';
import { deleteReview } from '../../api';

const DeleteReviewPopup = ({ isOpen, onClose, reviewId, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => { //BACKEND LOGIC HERE - Taha 
    setLoading(true);
    try {
      const response = await deleteReview(reviewId);
      if (response.success) {
        // Inform the parent component that deletion was successful.
        onDeleteSuccess();
      } else {
        alert("Error deleting review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="review-popup-overlay">
      <div className="review-popup">
        <button className="close-button" onClick={onClose} disabled={loading}>
          &times;
        </button>
        <h2>Delete Review</h2>
        <p>Are you sure you want to delete this review?</p>
        <div className="button-group">
          <button
            className="submit-button"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            className="submit-button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReviewPopup;

import React, { useState } from 'react';
import './styles.css';
import { leaveReview } from '../../api';

const ReviewPopup = ({ isOpen, onClose, onSubmit, movieId }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        
        const formData = {rating, comment, movieId};
        try {
            const response = await leaveReview(formData);
            if (response.success) {
                alert("Review submitted successfully! ");
                setRating(0);
                setComment('');
                onClose();
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="review-popup-overlay">
            <div className="review-popup">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>Write a Review</h2>
                <form onSubmit={handleSubmit}>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= (hoveredStar || rating) ? 'active' : ''}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <textarea
                        placeholder="Write your review here (max 300 characters)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value.slice(0, 300))}
                        maxLength={300}
                        required
                    />
                    <div className="char-count">{comment.length}/300</div>
                    <button type="submit" className="submit-button">Submit Review</button>
                </form>
            </div>
        </div>
    );
};

export default ReviewPopup; 
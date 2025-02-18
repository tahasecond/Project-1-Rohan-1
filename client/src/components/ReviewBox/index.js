import "./styles.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const ReviewBox = ({ name, rating, description }) => {
  return (
    <div className="review-box">
      <div className="box-top">
        <div className="profile">
          <div className="name-user">
            <strong>{name}</strong>
            <span> Rating: {rating} </span>
          </div>
        </div>
        <div className="reviews">
          {[...Array(5)].map((_, index) => (
            <i
              key={index}
              className={`fas fa-star ${index < rating ? "filled" : "empty"}`} 
            ></i>
          ))}
        </div>
      </div>
      <div className="client-comment">
        <p id="review-description">{description}</p>
      </div>
    </div>
  );
};

export default ReviewBox;
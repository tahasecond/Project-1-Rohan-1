import "./styles.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const ReviewBox = ({ name, imageUrl, subheading, description }) => {
    return (
        <div className="review-box">
            <div className="box-top">
                <div className="profile">
                    <div className="profile-img">
                        <img src={imageUrl} alt="Profile" />
                    </div>
                    <div className="name-user">
                        <strong>{name}</strong>
                        <span>{subheading}</span>
                    </div>
                </div>
                <div className="reviews">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="far fa-star"></i>
                </div>
            </div>
            <div className="client-comment">
                <p id="review-description">{description}</p>
            </div>
        </div>
    );
};

export default ReviewBox;
import "./styles.css"
import ReviewBox from "../ReviewBox";

const ReviewSection = () => {
    return (
        <section id="review">
            <div className="review-heading">
                <h1>See what customers say!</h1>
            </div>
            <div className="review-box-container">
                <ReviewBox name={"Taha"} imageUrl={"../assets"} subheading={"It was alright"}/>
                <ReviewBox name={"Ahmed"} imageUrl={"../assets"} subheading={"It was alright"}/>
                <ReviewBox name={"Adonai"} imageUrl={"../assets"} subheading={"It was alright"}/>
                <ReviewBox name={"Vineeth"} imageUrl={"../assets"} subheading={"It was alright"}/>
            </div>
        </section>
    );
}

export default ReviewSection
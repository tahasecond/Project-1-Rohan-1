import "./profilestyles.css";
import logoImage from "../../assets/images/buzz.svg.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ProfilePage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const fetchEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      const emailResponse = await fetch(
        `https://gtmovies.onrender.com/api/email/${token}/`
      );
      if (!emailResponse.ok) throw new Error("Failed fetching user email");

      const emailData = await emailResponse.json();
      const userEmail = emailData.user;
      setEmail(userEmail);
    } catch (error) {
      throw Error(error);
    }
  };
  
  useEffect(() => {
    fetchEmail();
  }, []);

  return (
    <div className="container">
      <div className="navigation">
        <div className="backBtn">
          <button onClick={() => navigate(-1)}>
            <p>Go back</p>
          </button>
        </div>
        <div className="navSelections">
          <ul>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/myreviews">My Reviews</Link>
            </li>
            <li>
              <Link to="/mymoviespage">My Movies</Link>
            </li>
          </ul>
        </div>
        <div className="statement">
          <p>Engineered by Yellow Jacket Spirit</p>
          <img src={logoImage} alt="Logo" className="buzzImage" />
        </div>
      </div>

      <div className="profileContainer">
        <div className="headerContainer">
          <h1>My Account</h1>
        </div>
        <div className="contentContainer">
          <div className="containerBox">
            <div className="accountContainer">
              <div className="accountDetailBox"></div>
              <div className="accountDetailBox">
                <div className="userData">
                  <h5>Email</h5>
                  <p>{email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

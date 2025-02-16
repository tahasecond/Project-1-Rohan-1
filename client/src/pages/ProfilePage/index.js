import "./profilestyles.css";
import logoImage from "../../assets/images/buzz.svg.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import PasswordResetPopup from "../../components/PasswordResetPopup";
import { resetPassword } from "../../api";

const ProfilePage = () => {
    const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);

    const handlePasswordResetSubmit = async ({ currentPassword, newPassword }) => {
        try {
            const response = await resetPassword( {currentPassword, newPassword} );

            if (response.success) {
                alert(response.message || 'Password reset successfully!');
                setIsPasswordResetOpen(false);
            } else {
                alert(response.message || "Failed to reset password");
            }

        } catch (error) {
            alert(error.message || "Failed to reset password");
        }
    };

    return (
        <div className="container">
            <div className="navigation">
                <div className="backBtn">
                    <button>
                        <p>Go back</p>
                    </button>
                </div>
                <div className="navSelections">
                    <ul>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/myreviews">My Reviews</Link></li>
                        <li><Link to="/mymoviespage">My Movies</Link></li>
                    </ul>
                </div>
                <div className="statement">
                    <p>Engineered by Yellow Jacket Spirit</p>
                    <img src={logoImage} alt="Logo" className="buzzImage"/>
                </div>
            </div>

            <div className="profileContainer">
                <div className="headerContainer">
                    <h1>My Account</h1>
                </div>
                <div className="contentContainer">
                    <div className="containerBox">
                        <div className="idContainer">
                            <div className="leftId">
                                <div className="pfp">
                                    <img src="" alt="Profile"/>
                                </div>
                                <h4>Lebron James</h4>
                            </div>
                            <div className="changePfp">
                                <button><p>Change Picture</p></button>
                            </div>
                        </div>

                        <div className="accountContainer">
                            <div className="accountDetailBox">
                                <div className="userData">
                                    <h5>Display Name:</h5>
                                    <p>Lebron James</p>
                                </div>
                                <div className="changeInfoBtn">
                                    <button>Change Display Name</button>
                                </div>
                            </div>
                            <div className="accountDetailBox">
                                <div className="userData">
                                    <h5>Email</h5>
                                    <p>LebronJames@Lakers.com</p>
                                </div>
                                <div className="changeInfoBtn">
                                    <button>Change Email</button>
                                </div>
                            </div>
                            <div className="accountDetailBox">
                                <div className="userData">
                                    <h5>Password</h5>
                                    <p>TacoTues******</p>
                                </div>
                                <div className="changeInfoBtn">
                                    <button onClick={() => setIsPasswordResetOpen(true)}>Change Password</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PasswordResetPopup
                isOpen={isPasswordResetOpen}
                onClose={() => setIsPasswordResetOpen(false)}
                onSubmit={handlePasswordResetSubmit}
            />
        </div>
    );
};

export default ProfilePage
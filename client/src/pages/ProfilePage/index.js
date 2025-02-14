import "./profilestyles.css";
import logoImage from "../../assets/images/buzz.svg.png";

const ProfilePage = () => {
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
                        <li><a href="#">Profile</a></li>
                        <li><a href="#">My Reviews</a></li>
                        <li><a href="#">My Movies</a></li>
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
                                    <button>Change Password</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage
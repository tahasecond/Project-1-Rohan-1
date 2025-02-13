import "./styles.css";
import { FaArrowLeft } from "react-icons/fa6";
import logoImage from "../../assets/images/buzz.svg.png";

const ProfilePage = () => {
    return (
        <div className="container">
            <div className="navigation">
                <div className="backBtn">
                    <Button><FaArrowLeft/><p>Go back</p></Button>
                </div>
                <div className="navSelections">
                    <ul>
                        <li><a href="">Profile</a></li>
                        <li><a href="">My Reviews</a></li>
                        <li><a href="">My Movies</a></li>
                    </ul>
                </div>
                <div className="statement">
                    <p>Engineered by Yellow Jacket Spirit</p>
                    <img src={logoImage} alt=""/>
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
                                    <img src="images/lebronjames.png" alt="pfp"/>
                                </div>
                                <h4>Lebron James</h4>
                            </div>
                            <div className="changePfp">
                                <Button><p>Change Picture</p></Button>
                            </div>
                        </div>
                        <div className="accountContainer">
                            <div className="accountDetailBox">
                                <div className="userData">
                                    <h5>Display Name:</h5>
                                    <p>Lebron James</p>
                                </div>
                                <div className="changeInfoBtn">
                                    <Button>Change Display Name</Button>
                                </div>
                            </div>
                            <div className="accountDetailBox">
                                <div className="userData">
                                    <h5>Email</h5>
                                    <p>LebronJames@Lakers.com</p>
                                </div>
                                <div className="changeInfoBtn">
                                    <Button>Change Email</Button>
                                </div>
                            </div>
                            <div className="accountDetailBox">
                                <div className="userData">
                                    <h5>Password</h5>
                                    <p>TacoTues******</p>
                                </div>
                                <div className="changeInfoBtn">
                                    <Button>Change Password</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api';

import './styles.css';
import logoImage from "../../assets/images/buzz.svg.png";

function Login({ setIsLoggedIn }) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await loginUser(formData);
            if (response.success) {
                setIsLoggedIn(true);
                navigate("/");
            } else {
                setError(response.message || "Login failed, try again");
            }    
        } catch (error) {
            setError("An error occurred during login. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className = 'loginBox'> 
            <h1>Sign In</h1>
            <img src = {logoImage} alt = "Buzz Logo" className = "logo" />

            {error && (
                <p style={{ color: "red" }}>
                    {error.includes("Invalid Login Credentials")
                    ? "Invalid Login Credentials"
                    : "Login failed. Please try again."}
                </p>
            )}

            <form className="form" onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit"> Sign In </button>
                <div> Don't Have An Account? <Link to = "/signup"> Sign Up </Link> </div>
                <div> Forgot Password? <Link to = "/forgotpassword"> Reset </Link> </div>
            </form>
        </div>
    )
}

export default Login;
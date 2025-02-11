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
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await loginUser(formData);

        if (response.success) {
            localStorage.setItem("token", response.token);
            setIsLoggedIn(true);
            navigate("/");
        } else {
            setError(response.message);
        }    
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className = 'loginBox'> 
            <h1>Sign In</h1>
            <img src = {logoImage} alt = "Buzz Logo" className = "logo" />

            {error && <p style={{ color: "red" }}>{error}</p>}
            <form className="form" onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Sign In</button>
                <div> Don't have an account? <Link to = "/signup"> Sign Up </Link> </div>
            </form>
        </div>
    )
}

export default Login;
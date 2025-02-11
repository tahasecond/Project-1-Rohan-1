import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../api';

import "./styles.css";
import logoImage from "../../assets/images/buzz.svg.png";

function SignUp() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    })
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await registerUser(formData);
        if (response.success) {
            alert(response.message);
            navigate("/login");
        } else {
            setError(response.message);
        }
    };

    return (
        <div className = 'loginBox'> 
            <h1> Sign Up </h1> 
            <img src = {logoImage} className = "logo" alt = "Buzz Logo" />
            {error && <p style = {{ color: "red" }}> {error} </p>}
            <form className = "form" onSubmit = {handleSubmit}>
            <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
                <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Sign Up</button>
                <div> Already have an account? <Link to = "/login"> Sign In </Link> </div>
            </form>
        </div> 
    )
}

export default SignUp;
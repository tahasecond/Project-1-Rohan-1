import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import logoImage from '../../assets/images/buzz.svg.png';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
        onLogin(); // Calling the onLogin function from App.js
    }
    return (
        <div className = 'loginBox'> 
            <div className = 'top'> 
                <img className = 'logo'src = {logoImage} alt = "GT Movies Logo" />
                <h1> Sign In</h1>
            </div>
            
            <form className = 'form' onSubmit = {handleSubmit}>
                <label> 
                    Email
                    <input
                        type = "email"
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                        required
                    />
                </label> 
                <label>
                    Password
                    <input
                        type = "password"
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type = "submit">
                    Sign In
                </button>
            </form>

            <div> 
                Don't have an account? <Link to = "/signup"> Sign Up </Link>
            </div>
        </div>
    )
}

export default Login;
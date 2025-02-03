import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./styles.css";
import logoImage from "../../assets/images/buzz.svg.png";

function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
        // backend django logic
    }
    return (
        <div className = 'loginBox'> 
            <div className = 'top'> 
                <img className = 'logo'src = {logoImage} alt = "GT Movies Logo" />
                <h1> Sign Up</h1>
            </div>
            
            <form className = 'form' onSubmit = {handleSubmit}>
                <label>
                    First Name
                    <input 
                        type = "text"
                        required
                        value = {firstName}
                        onChange = {(e) => setFirstName(e.target.value)}
                    />
                </label>

                <label>
                    Last Name
                    <input 
                        type = "text"
                        required
                        value = {lastName}
                        onChange = {(e) => setLastName(e.target.value)}
                    />
                </label>
                <label>
                    Email
                    <input
                        type = "email"
                        required
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                    />
                </label>    
                <label>
                    Password
                    <input
                    type = "password"
                    required
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                    />
                </label>      
            </form>

                <button type = "submit"> Sign Up </button>
                <div> Already have an account? <Link to = "/login"> Sign In </Link> </div>
        </div> 
    )
}

export default SignUp;
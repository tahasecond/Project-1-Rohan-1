import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../api';

import "./styles.css";
import logoImage from "../../assets/images/buzz.svg.png";

function ResetPassword() {
    const [formData, setFormData] = useState({
        email: "",
        newpassword: "",
        confirmnewpassword: "",
        birthday: ""
    })

    const [loading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.newpassword == formData.confirmnewpassword) {
            try {   
                const response = await resetPassword({ email: formData.email, password: formData.newpassword, birthday: formData.birthday });
                if (response.success) {
                    alert(response.message);
                    navigate("/login");
                } else {
                    alert(response.message || "Incorrect credentials. Please try again.");
                }
            } catch (error) {
                alert("An error occurred. Please try again later.");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className = 'loginBox'> 
            <h1> Forgot </h1> 
            <img src = {logoImage} className = "logo" alt = "Buzz Logo" />
            

            <form className = "form" onSubmit = {handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type = "date" name = "birthday" placeholder = "Birthday" value = {formData.birthday} onChange = {handleChange} required />
                <input type="password" name="newpassword" placeholder="New Password" onChange={handleChange} required />
                <input type="password" name="confirmnewpassword" placeholder="Confirm New Password" onChange={handleChange} required />
                <button type="submit" disabled={loading}>
                    {loading ? "Verifying..." : "Verify"}
                </button>
                <div> Sign In <Link to = "/login"> Sign In </Link> </div>
            </form>
        </div> 
    )
}

export default ResetPassword;
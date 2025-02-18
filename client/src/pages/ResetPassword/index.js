import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../api';

import "./styles.css";
import logoImage from "../../assets/images/buzz.svg.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ResetPassword( {email} ) {
    const [formData, setFormData] = useState({
        newpassword: "",
        confirmnewpassword: ""
    })

    const [loading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.newpassword == formData.confirmnewpassword){
            try {
                const response = await resetPassword({email: email, password: formData.newpassword });
                if (response.success) {
                    alert(response.message);
                    navigate("/login");
                } else {
                    alert(response.message || "Incorrect credentials");
                }
            } catch (error) {
                alert("An error occurred. Please try again later");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        } else {
            alert("Passwords do not match. Try again.");
        }
    };

    return (
        <div className = 'loginBox'> 
            <h1> Reset </h1> 
            <img src = {logoImage} className = "logo" alt = "Buzz Logo" />
            

            <form className = "form" onSubmit = {handleSubmit}>
                <input type="password" name="newpassword" placeholder="New Password" onChange={handleChange} required />
                <input type="password" name="confirmnewpassword" placeholder="Confirm New Password" onChange={handleChange} required />
                <button type="submit" disabled={loading}> Reset </button>
            </form>
        </div> 
    )
}

export default ResetPassword;
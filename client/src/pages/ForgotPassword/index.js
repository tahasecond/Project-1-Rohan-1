import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword } from '../../api';

import "./styles.css";
import logoImage from "../../assets/images/buzz.svg.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ForgotPassword() {
    const [formData, setFormData] = useState({
        email: "",
        birthday: null,
    })

    const [loading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, birthday: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formattedBirthday = formData.birthday
            ? formData.birthday.toISOString().split('T')[0]
            : null;
        const payload = {
            email: formData.email,
            birthday: formattedBirthday
        };

        try {
            const response = await forgotPassword(payload);
            if (response.success) {
                alert(response.message);
                navigate("/reset", {state: formData.email});
            } else {
                alert(response.message || "Incorrect credentials");
            }
        } catch (error) {
            alert("An error occurred. Please try again later.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className = 'loginBox'> 
            <h1> Forgot </h1> 
            <img src = {logoImage} className = "logo" alt = "Buzz Logo" />
            

            <form className = "form" onSubmit = {handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <DatePicker
                    selected={formData.birthday}
                    onChange={handleDateChange}
                    name="birthday"
                    placeholderText="Birthday"
                    dateFormat="yyyy/MM/dd"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    showMonthDropdown
                    required
                />
                <button type="submit" disabled={loading}> Verify </button>
                <div> Already Have An Account? <Link to = "/login"> Sign In </Link> </div>
            </form>
        </div> 
    )
}

export default ForgotPassword;
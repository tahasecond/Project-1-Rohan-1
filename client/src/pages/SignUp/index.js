import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api";

import "./styles.css";
import logoImage from "../../assets/images/buzz.svg.png";
//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    birthday: null,
    password: "",
  });

  const [error, setError] = useState("");
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
    setError("");
    setIsLoading(true);

        const formattedBirthday = formData.birthday
            ? formData.birthday.split('T')[0]
            : null;
        const payload = {
            email: formData.email,
            password: formData.password,
            birthday: formattedBirthday
        };
        
        try {
            const response = await registerUser(payload);
            if (response.success) {
                alert(response.message);
                navigate("/login");
            } else {
                setError(response.message || "Registration failed, try again");
            }
        } catch (error) {
            setError("An error occurred during registration. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="loginBox">
      <h1> Sign Up </h1>
      <img src={logoImage} className="logo" alt="Buzz Logo" />

      {error && (
        <p style={{ color: "red" }}>
          {error.includes("Email already exists")
            ? "Email already exists"
            : error.includes("Registration failed")
            ? "Registration failed. Please check if you've filled in all the fields correctly."
            : "Registration failed. Please try again"}
        </p>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        {/* <DatePicker
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
                /> */}
        <button type="submit" disabled={loading}>
          Sign Up
        </button>
        <div>
          {" "}
          Already have an account? <Link to="/login"> Sign In </Link>{" "}
        </div>
      </form>
    </div>
  );
}

export default SignUp;

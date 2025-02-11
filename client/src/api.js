import { useNavigate } from "react-router-dom"; 

const API_BASE_URL = "http://127.0.0.1:8000";

export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });
    return response.json();
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (data.success && data.token) {
        localStorage.setItem("token", data.token);
    }
    return data; 
};

export const isAuthenticated = () => {
    const token = localStorage.getItem("token");

    return token && token !== "null" && token !== "undefined";
};

export const logoutUser = (navigate) => {
    localStorage.removeItem("token");
    navigate("/login");
};

const API_BASE_URL = "http://localhost:8000";

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Registraion failed");
    }

    return response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    if (data.success && data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token && token !== "null" && token !== "undefined";
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const CartUser = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/email/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`, // Send token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user email");
    }

    const data = await response.json();
    return data; // Returns { user: email }
  } catch (error) {
    console.error("Error fetching user email:", error);
    throw error;
  }
};

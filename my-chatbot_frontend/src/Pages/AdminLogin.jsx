import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost/AI_ChatBot/admin_login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("adminName", data.admin.name);
        navigate("/admin/dashboard");
      } else {
        setErrorMsg(data.message);
      }
    } catch (error) {
      setErrorMsg("Failed to connect to the server.");
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        {errorMsg && <p className="error">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;

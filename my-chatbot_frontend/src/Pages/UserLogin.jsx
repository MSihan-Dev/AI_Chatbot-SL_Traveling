import React from "react";
import "../styles/UserLogin.css";

const UserLogin = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p className="tagline">Explore the Sri Lanka with us 🌍</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Add your auth logic here
            alert("Login attempted.");
          }}
        >
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <div className="links">
          <a href="#">Forgot Password?</a> | <a href="#">Create an Account</a>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

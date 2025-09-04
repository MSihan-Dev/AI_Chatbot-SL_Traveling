import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import Home from "./Pages/Home";
import UserLogin from "./Pages/UserLogin";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/user/login" element={<UserLogin />} />
    </Routes>
  );
};

export default App;

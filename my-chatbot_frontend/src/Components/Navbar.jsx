import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaPlaneDeparture,
} from "react-icons/fa";
import "../Styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">TravelMate</div>
      <ul className="navbar-links">
        <li>
          <Link to="/">
            <FaHome /> Home
          </Link>
        </li>
        <li>
          <Link to="/destinations">
            <FaPlaneDeparture /> Destinations
          </Link>
        </li>
        <li>
          <Link to="/about">
            <FaInfoCircle /> About
          </Link>
        </li>
        <li>
          <Link to="/contact">
            <FaEnvelope /> Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

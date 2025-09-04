import React from "react";
import { FaUmbrellaBeach, FaMapMarkedAlt } from "react-icons/fa";
import "../Styles/About_Feedback.css";

const About = () => {
  return (
    <div className="about-container">
      <h1>
        About <span style={{ color: "#0a66c2" }}>TravelMate</span>
      </h1>
      <div className="about-content">
        <div className="about-image">
          <FaUmbrellaBeach size={100} color="#f39c12" />
        </div>
        <div className="about-text">
          <h2>
            <FaMapMarkedAlt /> Discover Sri Lanka with Us
          </h2>
          <p>
            TravelMate is your trusted travel companion for exploring the
            wonders of Sri Lanka — the Pearl of the Indian Ocean. From the misty
            hills of Nuwara Eliya to the golden shores of Unawatuna, we bring
            you curated experiences that blend culture, nature, and adventure.
          </p>
          <p>
            Whether you're seeking spiritual serenity at ancient temples,
            breathtaking wildlife safaris, or luxury beach stays — TravelMate
            helps you plan your perfect getaway with ease.
          </p>
          <p>
            We're more than a booking service. We're passionate locals who
            believe in responsible tourism, authentic experiences, and creating
            lifelong memories.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

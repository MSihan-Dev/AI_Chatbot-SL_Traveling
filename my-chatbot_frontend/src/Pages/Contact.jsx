import React from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "../Styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>

      <div className="contact-content">
        <form className="contact-form">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" placeholder="Your name" required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Your email" required />

          <label htmlFor="message">Message</label>
          <textarea id="message" placeholder="Your message" rows="5" required />

          <button type="submit">Send Message</button>
        </form>

        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            <FaEnvelope /> travelmate@gmail.com
          </p>
          <p>
            <FaPhoneAlt /> +94 71 123 4567
          </p>
          <p>
            <FaMapMarkerAlt /> Colombo, Sri Lanka
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;

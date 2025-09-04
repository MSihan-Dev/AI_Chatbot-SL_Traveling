import React, { useState } from "react";
import { FaStar, FaCommentDots } from "react-icons/fa";
import "../Styles/About_Feedback.css";

const Feedback = () => {
  const [form, setForm] = useState({ name: "", feedback: "", rating: 5 });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Feedback:", form);
    alert("Thank you for your feedback!");
    setForm({ name: "", feedback: "", rating: 5 });
  };

  return (
    <div className="feedback-container">
      <h1>
        <FaCommentDots /> Feedback
      </h1>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
        />

        <textarea
          name="feedback"
          value={form.feedback}
          onChange={handleChange}
          placeholder="Your Feedback"
          rows={5}
          required
        />

        <label htmlFor="rating">
          Rating: {form.rating} <FaStar color="#f1c40f" />
        </label>
        <input
          type="range"
          name="rating"
          min="1"
          max="10"
          value={form.rating}
          onChange={handleChange}
        />

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default Feedback;

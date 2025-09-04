import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/AdminDashboard.css";

const DestinationDropdown = ({ onSelect }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost/AI_ChatBot/api/get_destinations.php")
      .then((res) => {
        setDestinations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching destinations:", err);
        setError("Failed to load destinations.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading destinations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mb-3 dropdown">
      <label
        htmlFor="destinationSelect"
        className="form-label"
        style={{
          color: "white",
          fontSize: "1.2em",
          backgroundColor: "rgb(13,53,87,0.5)",
          padding: "5px 13px",
          borderRadius: "8px",
        }}
      >
        Choose a Destination
      </label>
      <select
        id="destinationSelect"
        className="form-select"
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Select a destination</option>
        {destinations.map((dest) => (
          <option key={dest.destination_id} value={dest.destination_id}>
            {dest.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DestinationDropdown;

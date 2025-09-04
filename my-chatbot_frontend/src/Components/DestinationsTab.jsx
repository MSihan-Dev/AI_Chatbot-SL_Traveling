import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/AdminDashboard.css";

const DestinationsTab = () => {
  const [destinations, setDestinations] = useState([]);
  const [newDestination, setNewDestination] = useState({
    name: "",
    description: "",
    location: "",
    category: "",
    image_url: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingDestinationId, setEditingDestinationId] = useState(null);

  // Fetch destinations from the backend when component mounts
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(
          "http://localhost/AI_ChatBot/AdminApi/destination_api.php"
        );

        // If the response is a string, parse it manually
        let parsedData;
        try {
          parsedData =
            typeof response.data === "string"
              ? JSON.parse(response.data)
              : response.data;
        } catch (err) {
          console.error("Invalid JSON response:", response.data);
          return;
        }
        // Now it's safe to set
        setDestinations(parsedData);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setNewDestination({
      ...newDestination,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Add New Destination
  const handleAddNewDestination = async () => {
    try {
      const response = await axios.post(
        "/AdminApi/destination_api.php",
        newDestination
      );
      setDestinations([...destinations, response.data]);
      setNewDestination({
        name: "",
        description: "",
        location: "",
        category: "",
        image_url: "",
      });
    } catch (error) {
      console.error("Error adding new destination:", error);
    }
  };

  // Handle Edit Destination
  const handleEdit = (id) => {
    const destinationToEdit = destinations.find(
      (destination) => destination.destination_id === id
    );
    if (destinationToEdit) {
      setNewDestination(destinationToEdit);
      setIsEditing(true);
      setEditingDestinationId(id);
    }
  };

  // Handle Update Destination
  const handleUpdateDestination = async () => {
    try {
      const updatedDestination = await axios.put(
        "/AdminApi/destination_api.php",
        {
          ...newDestination,
          destination_id: editingDestinationId,
        }
      );
      setDestinations(
        destinations.map((destination) =>
          destination.destination_id === editingDestinationId
            ? updatedDestination.data
            : destination
        )
      );
      setIsEditing(false);
      setEditingDestinationId(null);
      setNewDestination({
        name: "",
        description: "",
        location: "",
        category: "",
        image_url: "",
      });
    } catch (error) {
      console.error("Error updating destination:", error);
    }
  };

  // Handle Delete Destination
  const handleDeleteDestination = async (id) => {
    try {
      await axios.delete("/AdminApi/destination_api.php", {
        data: { destination_id: id },
      });
      setDestinations(
        destinations.filter((destination) => destination.destination_id !== id)
      );
    } catch (error) {
      console.error("Error deleting destination:", error);
    }
  };

  return (
    <div className="destination-section">
      <h2>Destinations</h2>
      <div className="destination-warper">
        {Array.isArray(destinations) ? (
          destinations.length === 0 ? (
            <p>No destinations found.</p>
          ) : (
            destinations.map((destination) => (
              <div
                key={destination.destination_id}
                className="destination-card"
              >
                <h3>{destination.name}</h3>
                <p>
                  <strong>Description:</strong> {destination.description}
                </p>
                <p>
                  <strong>Location:</strong> {destination.location}
                </p>
                <p>
                  <strong>Category:</strong> {destination.category}
                </p>
                <img
                  src={`/public/${destination.image_url}`}
                  alt={destination.name}
                  width="200"
                />
                <div>
                  <button
                    onClick={() => handleEdit(destination.destination_id)}
                    className="edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteDestination(destination.destination_id)
                    }
                    className="delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )
        ) : (
          <p>Loading destinations...</p>
        )}
      </div>
      {/* Add or Edit Destination Form */}
      <h3>{isEditing ? "Edit Destination" : "Add New Destination"}</h3>
      <div className="destination-form">
        <input
          type="text"
          name="name"
          placeholder="Destination Name"
          value={newDestination.name}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newDestination.description}
          onChange={handleChange}
        ></textarea>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newDestination.location}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newDestination.category}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image_url"
          placeholder="Image URL"
          value={newDestination.image_url}
          onChange={handleChange}
        />

        <button
          className="save"
          onClick={
            isEditing ? handleUpdateDestination : handleAddNewDestination
          }
        >
          {isEditing ? "Save Changes" : "Add Destination"}
        </button>
      </div>
    </div>
  );
};

export default DestinationsTab;

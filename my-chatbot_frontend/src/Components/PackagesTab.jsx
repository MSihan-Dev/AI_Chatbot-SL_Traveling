import React, { useState, useEffect } from "react";
import "../Styles/AdminDashboard.css";

const PackagesTab = () => {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    package_id: "",
    destination_id: "",
    title: "",
    price: "",
    duration_days: "",
    inclusions: "",
    created_by: 1, // example admin ID
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("http://localhost/AI_ChatBot/AdminApi/packages.php")
      .then((res) => res.json())
      .then((data) => setPackages(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const method = isEditing ? "PUT" : "POST";
    fetch("http://localhost/AI_ChatBot/AdminApi/packages.php", {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        setIsEditing(false);
        setForm({
          package_id: "",
          destination_id: "",
          title: "",
          price: "",
          duration_days: "",
          inclusions: "",
          created_by: 1,
        });
        return fetch("http://localhost/AI_ChatBot/AdminApi/packages.php");
      })
      .then((res) => res.json())
      .then((data) => setPackages(data));
  };

  const handleEdit = (pkg) => {
    setIsEditing(true);
    setForm(pkg);
  };

  const handleDelete = (id) => {
    fetch("http://localhost/AI_ChatBot/AdminApi/packages.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `package_id=${id}`,
    })
      .then((res) => res.json())
      .then(() =>
        fetch("http://localhost/AI_ChatBot/AdminApi/packages.php")
          .then((res) => res.json())
          .then((data) => setPackages(data))
      );
  };

  return (
    <div className="packages-container">
      <h2>Travel Packages</h2>
      <div className="wrap">
        {packages.map((pkg) => (
          <div key={pkg.package_id} className="package-card">
            <h3>{pkg.title}</h3>
            <p>
              <strong>Destination:</strong> {pkg.destination_name}
            </p>
            <p>
              <strong>Price:</strong> Rs. {pkg.price}
            </p>
            <p>
              <strong>Duration:</strong> {pkg.duration_days} Days
            </p>
            <p>
              <strong>Inclusions:</strong> {pkg.inclusions}
            </p>

            <button onClick={() => handleEdit(pkg)}>Edit</button>
            <button onClick={() => handleDelete(pkg.package_id)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="package-form">
        <h3>{isEditing ? "Edit Package" : "Add Package"}</h3>
        <input
          name="destination_id"
          value={form.destination_id}
          onChange={handleChange}
          placeholder="Destination ID"
        />
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Package Title"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
        />
        <input
          name="duration_days"
          value={form.duration_days}
          onChange={handleChange}
          placeholder="Duration in Days"
        />
        <textarea
          name="inclusions"
          value={form.inclusions}
          onChange={handleChange}
          placeholder="Inclusions"
        ></textarea>
        <button onClick={handleSubmit}>
          {isEditing ? "Update Package" : "Add Package"}
        </button>
      </div>
    </div>
  );
};

export default PackagesTab;

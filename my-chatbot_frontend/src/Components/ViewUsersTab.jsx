import React, { useEffect, useState } from "react";
import "../Styles/AdminDashboard.css";

const ViewUsersTab = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost/AI_ChatBot/AdminApi/get_users.php") // Update to your actual API endpoint
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="view-users-section">
      <h2>All Registered Users</h2>

      {Array.isArray(users) && users.length > 0 ? (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.user_id} className="user-card">
              <p>
                <strong>ID No.:</strong> {user.user_id}
              </p>
              <p>
                <strong>Name:</strong> {user.full_name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>City:</strong> {user.city}
              </p>
              <p>
                <strong>Created Date :</strong> {user.created_at}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default ViewUsersTab;

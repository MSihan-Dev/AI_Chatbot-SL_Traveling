// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import "../Styles/AdminDashboard.css";
import axios from "axios";
import DestinationsTab from "../Components/DestinationsTab";
import ViewUsersTab from "../Components/ViewUsersTab";
import BookingsTab from "../Components/BookingsTab";
import PackagesTab from "../Components/PackagesTab";
import QnATab from "../Components/QnATab";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("destinations");
  const [adminName, setAdminName] = useState("");
  const [stats, setStats] = useState({
    users: 0,
    destinations: 0,
    packages: 0,
    bookings: 0,
  });
  const [newQAs, setNewQAs] = useState([]);

  useEffect(() => {
    // Existing admin data fetch
    axios
      .get("http://localhost/AI_ChatBot/AdminApi/admin_name.php")
      .then((res) => setAdminName(res.data.admin_name))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost/AI_ChatBot/AdminApi/admin_stats.php")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));

    // NEW: Fetch Q&As
    axios
      .get("http://localhost/AI_ChatBot/api/get_new_qna.php")
      .then((res) => {
        const qnaWithEditFlag = res.data.map((item) => ({
          ...item,
          isEditing: false,
        }));
        setNewQAs(qnaWithEditFlag);
      })
      .catch((err) => console.error("Error loading Q&As:", err));
  }, []);

  const handleEdit = (index) => {
    const updated = [...newQAs];
    updated[index].isEditing = true;
    setNewQAs(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...newQAs];
    updated[index][field] = value;
    setNewQAs(updated);
  };

  const handleSave = (qa) => {
    fetch("http://localhost/AI_ChatBot/api/save_qna.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(qa),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setNewQAs((prev) =>
            prev.filter((item) => item.New_Q_A_Id !== qa.New_Q_A_Id)
          );
        }
      });
  };

  const handleDelete = (id) => {
    fetch("http://localhost/AI_ChatBot/api/delete_qna.php?id=" + id)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setNewQAs((prev) => prev.filter((item) => item.New_Q_A_Id !== id));
        }
      });
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => setActiveTab("dashboard")}>Dashboard</li>
          <li onClick={() => setActiveTab("viewUsers")}>View Users</li>
          <li onClick={() => setActiveTab("destinations")}>Destinations</li>
          <li onClick={() => setActiveTab("packages")}>Packages</li>
          <li onClick={() => setActiveTab("bookings")}>Bookings</li>
          <li onClick={() => setActiveTab("qna")}>Q&A List</li>
          <li
            onClick={() => {
              axios
                .post("http://localhost/AI_ChatBot/api/logout.php")
                .then((res) => {
                  if (res.data.success) {
                    // Clear any localStorage or session storage if used
                    localStorage.clear();
                    // Redirect or refresh
                    window.location.href = "/login";
                  }
                })
                .catch((err) => console.error("Logout failed", err));
            }}
          >
            Logout
          </li>{" "}
        </ul>
      </aside>

      <main className="main-content">
        <h1>Welcome, NF. Amr AL Fouz{adminName}</h1>

        {activeTab === "dashboard" && (
          <>
            <div className="cards">
              <div className="card">
                <h3>Total Users</h3>
                <p>{stats.users}</p>
              </div>
              <div className="card">
                <h3>Total Destinations</h3>
                <p>{stats.destinations}</p>
              </div>
              <div className="card">
                <h3>Total Packages</h3>
                <p>{stats.packages}</p>
              </div>
              <div className="card">
                <h3>Total Bookings</h3>
                <p>{stats.bookings}</p>
              </div>
            </div>

            <div className="qna-section">
              <h2>Review New Q&As</h2>
              {newQAs.length === 0 ? (
                <p>No Q&A entries found.</p>
              ) : (
                newQAs.map((qa, index) => (
                  <div className="qna-card" key={qa.New_Q_A_Id}>
                    {qa.isEditing ? (
                      <>
                        <textarea
                          value={qa.New_Questions_List}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "New_Questions_List",
                              e.target.value
                            )
                          }
                        ></textarea>
                        <textarea
                          value={qa.New_Answers_List}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "New_Answers_List",
                              e.target.value
                            )
                          }
                        ></textarea>
                        <button className="save" onClick={() => handleSave(qa)}>
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>Q:</strong> {qa.New_Questions_List}
                        </p>
                        <p>
                          <strong>A:</strong> {qa.New_Answers_List}
                        </p>
                        <button
                          className="edit"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </button>
                      </>
                    )}
                    <button
                      className="delete"
                      onClick={() => handleDelete(qa.New_Q_A_Id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === "destinations" && <DestinationsTab />}
        {activeTab === "viewUsers" && <ViewUsersTab />}
        {activeTab === "bookings" && <BookingsTab />}
        {activeTab === "packages" && <PackagesTab />}
        {activeTab === "qna" && <QnATab />}
      </main>
    </div>
  );
}

export default AdminDashboard;

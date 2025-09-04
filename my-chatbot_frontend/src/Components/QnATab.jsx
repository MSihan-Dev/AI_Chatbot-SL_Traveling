import React, { useEffect, useState } from "react";
import "../Styles/AdminDashboard.css";

const QnATab = () => {
  const [qnaList, setQnaList] = useState([]);
  const [newQnA, setNewQnA] = useState({
    Questions_List: "",
    Answers_List: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all Q&A
  const fetchQnA = () => {
    fetch("http://localhost/AI_ChatBot/AdminApi/qna_api.php")
      .then((res) => res.json())
      .then((data) => setQnaList(data))
      .catch((err) => console.error("Error fetching Q&A:", err));
  };

  useEffect(() => {
    fetchQnA();
  }, []);

  // Insert or Update Q&A
  const handleSubmit = (e) => {
    e.preventDefault();
    const action = editingId ? "update" : "insert";
    const payload = {
      action,
      ...newQnA,
      Q_A_Id: editingId,
      Admin_Id: 1, // Replace with real Admin_Id from session if available
    };

    fetch("http://localhost/AI_ChatBot/AdminApi/qna_api.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        fetchQnA();
        setNewQnA({ Questions_List: "", Answers_List: "" });
        setEditingId(null);
      });
  };

  // Delete Q&A
  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this Q&A?")) {
      fetch("http://localhost/AI_ChatBot/AdminApi/qna_api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", Q_A_Id: id }),
      })
        .then((res) => res.json())
        .then(() => fetchQnA());
    }
  };

  // Set edit form
  const handleEdit = (item) => {
    setNewQnA({
      Questions_List: item.Questions_List,
      Answers_List: item.Answers_List,
    });
    setEditingId(item.Q_A_Id);
  };

  return (
    <div className="qna-tab">
      <h2>Q&A List</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Question"
          value={newQnA.Questions_List}
          onChange={(e) =>
            setNewQnA({ ...newQnA, Questions_List: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Answer"
          value={newQnA.Answers_List}
          onChange={(e) =>
            setNewQnA({ ...newQnA, Answers_List: e.target.value })
          }
          required
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setNewQnA({ Questions_List: "", Answers_List: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Question</th>
            <th>Answer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {qnaList.map((item) => (
            <tr key={item.Q_A_Id}>
              <td>{item.Q_A_Id}</td>
              <td>{item.Questions_List}</td>
              <td>{item.Answers_List}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.Q_A_Id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QnATab;

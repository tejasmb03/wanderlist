import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Reminders.css";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [note, setNote] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedNote, setEditedNote] = useState("");
  const [editedTime, setEditedTime] = useState("");
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) return navigate("/login");
    loadReminders();
  }, [user_id, navigate]);

  const loadReminders = async () => {
    const res = await API.get(`/reminders/${user_id}`);
    // Sort by time
    const sorted = res.data.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    setReminders(sorted);
  };

  const addReminder = async () => {
    if (!note || !reminderTime) return;
    await API.post("/reminders", { note, datetime: reminderTime, user_id });
    setNote("");
    setReminderTime("");
    loadReminders();
  };

  const deleteReminder = async (id) => {
    await API.delete(`/reminders/${id}`);
    loadReminders();
  };

  const startEdit = (id, note, datetime) => {
    setEditingId(id);
    setEditedNote(note);
    setEditedTime(datetime);
  };

  const saveEdit = async () => {
    if (!editedNote || !editedTime) return;
    await API.put(`/reminders/${editingId}`, { note: editedNote, datetime: editedTime });
    setEditingId(null);
    setEditedNote("");
    setEditedTime("");
    loadReminders();
  };

  return (
    <div className="reminder-container">
      <h2 className="reminder-title">⏰ Reminders</h2>

      <div className="reminder-inputs">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Reminder note..."
        />
        <input
          type="datetime-local"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
        />
        <button onClick={addReminder}>Add</button>
      </div>

      <ul className="reminder-list">
        {reminders.map((r) => (
          <li key={r.id} className="reminder-item">
            {editingId === r.id ? (
              <>
                <input
                  type="text"
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                />
                <input
                  type="datetime-local"
                  value={editedTime}
                  onChange={(e) => setEditedTime(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
              </>
            ) : (
              <>
                <span className="reminder-note">{r.note}</span>
                <span className="reminder-time">{new Date(r.datetime).toLocaleString()}</span>
                <button className="edit-btn" onClick={() => startEdit(r.id, r.note, r.datetime)}>
                  ✏️
                </button>
                <button className="delete-btn" onClick={() => deleteReminder(r.id)}>
                  🗑️
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reminders;

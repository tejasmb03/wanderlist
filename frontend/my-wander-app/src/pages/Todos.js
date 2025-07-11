import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./Todos.css";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) return navigate("/login");
    API.get(`/todos/${user_id}`).then((res) => setTodos(res.data));
  }, [user_id, navigate]);

  const addTodo = async () => {
    if (!task) return;
    await API.post("/todos", { task, user_id });
    setTask("");
    const res = await API.get(`/todos/${user_id}`);
    setTodos(res.data);
  };

  const deleteTodo = async (id) => {
    await API.delete(`/todos/${id}`);
    const res = await API.get(`/todos/${user_id}`);
    setTodos(res.data);
  };

  const startEdit = (id, task) => {
    setEditingId(id);
    setEditedTask(task);
  };

  const saveEdit = async () => {
    await API.put(`/todos/${editingId}`, { task: editedTask });
    setEditingId(null);
    setEditedTask("");
    const res = await API.get(`/todos/${user_id}`);
    setTodos(res.data);
  };

  return (
    <div className="todos-container">
      <h2>✅ To-Do</h2>
      <div className="add-todo-box">
        <input
          className="todo-input"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add task..."
        />
        <button className="add-btn" onClick={addTodo}>
          <FaPlus />
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((t) => (
          <li className="todo-item" key={t.id}>
            {editingId === t.id ? (
              <>
                <input
                  className="edit-input"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                />
                <button className="save-btn" onClick={saveEdit}>
                  Save
                </button>
              </>
            ) : (
              <>
                <span className="task-text">{t.task}</span>
                <div className="action-icons">
                  <FaEdit className="icon edit" onClick={() => startEdit(t.id, t.task)} />
                  <FaTrash className="icon delete" onClick={() => deleteTodo(t.id)} />
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;

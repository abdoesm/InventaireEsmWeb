import React, { useState } from "react";
import "../../../assets/css/users/Adduser.css";

const AddUserForm = ({ onClose, fetchUsers }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://192.168.0.146:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) throw new Error("Failed to add user");

      fetchUsers(); // Refresh the user list after adding
      onClose(); // Close the form
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content p-5 bg-white shadow-lg rounded">
        <h2 className="text-xl font-bold mb-3">إضافة مستخدم</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="text" placeholder="اسم المستخدم" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
          </select>
          <div className="flex justify-between">
            <button type="submit" className="btn btn-add">إضافة</button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;

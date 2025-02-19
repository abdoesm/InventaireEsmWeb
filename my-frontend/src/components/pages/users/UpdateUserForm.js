import React, { useState } from "react";

const UpdateUserForm = ({ onClose, user, fetchUsers }) => {
  const [username, setUsername] = useState(user.username);
  const [role, setRole] = useState(user.role);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: No token found.");
      return;
    }

    console.log("Token:", token); // Debugging

    try {
      const response = await fetch(`http://192.168.0.146:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      fetchUsers();
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleUpdate}>
        <h2>تحديث المستخدم</h2>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
          <option value="Moderator">Editor</option>
        </select>

        <button type="submit">تحديث</button>
        <button type="button" onClick={onClose}>إلغاء</button>
      </form>
    </div>
  );
};

export default UpdateUserForm;

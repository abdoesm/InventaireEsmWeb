import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ Define Props Interface
interface User {
  id: number;
  username: string;
  role: string;
}

interface UpdateUserFormProps {
  onClose: () => void;
  user: User;
  fetchUsers: () => void;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ onClose, user, fetchUsers }) => {
  const [username, setUsername] = useState<string>(user.username);
  const [role, setRole] = useState<string>(user.role);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: No token found.");
      return;
    }

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
      // ✅ Handle unknown error type properly
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">تحديث المستخدم</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleUpdate}>
              {/* Username Input */}
              <div className="mb-3">
                <label className="form-label">اسم المستخدم</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Role Selection */}
              <div className="mb-3">
                <label className="form-label">الدور</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">تحديث</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserForm;

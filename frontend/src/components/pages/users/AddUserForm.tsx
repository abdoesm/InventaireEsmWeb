import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";

interface AddUserFormProps {
  onClose: () => void;
  fetchUsers: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onClose, fetchUsers }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "User",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input changes for all fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${Bk_End_SRVR}:5000/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add user");
      }

      fetchUsers();
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">إضافة مستخدم</h5>
            <button type="button" className="btn-close" aria-label="إغلاق" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">اسم المستخدم</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="أدخل اسم المستخدم"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">كلمة المرور</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="أدخل كلمة المرور"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">الدور</label>
                <select 
                  className="form-select" 
                  name="role"
                  value={formData.role} 
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "جارٍ الإضافة..." : "إضافة"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import useUpdateUser from "../../../hooks/user/useUpdateUser";
import { User } from "../../../models/userType";


interface UpdateUserFormProps {
  onClose: () => void;
  user: User;
  fetchUsers: () => void;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ onClose, user, fetchUsers }) => {
  const [username, setUsername] = useState<string>(user.username);
  const [role, setRole] = useState<string>(user.role);

  const { updateUser, loading, error } = useUpdateUser(fetchUsers);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser(user.id, { username, role });
    onClose();
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
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleUpdate}>
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

              <div className="mb-3">
                <label className="form-label">الدور</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "جارٍ التحديث..." : "تحديث"}
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

export default UpdateUserForm;
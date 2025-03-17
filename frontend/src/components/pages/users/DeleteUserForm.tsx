import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { User } from "../../../models/userType";
import useDeleteUser from "../../../hooks/user/useDeleteUser";

interface DeleteUserFormProps {
  onClose: () => void;
  user: User;
  fetchUsers: () => void;
}

const DeleteUserForm: React.FC<DeleteUserFormProps> = ({ onClose, user, fetchUsers }) => {
  const { deleteUser, loading, error } = useDeleteUser(fetchUsers);

  const handleDelete = async () => {
    await deleteUser(user.id);
    onClose();
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-danger">حذف المستخدم</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <p>هل أنت متأكد أنك تريد حذف المستخدم <strong>{user.username}</strong>؟</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              {loading ? "جارٍ الحذف..." : "نعم، حذف"}
            </button>
            <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserForm;
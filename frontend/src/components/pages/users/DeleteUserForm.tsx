import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { User } from "../../../models/userType";

// ✅ Define Props Interface

interface DeleteUserFormProps {
  onClose: () => void;
  user: User;
  fetchUsers: () => void;
}

const DeleteUserForm: React.FC<DeleteUserFormProps> = ({ onClose, user, fetchUsers }) => {
  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${Bk_End_SRVR}:5000/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete user");

      fetchUsers();
      onClose();
    } catch (error) {
      // ✅ Properly handle unknown type error
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
            <h5 className="modal-title text-danger">حذف المستخدم</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>هل أنت متأكد أنك تريد حذف المستخدم <strong>{user.username}</strong>؟</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={handleDelete}>
              نعم، حذف
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserForm;

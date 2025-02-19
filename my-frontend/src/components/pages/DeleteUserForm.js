import React from "react";

const DeleteUserForm = ({ onClose, user, fetchUsers }) => {
  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://192.168.0.146:5000/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete user");

      fetchUsers();
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="modal">
      <h2>حذف المستخدم</h2>
      <p>هل أنت متأكد أنك تريد حذف المستخدم {user.username}؟</p>
      <button onClick={handleDelete}>نعم، حذف</button>
      <button onClick={onClose}>إلغاء</button>
    </div>
  );
};

export default DeleteUserForm;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import AddUserForm from "./AddUserForm";
import UpdateUserForm from "./UpdateUserForm";
import DeleteUserForm from "./DeleteUserForm";

//import "assets/css/users/dataTables.jqueryui.min.css";

DataTable.use(DT);

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showUpdateUserForm, setShowUpdateUserForm] = useState(false);
  const [showDeleteUserForm, setShowDeleteUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://192.168.0.146:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-container p-5 bg-gray-100 h-screen flex flex-col items-center">
      <div className="w-full flex justify-between mb-5">
        <button onClick={() => navigate("/dashboard")} className="btn btn-home">
          <FaHome className="icon" />
        </button>
        <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="w-full max-w-4xl">
          <table id="usersTable" className="display">
            <thead>
              <tr>
                <th>المعرف</th>
                <th>اسم المستخدم</th>
                <th>الدور</th>
                <th>تعديل</th>
                <th>حذف</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUpdateUserForm(true);
                      }}
                      className="btn btn-edit"
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteUserForm(true);
                      }}
                      className="btn btn-delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-5 flex gap-3">
        <button className="btn btn-add" onClick={() => setShowAddUserForm(true)}>
          <FaUserPlus className="icon" /> إضافة
        </button>
      </div>

      {showAddUserForm && <AddUserForm onClose={() => setShowAddUserForm(false)} fetchUsers={fetchUsers} />}
      {showUpdateUserForm && selectedUser && (
        <UpdateUserForm onClose={() => setShowUpdateUserForm(false)} user={selectedUser} fetchUsers={fetchUsers} />
      )}
      {showDeleteUserForm && selectedUser && (
        <DeleteUserForm onClose={() => setShowDeleteUserForm(false)} user={selectedUser} fetchUsers={fetchUsers} />
      )}
    </div>
  );
};

export default Users;

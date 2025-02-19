import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component"; // Import DataTable component
import AddUserForm from "./AddUserForm";
import UpdateUserForm from "./UpdateUserForm";
import DeleteUserForm from "./DeleteUserForm";
import "bootstrap/dist/css/bootstrap.min.css";

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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch users.");

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

  // Define table columns
  const columns = [
    {
      name: "المعرف",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "اسم المستخدم",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "الدور",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "تعديل",
      cell: (row) => (
        <button
          onClick={() => {
            setSelectedUser(row);
            setShowUpdateUserForm(true);
          }}
          className="btn btn-warning btn-sm"
        >
          <FaEdit />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "حذف",
      cell: (row) => (
        <button
          onClick={() => {
            setSelectedUser(row);
            setShowDeleteUserForm(true);
          }}
          className="btn btn-danger btn-sm"
        >
          <FaTrash />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button onClick={() => navigate("/dashboard")} className="btn btn-outline-primary">
          <FaHome className="me-2" /> الصفحة الرئيسية
        </button>
        <h2 className="fw-bold text-center">إدارة المستخدمين</h2>
      </div>

      {/* Users Table */}
      {loading ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <DataTable
          title="قائمة المستخدمين"
          columns={columns}
          data={users}
          pagination
          highlightOnHover
          responsive
          striped
        />
      )}

      {/* Add User Button */}
      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-success" onClick={() => setShowAddUserForm(true)}>
          <FaUserPlus className="me-2" /> إضافة مستخدم
        </button>
      </div>

      {/* Modals for User Forms */}
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

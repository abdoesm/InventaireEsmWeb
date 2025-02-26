import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component";
import AddUserForm from "./AddUserForm";
import UpdateUserForm from "./UpdateUserForm";
import DeleteUserForm from "./DeleteUserForm";
import "bootstrap/dist/css/bootstrap.min.css";

interface User {
  id: number;
  username: string;
  role: string;
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddUserForm, setShowAddUserForm] = useState<boolean>(false);
  const [showUpdateUserForm, setShowUpdateUserForm] = useState<boolean>(false);
  const [showDeleteUserForm, setShowDeleteUserForm] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

      const data: User[] = await response.json();
      setUsers(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      name: "المعرف",
      selector: (row: User) => row.id,
      sortable: true,
    },
    {
      name: "اسم المستخدم",
      selector: (row: User) => row.username,
      sortable: true,
    },
    {
      name: "الدور",
      selector: (row: User) => row.role,
      sortable: true,
    },
    {
      name: "تعديل",
      cell: (row: User) => (
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
      cell: (row: User) => (
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button onClick={() => navigate("/dashboard")} className="btn btn-outline-primary">
          <FaHome className="me-2" /> الصفحة الرئيسية
        </button>
        <h2 className="fw-bold text-center">إدارة المستخدمين</h2>
      </div>

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

      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-success" onClick={() => setShowAddUserForm(true)}>
          <FaUserPlus className="me-2" /> إضافة مستخدم
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

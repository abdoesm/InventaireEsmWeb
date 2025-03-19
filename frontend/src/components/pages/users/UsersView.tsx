import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaPlus } from "react-icons/fa";
import DataTable from "react-data-table-component";
import AddUserForm from "./AddUserForm";
import UpdateUserForm from "./UpdateUserForm";
import DeleteUserForm from "./DeleteUserForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { User } from "../../../models/userType";
import ActionButtons from "../../common/ActionButtons";
import useFetchUsers from "../../../services/user/useFetchUsers";
import HomeBtn from "../../common/HomeBtn";


const Users: React.FC = () => {
  const navigate = useNavigate();
  const { users, loading, error, fetchUsers } = useFetchUsers();
  const [showAddUserForm, setShowAddUserForm] = useState<boolean>(false);
  const [showUpdateUserForm, setShowUpdateUserForm] = useState<boolean>(false);
  const [showDeleteUserForm, setShowDeleteUserForm] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const columns = [
    { name: "المعرف", selector: (row: User) => row.id, sortable: true },
    { name: "اسم المستخدم", selector: (row: User) => row.username, sortable: true },
    { name: "الدور", selector: (row: User) => row.role, sortable: true },
    {
      name: "الإجراءات",
      cell: (row: User) => (
        <ActionButtons
          item={row}
          onEdit={(item) => {
            setSelectedUser(item);
            setShowUpdateUserForm(true);
          }}
          onDelete={(item) => {
            setSelectedUser(item);
            setShowDeleteUserForm(true);
          }}
        />
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
      <HomeBtn/>
        <h2 className="fw-bold text-center">إدارة المستخدمين</h2>
          <button className="btn btn-success px-4 py-2" onClick={() => setShowAddUserForm(true)}>
                            <FaPlus className="me-2" /> إضافة مستخدم         </button>
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
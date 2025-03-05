import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component";
import AddEmployerForm from "./AddEmployerForm";
import UpdateEmployerForm from "./UpdateEmployerForm";
import DeleteEmployerForm from "./DeleteEmployerForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Employer } from "../../../models/employerType";


const Employers: React.FC = () => {
  const navigate = useNavigate();
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddEmployerForm, setShowAddEmployerForm] = useState<boolean>(false);
  const [showUpdateEmployerForm, setShowUpdateEmployerForm] = useState<boolean>(false);
  const [showDeleteEmployerForm, setShowDeleteEmployerForm] = useState<boolean>(false);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);

  const fetchEmployers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${Bk_End_SRVR}:5000/api/employers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch employers.");

      const data: Employer[] = await response.json();
      console.log(data);
      setEmployers(data);
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
    fetchEmployers();
  }, []);

  const columns = [
    {
      name: "المعرف",
      selector: (row: Employer) => row.id,
      sortable: true,
    },
    {
      name: "الاسم الأول",
      selector: (row: Employer) => row.fname,
      sortable: true,
    },
    {
      name: "اسم العائلة",
      selector: (row: Employer) => row.lname,
      sortable: true,
    },
    {
      name: "الوظيفة",
      selector: (row: Employer) => row.title,
      sortable: true,
    },
    {
      name: "تعديل",
      cell: (row: Employer) => (
        <button
          onClick={() => {
            setSelectedEmployer(row);
            setShowUpdateEmployerForm(true);
          }}
          className="btn btn-warning btn-sm"
        >
          <FaEdit />
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "حذف",
      cell: (row: Employer) => (
        <button
          onClick={() => {
            setSelectedEmployer(row);
            setShowDeleteEmployerForm(true);
          }}
          className="btn btn-danger btn-sm"
        >
          <FaTrash />
        </button>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button onClick={() => navigate("/dashboard")} className="btn btn-outline-primary">
          <FaHome className="me-2" /> الصفحة الرئيسية
        </button>
        <h2 className="fw-bold text-center">إدارة الموظفين</h2>
      </div>

      {loading ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <DataTable
          title="قائمة الموظفين"
          columns={columns}
          data={employers}
          pagination
          highlightOnHover
          responsive
          striped
        />
      )}

      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-success" onClick={() => setShowAddEmployerForm(true)}>
          <FaUserPlus className="me-2" /> إضافة موظف
        </button>
      </div>

      {showAddEmployerForm && <AddEmployerForm onClose={() => setShowAddEmployerForm(false)} fetchEmployers={fetchEmployers} />}
      {showUpdateEmployerForm && selectedEmployer && (
  <UpdateEmployerForm 
    onClose={() => setShowUpdateEmployerForm(false)} 
    employer={{ 
      id: selectedEmployer.id, 
      fname: selectedEmployer.fname || "", 
      lname: selectedEmployer.lname || "", 
      title: selectedEmployer.title || "" 
    }} 
    fetchEmployers={fetchEmployers} 
  />
)}

{showDeleteEmployerForm && selectedEmployer && (
  <DeleteEmployerForm 
    onClose={() => setShowDeleteEmployerForm(false)} 
       employer={
        { 
          id: selectedEmployer.id, 
          fname: selectedEmployer.fname || "", 
          lname: selectedEmployer.lname || "", 
          title: selectedEmployer.title || "" 
        }
       }
       fetchEmployers={fetchEmployers} 
  />
)}

    </div>
  );
};

export default Employers;
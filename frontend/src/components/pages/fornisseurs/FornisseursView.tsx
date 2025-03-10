import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component";
import AddFournisseurForm from "./AddFournisseurForm";
import UpdateFournisseurForm from "./UpdateFournisseurForm";
import DeleteFournisseurForm from "./DeleteFournisseurForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Fournisseur } from "../../../models/fournisseurTypes";



const FournisseurView: React.FC = () => {
  const navigate = useNavigate();
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | null>(null);

  const fetchFournisseurs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${Bk_End_SRVR}:5000/api/fournisseurs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch fournisseurs.");

      const data: Fournisseur[] = await response.json();
      setFournisseurs(data);
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
    fetchFournisseurs();
  }, []);

  const columns = [
    { name: "المعرف", selector: (row: Fournisseur) => row.id, sortable: true },
    { name: "الاسم", selector: (row: Fournisseur) => row.name, sortable: true },
    { name: "السجل التجاري", selector: (row: Fournisseur) => row.RC, sortable: true },
    { name: "NIF", selector: (row: Fournisseur) => row.NIF, sortable: true },
    { name: "AI", selector: (row: Fournisseur) => row.AI, sortable: true },
    { name: "NIS", selector: (row: Fournisseur) => row.NIS, sortable: true },
    { name: "الهاتف", selector: (row: Fournisseur) => row.TEL, sortable: true },
    { name: "الفاكس", selector: (row: Fournisseur) => row.FAX, sortable: true },
    { name: "العنوان", selector: (row: Fournisseur) => row.ADDRESS, sortable: true },
    { name: "البريد الإلكتروني", selector: (row: Fournisseur) => row.EMAIL, sortable: true },
    { name: "RIB", selector: (row: Fournisseur) => row.RIB, sortable: true },
    
    // Fixed Buttons
    {
      name: "تعديل",
      cell: (row: Fournisseur) => (
        <button
          onClick={() => {
            setSelectedFournisseur(row);
            setShowUpdateForm(true);
          }}
          className="btn btn-warning btn-sm"
        >
          <FaEdit />
        </button>
      ),
      ignoreRowClick: true,
      fixed: "right", // Fixes column to the right
    },
    {
      name: "حذف",
      cell: (row: Fournisseur) => (
        <button
          onClick={() => {
            setSelectedFournisseur(row);
            setShowDeleteForm(true);
          }}
          className="btn btn-danger btn-sm"
        >
          <FaTrash />
        </button>
      ),
      ignoreRowClick: true,
      fixed: "right", // Fixes column to the right
    },
  ];
  

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button onClick={() => navigate("/dashboard")} className="btn btn-outline-primary">
          <FaHome className="me-2" /> الصفحة الرئيسية
        </button>
        <h2 className="fw-bold text-center">إدارة الموردين</h2>
      </div>

      {loading ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <DataTable
        title="قائمة الموردين"
        columns={columns}
        data={fournisseurs}
        pagination
        highlightOnHover
        responsive
        striped
        fixedHeader
        fixedHeaderScrollHeight="600px"
        persistTableHead
      />
      
      )}

      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-success" onClick={() => setShowAddForm(true)}>
          <FaPlus className="me-2" /> إضافة مورد
        </button>
      </div>

      {showAddForm && 
      <AddFournisseurForm onClose={() => setShowAddForm(false)} fetchFournisseurs={fetchFournisseurs} />}
      {showUpdateForm && selectedFournisseur && (
        <UpdateFournisseurForm 
          onClose={() => setShowUpdateForm(false)} 
          fournisseur={selectedFournisseur} 
          fetchFournisseurs={fetchFournisseurs} 
        />
      )}
      {showDeleteForm && selectedFournisseur && (
        <DeleteFournisseurForm 
          onClose={() => setShowDeleteForm(false)} 
          fournisseur={selectedFournisseur}
          fetchFournisseurs={fetchFournisseurs} 
        />
      )}
    </div>
  );
};

export default FournisseurView;

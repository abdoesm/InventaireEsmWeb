import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import AddBonEntreeForm from "./AddBonEntreeForm";
import UpdateBonEntreeForm from "./UpdateBonEntreeForm";
import ActionButtons from "../../common/ActionButtons";

interface BonEntree {
  id: number;
  id_fournisseur: number;
  date: string;
  TVA: number;
  document_num: string;
}

const BonEntreeView: React.FC = () => {
  const navigate = useNavigate();
  const [bonEntrees, setBonEntrees] = useState<BonEntree[]>([]);
    const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [showAddBonEntreeForm, setShowAddBonEntreeForm] = useState<boolean>(false);
  const [showUpdateBonEntreeForm, setShowUpdateBonEntreeForm] = useState<boolean>(false);
  const [selectedBonEntree, setSelectedBonEntree] = useState<BonEntree | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBonEntrees = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${Bk_End_SRVR}:5000/api/bonentrees`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch bon d'entrée.");

      const data: BonEntree[] = await response.json();
      setBonEntrees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonEntrees();
  }, []);

  const handleEdit = (bonEntree: BonEntree) => {
    setSelectedBonEntree(bonEntree);
    setShowUpdateBonEntreeForm(true);
  };

  const columns = [
    { name: "المعرف", selector: (row: BonEntree) => row.id, sortable: true },
    { name: "رقم المورد", selector: (row: BonEntree) => row.id_fournisseur, sortable: true },
    { name: "التاريخ", selector: (row: BonEntree) => row.date, sortable: true },
    { name: "ضريبة القيمة المضافة", selector: (row: BonEntree) => row.TVA, sortable: true },
    { name: "رقم الوثيقة", selector: (row: BonEntree) => row.document_num },
    {
  

    name: "الإجراءات",
    cell: (row: BonEntree) => (
      <ActionButtons
        item={row}
        onEdit={(item) => {
          setSelectedBonEntree(item);
          setShowUpdateBonEntreeForm(true);
        }}
        onDelete={(item) => {
          setSelectedBonEntree(item);
          setShowDeleteForm(true);
        }}
        onAddition={() => setShowAddBonEntreeForm(true)}
      />
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
        <h2 className="fw-bold text-center">إدارة وصول الاستلام </h2>
      </div>

      {loading ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <DataTable
          title="قائمة بونات الدخول"
          columns={columns}
          data={bonEntrees}
          pagination
          highlightOnHover
          responsive
          striped
        />
      )}

   
      {showAddBonEntreeForm && (
        <AddBonEntreeForm onClose={() => setShowAddBonEntreeForm(false)} fetchBonEntrees={fetchBonEntrees} />
      )}

      {showUpdateBonEntreeForm && selectedBonEntree && (
        <UpdateBonEntreeForm
          onClose={() => setShowUpdateBonEntreeForm(false)}
          fetchBonEntrees={fetchBonEntrees}
          bonEntreeId={selectedBonEntree.id}
        />
      )}
    </div>
  );
};

export default BonEntreeView;

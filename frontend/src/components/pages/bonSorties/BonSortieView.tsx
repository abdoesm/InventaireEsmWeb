import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import UpdateBonSortieForm from "./UpdateBonSortieForm";
import DeleteBonSortieForm from "./DeleteBonSortieForm";
import ActionButtons from "../../common/ActionButtons";
import AddBonSortieForm from "./AddBonSortieForm";
import { Employer } from "../../../models/employerType";
import { Service } from "../../../models/serviceTypes";

interface BonSortie {
  id: number;
  id_employeur: number;
  id_service: number;
  date: string;
}

const BonSortieView: React.FC = () => {
  const navigate = useNavigate();
  const [bonSorties, setBonSorties] = useState<BonSortie[]>([]);
    const [employers, setEmployers] = useState<Employer[]>([]);
     const [services, setServices] = useState<Service[]>([]);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [showAddBonSortieForm, setShowAddBonSortieForm] = useState<boolean>(false);
  const [showUpdateBonSortieForm, setShowUpdateBonSortieForm] = useState<boolean>(false);
  const [selectedBonSortie, setSelectedBonSortie] = useState<BonSortie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBonSorties = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${Bk_End_SRVR}:5000/api/bonsorties`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch bon de sortie.");

      const data: BonSortie[] = await response.json();
      setBonSorties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonSorties();
  }, []);
  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await fetch(`${Bk_End_SRVR}:5000/api/employers`);
        if (!response.ok) throw new Error("Failed to fetch employers");
        const data = await response.json();
        setEmployers(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployers();
  }, []);
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }
  
        const response = await fetch(`${Bk_End_SRVR}:5000/api/services`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) throw new Error("Failed to fetch services.");
  
        const data: Service[] = await response.json();
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      fetchServices();
    }, []);
  const columns = [
    { name: "المعرف", selector: (row: BonSortie) => row.id, sortable: true },
    { name: " الموظف", selector: (row: BonSortie) =>{
      const emplyer = employers.find(emp => emp.id===row.id_employeur);
      return emplyer ? emplyer.fname+" "+emplyer.lname : "غير معروف"
    }, sortable: true },
    { name: "المصلحة", selector: (row: BonSortie) => {
      const service = services.find( srv => srv.id===row.id_service);
      return service ? service.name : "غير معروفة"
    }, sortable: true },
    { name: "التاريخ", selector: (row: BonSortie) => row.date, sortable: true },
    {
      name: "الإجراءات",
      cell: (row: BonSortie) => (
        <ActionButtons
          item={row}
          onEdit={(item) => {
            setSelectedBonSortie(item);
            setShowUpdateBonSortieForm(true);
          }}
          onDelete={(item) => {
            setSelectedBonSortie(item);
            setShowDeleteForm(true);
          }}
          onAddition={() => setShowAddBonSortieForm(true)}
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
        <h2 className="fw-bold text-center">إدارة وصول الخروج</h2>
      </div>

      {loading ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <DataTable
          title="قائمة وصول الخروج"
          columns={columns}
          data={bonSorties}
          pagination
          highlightOnHover
          responsive
          striped
        />
      )}

{showAddBonSortieForm && (
  <AddBonSortieForm onClose={() => setShowAddBonSortieForm(false)} fetchBonSorties={fetchBonSorties} />
)}


{showUpdateBonSortieForm && selectedBonSortie && (
  <UpdateBonSortieForm
    onClose={() => setShowUpdateBonSortieForm(false)}
    fetchBonSorties={fetchBonSorties}
    id={selectedBonSortie.id}
  />
)}


      {showDeleteForm && selectedBonSortie && (
        <DeleteBonSortieForm
        onClose={()=> setShowDeleteForm(false)}
        bonSortieId={selectedBonSortie.id}
        fetchBonSortie={fetchBonSorties}
        />
      )}
    </div>
  );
};

export default BonSortieView;

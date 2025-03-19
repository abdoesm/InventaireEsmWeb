import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaPlus } from "react-icons/fa";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import AddBonRetourForm from "./AddBonRetourForm";
import UpdateBonRetourForm from "./UpdateBonRetourForm";
import DeleteBonRetourForm from "./DeleteBonRetourForm";
import ActionButtons from "../../common/ActionButtons";
import { BonRetour } from "../../../models/bonRetourTypes";
import { Employer } from "../../../models/employerType";
import HomeBtn from "../../common/HomeBtn";



const BonRetourView: React.FC = () => {
  const navigate = useNavigate();
  const [bonRetours, setBonRetours] = useState<BonRetour[]>([]);
  const [employeurs, setEmployeurs] = useState<Employer[]>([]);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [showAddBonRetourForm, setShowAddBonRetourForm] = useState<boolean>(false);
  const [showUpdateBonRetourForm, setShowUpdateBonRetourForm] = useState<boolean>(false);
  const [selectedBonRetour, setSelectedBonRetour] = useState<BonRetour | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBonRetours = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${Bk_End_SRVR}:5000/api/bonretours`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch bon de retour.");

      const data: BonRetour[] = await response.json();
      setBonRetours(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonRetours();
  }, []);
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
        setEmployeurs(data);
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
        selector: (row: BonRetour) => row.id ?? 0, // تجنب إرجاع undefined
        sortable: true 
      },
      { 
        name: "رقم الموظف", 
        selector: (row: BonRetour) => {
          const employer = employeurs.find(emp => emp.id === row.id_employeur);
          return employer ? `${employer.fname} ${employer.lname}` : "غير معروف";
        }, 
        sortable: true 
      },
      { 
        name: "التاريخ", 
        selector: (row: BonRetour) => row.date || "غير متوفر", // تجنب إرجاع undefined
        sortable: true 
      },
      { 
        name: "سبب الإرجاع", 
        selector: (row: BonRetour) => row.return_reason || "غير مذكور" // تجنب إرجاع undefined
      },
      {
        name: "الإجراءات",
        cell: (row: BonRetour) => (
          <ActionButtons
            item={row}
            onEdit={(item) => {
              setSelectedBonRetour(item);
              setShowUpdateBonRetourForm(true);
            }}
            onDelete={(item) => {
              setSelectedBonRetour(item);
              setShowDeleteForm(true);
            }}
            onAddition={() => setShowAddBonRetourForm(true)}
          />
        ),
        ignoreRowClick: true,
      },
    ];
    
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
      <HomeBtn/>
        <h2 className="fw-bold text-center">إدارة وصول الإرجاع </h2>
      </div>

      {loading ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <DataTable
          title="قائمة وصول الإرجاع"
          columns={columns}
          data={bonRetours}
          pagination
          highlightOnHover
          responsive
          striped
        />
      )}

      {showAddBonRetourForm && (
        <AddBonRetourForm onClose={() => setShowAddBonRetourForm(false)} fetchBonRetours={fetchBonRetours} />
      )}

     {showUpdateBonRetourForm && selectedBonRetour && (
      <UpdateBonRetourForm
      onClose={() => setShowUpdateBonRetourForm(false)}
      fetchBonRetours={fetchBonRetours}
      bonRetour_id={selectedBonRetour?.id ?? -1} // يعطي -1 إذا كانت القيمة undefined
    />
    
      )}
      {
        showDeleteForm && selectedBonRetour && (
          <DeleteBonRetourForm 
            onClose={() => setShowDeleteForm(false)} 
            bonRetourId={selectedBonRetour?.id ?? -1}
            fetchBonRetours={fetchBonRetours}
          />
        )
      }
    </div>
  );
};

export default BonRetourView;

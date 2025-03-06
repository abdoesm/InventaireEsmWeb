import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaMapMarkerAlt, FaEdit, FaTrash } from "react-icons/fa";
import DataTable, { TableColumn } from "react-data-table-component";
import AddLocalisationForm from "./AddLocalisationForm";
import UpdateLocalisationForm from "./UpdateLocalisationForm";
import DeleteLocalisationForm from "./DeleteLocalisationForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Localisation } from "../../../models/localisationType";
import { Service } from "../../../models/serviceTypes";

const LocalisationsView: React.FC = () => {
  const navigate = useNavigate();
  const [localisations, setLocalisations] = useState<Localisation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setServicesLoading] = useState<boolean>(true);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [selectedLocalisation, setSelectedLocalisation] = useState<Localisation | null>(null);

  const fetchLocalisations = async () => {
    try {
      const response = await fetch(`${Bk_End_SRVR}:5000/api/localisations`);
      if (!response.ok) throw new Error("Failed to fetch localisations.");
      const data: Localisation[] = await response.json();
      setLocalisations(data);
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
 

  const fetchServices = async () => {
    try {
      const response = await fetch(`${Bk_End_SRVR}:5000/api/services`);
      if (!response.ok) throw new Error("Failed to fetch services");
      const servicesData = await response.json();
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setServicesLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLocalisations();
    fetchServices();
  }, []);

  const columns: TableColumn<Localisation>[] = [
    {
      name: "المعرف",
      selector: (row: Localisation) => row.id ?? 0, // Default to 0 if undefined
      sortable: true,
    },
    {
      name: "اسم الموقع",
      selector: (row: Localisation) => row.loc_name ?? "غير متوفر", // Default to "غير متوفر" if undefined
      sortable: true,
    },
    {
      name: "رقم الطابق",
      selector: (row: Localisation) => row.floor ?? 0, // Default to 0 if undefined
      sortable: true,
    },
    {
      name: "المصلحة",
      selector: (row: Localisation) => {
      
        const service = services.find((s) => s.id === row.id_service);
        return service ? service.name: "غير متوفر";
      },
      sortable: true,
    },
    
    {
      name: "تعديل",
      cell: (row: Localisation) => (
        <button
          onClick={() => {
            setSelectedLocalisation(row);
            setShowUpdateForm(true);
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
      cell: (row: Localisation) => (
        <button
          onClick={() => {
            setSelectedLocalisation(row);
            setShowDeleteForm(true);
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
        <h2 className="fw-bold text-center">إدارة المواقع</h2>
      </div>

      {loading ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <DataTable
          title="قائمة المواقع"
          columns={columns}
          data={localisations}
          pagination
          highlightOnHover
          responsive
          striped
        />
      )}

      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-success" onClick={() => setShowAddForm(true)}>
          <FaMapMarkerAlt className="me-2" /> إضافة موقع جديد
        </button>
      </div>

      {showAddForm && <AddLocalisationForm onClose={() => setShowAddForm(false)} fetchLocalisations={fetchLocalisations} />}
      {showUpdateForm && selectedLocalisation && (
        <UpdateLocalisationForm
          onClose={() => setShowUpdateForm(false)}
          localisation={{
            id: selectedLocalisation.id,
            loc_name: selectedLocalisation.loc_name || "",
            floor: selectedLocalisation.floor || 0,
            id_service: selectedLocalisation.id_service || 0,
          }}
          fetchLocalisations={fetchLocalisations}
        />
      )}
      {showDeleteForm && selectedLocalisation && (
        <DeleteLocalisationForm
          onClose={() => setShowDeleteForm(false)}
          localisation={{
            id: selectedLocalisation.id,
            loc_name: selectedLocalisation.loc_name || "",
            floor: selectedLocalisation.floor || 0,
            id_service: selectedLocalisation.id_service || 0,
          }}
          fetchLocalisations={fetchLocalisations}
        />
      )}
    </div>
  );
};

export default LocalisationsView;
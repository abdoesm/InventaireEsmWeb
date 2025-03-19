import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import DataTable, { TableColumn } from "react-data-table-component";
import AddLocalisationForm from "./AddLocalisationForm";
import UpdateLocalisationForm from "./UpdateLocalisationForm";
import DeleteLocalisationForm from "./DeleteLocalisationForm";

import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Localisation } from "../../../models/localisationType";
import { Service } from "../../../models/serviceTypes";
import ActionButtons from "../../common/ActionButtons";
import HomeBtn from "../../common/HomeBtn";

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
      selector: (row: Localisation) => row.id ?? 0,
      sortable: true,
    },
    {
      name: "اسم الموقع",
      selector: (row: Localisation) => row.loc_name ?? "غير متوفر",
      sortable: true,
    },
    {
      name: "رقم الطابق",
      selector: (row: Localisation) => row.floor ?? 0,
      sortable: true,
    },
    {
      name: "المصلحة",
      selector: (row: Localisation) => {
        const service = services.find((s) => s.id === row.id_service);
        return service ? service.name : "غير متوفر";
      },
      sortable: true,
    },
    {
      name: "الإجراءات",
      cell: (row: Localisation) => (
        <ActionButtons
          item={row}
          onEdit={(item) => {
            setSelectedLocalisation(item);
            setShowUpdateForm(true);
          }}
          onDelete={(item) => {
            setSelectedLocalisation(item);
            setShowDeleteForm(true);
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
        <h2 className="fw-bold text-center">إدارة المواقع</h2>
          <button className="btn btn-success px-4 py-2" onClick={() => setShowAddForm(true)}>
                            <FaPlus className="me-2" /> إضافة موقع         </button>
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

  
      {showAddForm && <AddLocalisationForm onClose={() => setShowAddForm(false)} fetchLocalisations={fetchLocalisations} />}
      {showUpdateForm && selectedLocalisation && (
        <UpdateLocalisationForm
          onClose={() => setShowUpdateForm(false)}
          localisation={selectedLocalisation}
          fetchLocalisations={fetchLocalisations}
        />
      )}
      {showDeleteForm && selectedLocalisation && (
        <DeleteLocalisationForm
          onClose={() => setShowDeleteForm(false)}
          localisation={selectedLocalisation}
          fetchLocalisations={fetchLocalisations}
        />
      )}
    </div>
  );
};

export default LocalisationsView;
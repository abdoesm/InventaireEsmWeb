import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaPlus} from "react-icons/fa";
import DataTable from "react-data-table-component";
import AddServiceForm from "./AddServiceForm";
import UpdateServiceForm from "./UpdateServiceForm";
import DeleteServiceForm from "./DeleteServiceForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Service } from "../../../models/serviceTypes";
import { Employer } from "../../../models/employerType";
import ActionButtons from "../../common/ActionButtons";
import HomeBtn from "../../common/HomeBtn";



const Services: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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
  const columns = [
    { name: "المعرف", selector: (row: Service) => row.id, sortable: true },
    { name: "الاسم", selector: (row: Service) => row.name, sortable: true },
    {
      name: "رئيس الخدمة", 
      selector: (row: Service) => {
        const chef = employers.find(emp => emp.id === row.chef_service_id); // Use employerId instead of service id
        return chef ? chef.fname +" "+ chef.lname : "غير معروف"; 
      }, 
      sortable: true 
    },
    
    {
      name: "الإجراءات",
      cell: (row: Service) => (
        <ActionButtons
          item={row}
          onEdit={(item) => {
            setSelectedService(item);
            setShowUpdateForm(true);
          }}
          onDelete={(item) => {
            setSelectedService(item);
            setShowDeleteForm(true);
          }}

        />
      ),
      ignoreRowClick: true,
    },
  ];
  

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Home Button */}
      <HomeBtn/>
        
        {/* Title */}
        <h2 className="fw-bold text-center flex-grow-1 text-primary">إدارة الخدمات</h2>
        
        {/* Add Service Button */}
        <button className="btn btn-success px-4 py-2" onClick={() => setShowAddForm(true)}>
          <FaPlus className="me-2" /> إضافة مصلحة
        </button>
      </div>
  
      {/* Display Data Table */}
      {loading ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <div className="card shadow-sm p-3">
          <DataTable
            title="قائمة الخدمات"
            columns={columns}
            data={services}
            pagination
            highlightOnHover
            responsive
            striped
          />
        </div>
      )}
  
      {/* Modals for Forms */}
      {showAddForm && <AddServiceForm onClose={() => setShowAddForm(false)} fetchServices={fetchServices} />}
      {showUpdateForm && selectedService && (
        <UpdateServiceForm 
          onClose={() => setShowUpdateForm(false)}
          service={{ ...selectedService }}
          fetchServices={fetchServices} 
        />
      )}
      {showDeleteForm && selectedService && (
        <DeleteServiceForm 
          onClose={() => setShowDeleteForm(false)} 
          service={selectedService} 
          fetchServices={fetchServices} 
        />
      )}
    </div>
  );
  
};

export default Services;

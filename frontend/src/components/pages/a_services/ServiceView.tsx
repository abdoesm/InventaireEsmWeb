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
import CreateBtn from "../../common/CreateBtn";
import useService from "../../../services/a_services/useServices";
import useEmployers from "../../../services/employers/useEmployers";



const Services: React.FC = () => {
 


  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

 const {services,fetchServices , loading,error}= useService(); // Custom hook to manage services
const {employers}= useEmployers(); // Custom hook to manage employers


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
    <>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Home Button */}
      <HomeBtn/>
        
        {/* Title */}
        <h2 className="fw-bold text-center flex-grow-1 text-primary">إدارة المصالح</h2>
        

        <CreateBtn lunch={setShowAddForm} name="إضافة مصلحة" />
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
    </>
  );
  
};

export default Services;

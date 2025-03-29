import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaUserPlus } from "react-icons/fa";
import DataTable from "react-data-table-component";
import AddEmployerForm from "./AddEmployerForm";
import UpdateEmployerForm from "./UpdateEmployerForm";
import DeleteEmployerForm from "./DeleteEmployerForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Employer } from "../../../models/employerType";
import ActionButtons from "../../common/ActionButtons";
import HomeBtn from "../../common/HomeBtn";
import useEmployers from "../../../services/employers/useEmployers";


const Employers: React.FC = () => {


  const [showAddEmployerForm, setShowAddEmployerForm] = useState<boolean>(false);
  const [showUpdateEmployerForm, setShowUpdateEmployerForm] = useState<boolean>(false);
  const [showDeleteEmployerForm, setShowDeleteEmployerForm] = useState<boolean>(false);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const { employers,error,loading,fetchEmployers}= useEmployers()

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
      name: "الإجراءات",
      cell: (row: Employer) => (
        <ActionButtons 
          item={row} 
          onEdit={(employer) => {
            setSelectedEmployer(employer);
            setShowUpdateEmployerForm(true);
          }} 
          onDelete={(employer) => {
            setSelectedEmployer(employer);
            setShowDeleteEmployerForm(true);
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
        <h2 className="fw-bold text-center">إدارة الموظفين</h2>
         <button className="btn btn-success px-4 py-2" onClick={() => setShowAddEmployerForm(true)}>
                    <FaPlus className="me-2" /> إضافة موظف         </button>
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
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import AddBonRetourForm from "./AddBonRetourForm";
import UpdateBonRetourForm from "./UpdateBonRetourForm";
import DeleteBonRetourForm from "./DeleteBonRetourForm";
import ActionButtons from "../../common/ActionButtons";
import { BonRetour } from "../../../models/bonRetourTypes";

import HomeBtn from "../../common/HomeBtn";
import useEmployers from "../../../services/employers/useEmployers";
import useBonRetour from "../../../services/bonRetours/useBonRetour";



const BonRetourView: React.FC = () => {

 
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [showAddBonRetourForm, setShowAddBonRetourForm] = useState<boolean>(false);
  const [showUpdateBonRetourForm, setShowUpdateBonRetourForm] = useState<boolean>(false);
  const [selectedBonRetour, setSelectedBonRetour] = useState<BonRetour | null>(null);
 


const {employers}= useEmployers();

 const {bonRetours,error,loading,fetchBonRetours}= useBonRetour();

    const columns = [
      { 
        name: "المعرف", 
        selector: (row: BonRetour) => row.id ?? 0, // تجنب إرجاع undefined
        sortable: true 
      },
      { 
        name: "رقم الموظف", 
        selector: (row: BonRetour) => {
          const employer = employers.find(emp => emp.id === row.id_employeur);
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
    
          />
        ),
        ignoreRowClick: true,
      },
    ];
    
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
      <HomeBtn/>
        <h2 className="fw-bold text-center">إدارة وصول الإرجاع </h2>
         <button className="btn btn-success px-4 py-2" onClick={() => setShowAddBonRetourForm(true)}>
                    <FaPlus className="me-2" /> إضافة وصل          </button>
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
    </>
  );
};

export default BonRetourView;

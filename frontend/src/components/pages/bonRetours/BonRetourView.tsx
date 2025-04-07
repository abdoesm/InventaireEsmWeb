import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";

import AddBonRetourForm from "./AddBonRetourForm";
import UpdateBonRetourForm from "./UpdateBonRetourForm";
import DeleteBonRetourForm from "./DeleteBonRetourForm";
import ActionButtons from "../../common/ActionButtons";
import { BonRetour } from "../../../models/bonRetourTypes";

import HomeBtn from "../../common/HomeBtn";
import useEmployers from "../../../services/employers/useEmployers";
import useBonRetour from "../../../services/bonRetours/useBonRetour";
import CreateBtn from "../../common/CreateBtn";
import { Title } from "../../common/Title";
import HeaderContainer from "../../common/HeaderContainer";
import SearchInput from "../../common/SearchInput";


const BonRetourView: React.FC = () => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

 
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
   const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddBonRetourForm, setShowAddBonRetourForm] = useState<boolean>(false);
  const [showUpdateBonRetourForm, setShowUpdateBonRetourForm] = useState<boolean>(false);
  const [selectedBonRetour, setSelectedBonRetour] = useState<BonRetour | null>(null);

const {employers}= useEmployers();



 const {bonRetours,error,loading,fetchBonRetours}= useBonRetour();
 const filteredBonSorties = bonRetours.filter((bon) =>
bon.return_reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 bon.id?.toString().includes(searchQuery) ||
 bon.date.includes(searchQuery) 
 ||
 employers.find(e => e.id === bon.id_employeur)?.fname.toLowerCase().includes(searchQuery.toLowerCase()) 

 );
 
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
      <HeaderContainer>
      <HomeBtn/>
      <Title name="إدارة وصول الإرجاع" />
      <SearchInput
            type="text"
            className="form-control"
            placeholder="ابحث برقم الوثيقة أو التاريخ أو المورد..."
            value={searchQuery}
            onChange={handleSearch}
          />
                <CreateBtn lunch={setShowAddBonRetourForm} name="إضافة وصل إرجاع" />

      </HeaderContainer>

      {loading ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <DataTable
          title="قائمة وصول الإرجاع"
          columns={columns}
          data={filteredBonSorties}
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

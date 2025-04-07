import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Fournisseur } from "../../../models/fournisseurTypes";
import FournisseurTable from "./FournisseurTable";
import AddFournisseurForm from "./AddFournisseurForm";
import UpdateFournisseurForm from "./UpdateFournisseurForm";
import DeleteFournisseurForm from "./DeleteFournisseurForm";
import HomeBtn from "../../common/HomeBtn";
import useFornisseurs from "../../../services/fornisseurs/useFornisseurs";
import CreateBtn from "../../common/CreateBtn";

const FournisseurView: React.FC = () => {
 
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | null>(null);

const {fournisseurs,error,loading,fetchFournisseurs}=useFornisseurs();

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
      <HomeBtn/>
        <h2 className="fw-bold text-center">إدارة الموردين</h2>
    
                            <CreateBtn lunch={setShowAddForm} name="إضافة مورد" />
      </div>

      {loading ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <FournisseurTable 
          fournisseurs={fournisseurs} 
          onEdit={(fournisseur) => {
            setSelectedFournisseur(fournisseur);
            setShowUpdateForm(true);
          }} 
          onDelete={(fournisseur) => {
            setSelectedFournisseur(fournisseur);
            setShowDeleteForm(true);
          }} 
          onAddition={(fournisseur) => {
            setSelectedFournisseur(fournisseur);
            setShowAddForm(true);
          }} 
        
        />
      )}

  
      {showAddForm && 
        <AddFournisseurForm onClose={() => setShowAddForm(false)} fetchFournisseurs={fetchFournisseurs} />}
      {showUpdateForm && selectedFournisseur && (
        <UpdateFournisseurForm 
          onClose={() => setShowUpdateForm(false)} 
          fournisseur={selectedFournisseur} 
          fetchFournisseurs={fetchFournisseurs} 
        />
      )}
      {showDeleteForm && selectedFournisseur && (
        <DeleteFournisseurForm 
          onClose={() => setShowDeleteForm(false)} 
          fournisseur={selectedFournisseur}
          fetchFournisseurs={fetchFournisseurs} 
        />
      )}
    </>
  );
};

export default FournisseurView;

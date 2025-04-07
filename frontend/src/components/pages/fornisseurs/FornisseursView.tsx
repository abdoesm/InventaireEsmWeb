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
import { Title } from "../../common/Title";
import HeaderContainer from "../../common/HeaderContainer";

const FournisseurView: React.FC = () => {
 
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | null>(null);

const {fournisseurs,error,loading,fetchFournisseurs}=useFornisseurs();

  return (
    <>
      <HeaderContainer>
      <HomeBtn/>
    <Title    name="إدارة الموردين" />
                            <CreateBtn lunch={setShowAddForm} name="إضافة مورد" />
          </HeaderContainer>
    

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

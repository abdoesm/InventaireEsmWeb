import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";

// ✅ Define Props Interface
interface Fournisseur {
  id: number;
  name: string;
}

interface DeleteFournisseurFormProps {
  onClose: () => void;
  fournisseur: Fournisseur;
  fetchFournisseurs: () => void;
}

const DeleteFournisseurForm: React.FC<DeleteFournisseurFormProps> = ({ onClose, fournisseur, fetchFournisseurs }) => {
  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${Bk_End_SRVR}:5000/api/fournisseurs/${fournisseur.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete fournisseur");

      fetchFournisseurs();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-danger">حذف المورد</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>هل أنت متأكد أنك تريد حذف المورد <strong>{fournisseur.name}</strong>؟</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={handleDelete}>
              نعم، حذف
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteFournisseurForm;

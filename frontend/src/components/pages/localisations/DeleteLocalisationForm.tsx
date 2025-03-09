import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Localisation } from "../../../models/localisationType";

interface DeleteLocalisationFormProps {
  onClose: () => void;
  localisation: Localisation;
  fetchLocalisations: () => void;
}

const DeleteLocalisationForm: React.FC<DeleteLocalisationFormProps> = ({ onClose, localisation, fetchLocalisations }) => {
  const handleDelete = async () => {
    try {
      await fetch(`${Bk_End_SRVR}:5000/api/localisations/${localisation.id}`, { method: "DELETE" });
      fetchLocalisations();
      onClose();
    } catch (error) {
      alert("Error: " + error);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-danger">حذف الموقع</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>هل أنت متأكد أنك تريد حذف الموقع <strong>{localisation.loc_name}</strong>؟</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={handleDelete}>نعم، حذف</button>
            <button className="btn btn-secondary" onClick={onClose}>إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteLocalisationForm;
import React, { useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Service } from "../../../models/serviceTypes";

type DeleteProps = {
  onClose: () => void;
  fetchServices: () => void;
  service: Service;
};

const DeleteServiceForm: React.FC<DeleteProps> = ({ onClose, fetchServices, service }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Bk_End_SRVR}:5000/api/services/${service.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(
          data.error === "لا يمكن حذف الخدمة لأنها تحتوي على عناصر."
            ? "لا يمكن حذف هذه الخدمة لأنها تحتوي على عناصر مرتبطة."
            : "فشل في حذف الخدمة."
        );
        return;
      }

      fetchServices();
      onClose();
    } catch (err) {
      setErrorMessage("حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى.");
      console.error((err as Error).message);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-danger">حذف الخدمة</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <p>هل أنت متأكد أنك تريد حذف الخدمة <strong>{service.name}</strong>؟</p>
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

export default DeleteServiceForm;

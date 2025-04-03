import React, { useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Service } from "../../../models/serviceTypes";
import Modal from "../../common/Modal";

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
          data.error === "لا يمكن حذف المصلحة لأنها تحتوي على عناصر."
            ? "لا يمكن حذف هذه المصلحة لأنها تحتوي على عناصر مرتبطة."
            : "فشل في حذف المصلحة."
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
    <>
            <Modal isOpen={true} onClose={onClose} title="حذف  المصلحة">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <p>هل أنت متأكد أنك تريد حذف المصلحة <strong>{service.name}</strong>؟</p>
       
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={handleDelete}>نعم، حذف</button>
            <button className="btn btn-secondary" onClick={onClose}>إلغاء</button>
          </div>
          </Modal>
          </>
  );
};

export default DeleteServiceForm;

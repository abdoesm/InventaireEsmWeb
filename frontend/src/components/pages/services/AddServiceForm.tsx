import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Service} from "../../../models/serviceTypes";

type Props = {
  onClose: () => void;
  fetchServices: () => void;
};

const AddServiceForm: React.FC<Props> = ({ onClose, fetchServices }) => {
  const [name, setName] = useState("");
  const [chefServiceId, setChefServiceId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Bk_End_SRVR}:5000/api/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, chef_service_id: chefServiceId }),
      });
      if (!response.ok) throw new Error("Failed to add service");
      fetchServices();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">إضافة خدمة جديدة</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">اسم الخدمة</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="أدخل اسم الخدمة"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">رقم رئيس الخدمة</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="أدخل رقم رئيس الخدمة"
                  value={chefServiceId}
                  onChange={(e) => setChefServiceId(Number(e.target.value) || "")}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">إضافة</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceForm;

import React, { useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Service } from "../../../models/serviceTypes";
import useService from "../../../services/a_services/useServices";

interface Props {
  onClose: () => void;
  fetchLocalisations: () => void;
}

const AddLocalisationForm: React.FC<Props> = ({ onClose, fetchLocalisations }) => {
  const [name, setName] = useState("");
  const [floor, setFloor] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { services } = useService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !floor.trim() || !selectedService) {
      setError("يجب ملء جميع الحقول.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${Bk_End_SRVR}:5000/api/localisations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loc_name: name,
          floor: parseInt(floor, 10),
          id_service: selectedService.id,
        }),
      });

      if (!response.ok) throw new Error("فشل في إضافة الموقع");

      fetchLocalisations();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">إضافة موقع</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <input 
                type="text" 
                className="form-control mb-2" 
                placeholder="اسم الموقع" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
              
              <input 
                type="number" 
                className="form-control mb-2" 
                placeholder="رقم الطابق" 
                value={floor} 
                onChange={(e) => setFloor(e.target.value)} 
                required 
              />
              
              <select 
                className="form-control mb-2" 
                value={selectedService?.id || ""}
                onChange={(e) => {
                  const service = services.find(s => s.id === parseInt(e.target.value, 10));
                  setSelectedService(service || null);
                }}
                required
              >
                <option value="">اختر مصلحة</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "جاري الإضافة..." : "إضافة"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>إلغاء</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLocalisationForm;

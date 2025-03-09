import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Localisation } from "../../../models/localisationType";
import { Service } from "../../../models/serviceTypes";

interface UpdateLocalisationFormProps {
  onClose: () => void;
  localisation: Localisation;
  fetchLocalisations: () => void;
}

const UpdateLocalisationForm: React.FC<UpdateLocalisationFormProps> = ({ onClose, localisation, fetchLocalisations }) => {
  const [data, setData] = useState(localisation);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${Bk_End_SRVR}:5000/api/services`);
        if (!response.ok) throw new Error("Failed to fetch services");
        const servicesData = await response.json();
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${Bk_End_SRVR}:5000/api/localisations/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update localisation");
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
            <h5 className="modal-title">تحديث الموقع</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleUpdate}>
              <input type="text" name="loc_name" value={data.loc_name} onChange={handleChange} required className="form-control mb-2" />
              <input type="number" name="floor" value={data.floor} onChange={handleChange} required className="form-control mb-2" />
              <select name="id_service" value={data.id_service} onChange={handleChange} required className="form-control mb-2">
              <option value="">اختر مصلحة</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary">تحديث</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>إلغاء</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateLocalisationForm;

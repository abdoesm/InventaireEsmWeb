import React, { useEffect, useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Service } from "../../../models/serviceTypes";
import { Employer } from "../../../models/employerType";


type UpdateProps = {
  onClose: () => void;
  fetchServices: () => Promise<void>;
  service: Service;
};

const UpdateServiceForm: React.FC<UpdateProps> = ({ onClose, fetchServices, service }) => {
  const [name_service, setName] = useState("");
  const [chef_service_id, setChefServiceId] = useState<number | null>(null);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceById = async () => {
      try {
        const response = await fetch(`${Bk_End_SRVR}:5000/api/services/${service.id}`);
        if (!response.ok) throw new Error("Failed to fetch service details");
        const data = await response.json();
        setName(data.name);
        setChefServiceId(data.chef_service_id);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchServiceById();
  }, [service.id]);

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await fetch(`${Bk_End_SRVR}:5000/api/employers`);
        if (!response.ok) throw new Error("Failed to fetch employers");
        const data = await response.json();
      
        setEmployers(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated.");
        return;
      }

      const response = await fetch(`${Bk_End_SRVR}:5000/api/services/${service.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name_service, chef_service_id }),
      });

      if (!response.ok) {
        const errMessage = await response.text();
        throw new Error(errMessage || "Failed to update service");
      }

      await fetchServices();
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
            <h5 className="modal-title">تحديث المصلحة</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger">{error}</p>}
            {loading ? (
              <p className="text-center">جاري التحميل...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">المصلحة</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name_service}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">رئيس المصلحة</label>
                  <select
                    className="form-control"
                    value={chef_service_id ?? ""}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setChefServiceId(selectedValue ? Number(selectedValue) : null);
                    }}
                  >
                    <option value="">اختر رئيس المصلحة</option>
                    {employers.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {`${emp.fname} ${emp.lname}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    تحديث
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateServiceForm;

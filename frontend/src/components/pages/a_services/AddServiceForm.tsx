import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Employer } from "../../../models/employerType";
import Input from "../../common/Input";
import FormGroup from "../../common/FormGroup";
import { FaUserTie, FaSave, FaTimes } from "react-icons/fa";
import Modal from "../../common/Modal";

type Props = {
  onClose: () => void;
  fetchServices: () => Promise<void>;
};

const AddServiceForm: React.FC<Props> = ({ onClose, fetchServices }) => {
  const [name, setName] = useState("");
  const [chefServiceId, setChefServiceId] = useState<number | null>(null);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmployers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${Bk_End_SRVR}:5000/api/employers`);
        if (!response.ok) throw new Error("Failed to fetch employers");
        const data = await response.json();
        setEmployers(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated.");
        return;
      }

      const response = await fetch(`${Bk_End_SRVR}:5000/api/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, chef_service_id: chefServiceId }),
      });

      if (!response.ok) {
        const errMessage = await response.text();
        throw new Error(errMessage || "Failed to add service");
      }

      await fetchServices();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  //              <FaUserTie className="me-2" /> إضافة مصلحة جديدة


  return (
    <>
      <Modal isOpen={true} onClose={onClose} title=" إضافة مصلحة جديدة">
        {isLoading ? (
          <div className="loading-container">
            <p>جارٍ تحميل البيانات...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="text-danger">{`حدث خطأ: ${error}`}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormGroup label="اسم المصلحة" labelClassName="fw-bold">
              <Input
                type="text"
                className="form-control rounded-0 border-2 border-primary"
                placeholder="أدخل اسم المصلحة"
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup label="رئيس المصلحة" labelClassName="fw-bold">
              {isLoading ? (
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span>جاري تحميل الموظفين...</span>
                </div>
              ) : (
                <select
                  className="form-select rounded-0 border-2 border-primary"
                  value={chefServiceId ?? ""}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setChefServiceId(selectedValue ? Number(selectedValue) : null);
                  }}
                  aria-label="Select service chief"
                >
                  <option value="">-- اختر رئيس المصلحة --</option>
                  {employers.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {`${emp.fname} ${emp.lname}`}
                    </option>
                  ))}
                </select>
              )}
            </FormGroup>

            <div className="modal-footer border-top-0">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-0 d-flex align-items-center"
                onClick={onClose}
              >
                <FaTimes className="me-2" /> إلغاء
              </button>
              <button
                type="submit"
                className="btn btn-primary rounded-0 d-flex align-items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" /> حفظ
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default AddServiceForm;
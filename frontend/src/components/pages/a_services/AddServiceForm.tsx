import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Employer } from "../../../models/employerType";
import Input from "../../common/Input";
import FormGroup from "../../common/FormGroup";
import { FaSave, FaTimes } from "react-icons/fa";
import Modal from "../../common/Modal";
import SearchInput from "../../common/SearchInput";
import SelectionList from "../../common/SelectionList";

type Props = {
  onClose: () => void;
  fetchServices: () => Promise<void>;
};

const AddServiceForm: React.FC<Props> = ({ onClose, fetchServices }) => {
  const [name, setName] = useState("");
  const [employerSearchTerm, setEmployerSearchTerm] = useState("");
  const [selectedEmployerChef, setSelectedEmployer] = useState<Employer | null>(null);
  const [employers, setEmployers] = useState<Employer[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const filteredEmployer = employers.filter(employer =>
    employer.fname.toLowerCase().includes(employerSearchTerm.toLowerCase())
    || employer.lname.toLowerCase().includes(employerSearchTerm.toLowerCase())
  );

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
        body: JSON.stringify({ name, chef_service_id: selectedEmployerChef?.id }),
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

              <SearchInput
                placeholder="ابحث عن الموظف..."
                value={employerSearchTerm}
                onChange={(e) => setEmployerSearchTerm(e.target.value)}
              />

              <SelectionList
                items={filteredEmployer}
                selectedItem={selectedEmployerChef}
                onSelect={(employer) => setSelectedEmployer(employer)}
                getItemLabel={(employer) => `${employer.fname} ${employer.lname}`}
                emptyMessage="لا يوجد موظفون متاحون"
              />

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
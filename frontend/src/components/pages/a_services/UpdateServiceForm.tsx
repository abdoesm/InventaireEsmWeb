import React, { useEffect, useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Service } from "../../../models/serviceTypes";
import { Employer } from "../../../models/employerType";
import Modal from "../../common/Modal";
import FormGroup from "../../common/FormGroup";
import Input from "../../common/Input";
import SearchInput from "../../common/SearchInput";
import SelectionList from "../../common/SelectionList";


type UpdateProps = {
  onClose: () => void;
  fetchServices: () => Promise<void>;
  service: Service;
};

const UpdateServiceForm: React.FC<UpdateProps> = ({ onClose, fetchServices, service }) => {
  const [name_service, setName] = useState("");
  const [employerSearchTerm, setEmployerSearchTerm] = useState("");
  const [selectedEmployerChef, setSelectedEmployer] = useState<Employer | null>(null);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const filteredEmployer = employers.filter(employer =>
    employer.fname.toLowerCase().includes(employerSearchTerm.toLowerCase())
    || employer.lname.toLowerCase().includes(employerSearchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchServiceById = async () => {
      try {
        const response = await fetch(`${Bk_End_SRVR}:5000/api/services/${service.id}`);
        if (!response.ok) throw new Error("Failed to fetch service details");
        const data = await response.json();
        setName(data.name);
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

        body: JSON.stringify({ name: name_service, chef_service_id: selectedEmployerChef?.id }),
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
    <>
      <Modal isOpen={true} onClose={onClose} title="تحديث وصل خروج">
        {loading ? (
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
                className="form-control"
                value={name_service}
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
      </Modal>
    </>
  );
};

export default UpdateServiceForm;

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Fournisseur } from "../../../models/fournisseurTypes";



interface UpdateFournisseurFormProps {
  onClose: () => void;
  fournisseur: Fournisseur;
  fetchFournisseurs: () => void;
}

const stage1Columns = [
  { label: "RC", name: "RC" },
  { label: "NIF", name: "NIF" },
  { label: "AI", name: "AI" },
  { label: "NIS", name: "NIS" },
];

const stage2Columns = [
  { label: "رقم الهاتف", name: "TEL" },
  { label: "الفاكس", name: "FAX" },
  { label: "العنوان", name: "ADDRESS" },
  { label: "البريد الإلكتروني", name: "EMAIL" },
  { label: "RIB", name: "RIB" },
];

const UpdateFournisseurForm: React.FC<UpdateFournisseurFormProps> = ({ onClose, fournisseur, fetchFournisseurs }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: fournisseur.name || "",
    RC: fournisseur.RC || "",
    NIF: fournisseur.NIF || "",
    AI: fournisseur.AI || "",
    NIS: fournisseur.NIS || "",
    TEL: fournisseur.TEL || "",
    FAX: fournisseur.FAX || "",
    ADDRESS: fournisseur.ADDRESS || "",
    EMAIL: fournisseur.EMAIL || "",
    RIB: fournisseur.RIB || "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!formData.name.trim()) {
      setError("اسم المورد مطلوب.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized: No token found.");
      return;
    }

    try {
      const response = await fetch(`${Bk_End_SRVR}:5000/api/fournisseurs/${fournisseur.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: fournisseur.id, ...formData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update fournisseur");
      }

      fetchFournisseurs();
      onClose();
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const renderFormFields = (columns: { label: string; name: string }[]) => {
    return columns.map(({ label, name }, index) => (
      <div className="mb-3" key={index}>
        <label className="form-label">{label}</label>
        <input
          type="text"
          className="form-control"
          name={name}
          placeholder={`أدخل ${label}`}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
        />
      </div>
    ));
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">تحديث المورد</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleUpdate}>
              {step === 1 ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">اسم المورد *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="أدخل اسم المورد"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>
                  {renderFormFields(stage1Columns)}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={handleNext}>
                      التالي
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                      إلغاء
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {renderFormFields(stage2Columns)}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                      رجوع
                    </button>
                    <button type="submit" className="btn btn-primary">
                      تحديث
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateFournisseurForm;
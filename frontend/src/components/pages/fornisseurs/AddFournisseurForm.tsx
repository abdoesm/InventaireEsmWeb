import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Fournisseur } from "../../../models/fournisseurTypes";

type Props = {
  onClose: () => void;
  fetchFournisseurs: () => void;
  fournisseur:Fournisseur
};

const stage1Colmuns=[
  { label: "RC", name: "RC" },
  { label: "NIF", name: "NIF" },
  { label: "AI", name: "AI" },
  { label: "NIS", name: "NIS" },
]
const stage2Colmuns=[
  { label: "رقم الهاتف", name: "TEL" },
  { label: "الفاكس", name: "FAX" },
  { label: "العنوان", name: "ADDRESS" },
  { label: "البريد الإلكتروني", name: "EMAIL" },
  { label: "RIB", name: "RIB" },
]
const AddFournisseurForm: React.FC<Props> = ({ onClose, fetchFournisseurs }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    RC: "",
    NIF: "",
    AI: "",
    NIS: "",
    TEL: "",
    FAX: "",
    ADDRESS: "",
    EMAIL: "",
    RIB: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Bk_End_SRVR}:5000/api/fournisseurs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [key, value || null])
          )
        ),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "فشل في إضافة المورد");
      }

      fetchFournisseurs();
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
            <h5 className="modal-title">إضافة مورد جديد</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
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
                  {stage1Colmuns.map(({ label, name }, index) => (
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
                  ))}
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
                  {stage2Colmuns.map(({ label, name }, index) => (
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
                  ))}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                      رجوع
                    </button>
                    <button type="submit" className="btn btn-primary">
                      إضافة
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

export default AddFournisseurForm;

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";

type Props = {
  onClose: () => void;
  fetchFournisseurs: () => void;
};

const AddFournisseurForm: React.FC<Props> = ({ onClose, fetchFournisseurs }) => {
  const [name, setName] = useState("");
  const [RC, setRc] = useState("");
  const [NIF, setNif] = useState("");
  const [AI, setAi] = useState("");
  const [NIS, setNis] = useState("");
  const [TEL, setTel] = useState("");
  const [FAX, setFax] = useState("");
  const [ADDRESS, setAddress] = useState("");
  const [EMAIL, setEmail] = useState("");
  const [RIB, setRib] = useState("");
  const [error, setError] = useState<string | null>(null);

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
        body: JSON.stringify({
          name,
          RC:RC||null ,
          NIF: NIF || null,
          AI: AI || null,
          NIS: NIS || null,
          TEL: TEL || null,
          FAX: FAX || null,
          ADDRESS: ADDRESS || null,
          EMAIL: EMAIL || null,
          RIB: RIB || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to add fournisseur");

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
              {/* Required Fields */}
              <div className="mb-3">
                <label className="form-label">اسم المورد *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="أدخل اسم المورد"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

             


              {/* Optional Fields */}
              {[
                { label: "RC", state: RC, setState: setRc },
                { label: "NIF", state: NIF, setState: setNif },
                { label: "AI", state: AI, setState: setAi },
                { label: "NIS", state: NIS, setState: setNis },
                { label: "رقم الهاتف", state: TEL, setState: setTel },
                { label: "الفاكس", state: FAX, setState: setFax },
                { label: "العنوان", state: ADDRESS, setState: setAddress },
                { label: "البريد الإلكتروني", state: EMAIL, setState: setEmail },
                { label: "RIB", state: RIB, setState: setRib },
              ].map(({ label, state, setState }, index) => (
                <div className="mb-3" key={index}>
                  <label className="form-label">{label}</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`أدخل ${label}`}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
              ))}

              {/* Buttons */}
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

export default AddFournisseurForm;

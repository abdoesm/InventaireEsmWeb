import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";

interface Fournisseur {
  id: number;
  name: string;
  RC: string;
  NIF: string;
  AI: string;
  NIS: string;
  TEL: string;
  FAX: string;
  ADDRESS: string;
  EMAIL: string;
  RIB: string;
}


interface UpdateFournisseurFormProps {
  onClose: () => void;
  fournisseur: Fournisseur;
  fetchFournisseurs: () => void;
}

const UpdateFournisseurForm: React.FC<UpdateFournisseurFormProps> = ({ onClose, fournisseur, fetchFournisseurs }) => {
  // Ensure default values to prevent issues
  const [name, setName] = useState<string>(fournisseur.name || "");
  const [RC, setRc] = useState<string>(fournisseur.RC || "");
  const [NIF, setNif] = useState<string>(fournisseur.NIF || "");
  const [AI, setAi] = useState<string>(fournisseur.AI || "");
  const [NIS, setNis] = useState<string>(fournisseur.NIS || "");
  const [TEL, setTel] = useState<string>(fournisseur.TEL || "");
  const [FAX, setFax] = useState<string>(fournisseur.FAX || "");
  const [ADDRESS, setAddress] = useState<string>(fournisseur.ADDRESS || "");
  const [EMAIL, setEmail] = useState<string>(fournisseur.EMAIL || "");
  const [RIB, setRib] = useState<string>(fournisseur.RIB || "");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: No token found.");
      return;
    }
  
    const requestData = {
      id: fournisseur.id,
      name: name ,
      RC: RC || "",
      NIF: NIF || "",
      AI: AI || "",
      NIS: NIS || "",
      TEL: TEL || "",
      FAX: FAX || "",
      ADDRESS: ADDRESS || "",
      EMAIL: EMAIL || "",
      RIB: RIB || "",
    };
  
    try {
      console.log("Updating fournisseur with ID:", fournisseur.id);
      console.log("Sending update request:", requestData);
  
      const response = await fetch(`${Bk_End_SRVR}:5000/api/fournisseurs/${fournisseur.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update fournisseur");
      }
  
      fetchFournisseurs();
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  };
  

  return (
    <>
      <div className="modal-backdrop show"></div> {/* Ensure modal styling */}
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">تحديث المورد</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdate}>
                {/* Name Input */}
                <div className="mb-3">
                  <label className="form-label">الاسم</label>
                  <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                {/* RC Input */}
                <div className="mb-3">
                  <label className="form-label">السجل التجاري</label>
                  <input type="text" className="form-control" value={RC} onChange={(e) => setRc(e.target.value)} required />
                </div>
                {/* Other Inputs */}
                {[
                  { label: "NIF", state: NIF, setState: setNif },
                  { label: "AI", state: AI, setState: setAi },
                  { label: "NIS", state: NIS, setState: setNis },
                  { label: "الهاتف", state: TEL, setState: setTel },
                  { label: "الفاكس", state: FAX, setState: setFax },
                  { label: "العنوان", state: ADDRESS, setState: setAddress },
                  { label: "البريد الإلكتروني", state: EMAIL, setState: setEmail },
                  { label: "RIB", state: RIB, setState: setRib },
                ].map((field, index) => (
                  <div className="mb-3" key={index}>
                    <label className="form-label">{field.label}</label>
                    <input type="text" className="form-control" value={field.state} onChange={(e) => field.setState(e.target.value)} />
                  </div>
                ))}
                {/* Buttons */}
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">تحديث</button>
                  <button type="button" className="btn btn-secondary" onClick={onClose}>إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateFournisseurForm;

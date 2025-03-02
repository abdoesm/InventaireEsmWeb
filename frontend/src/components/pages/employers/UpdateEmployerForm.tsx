import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";

// ✅ Define Props Interface
interface Employer {
  id: number;
  fname: string;
  lname: string;
  title: string;
}

interface UpdateEmployerFormProps {
  onClose: () => void;
  employer: Employer;
  fetchEmployers: () => void;
}

const UpdateEmployerForm: React.FC<UpdateEmployerFormProps> = ({ onClose, employer, fetchEmployers }) => {
  const [fname, setfName] = useState<string>(employer.fname);
  const [lname, setlName] = useState<string>(employer.lname);
  const [title, setTitle] = useState<string>(employer.title);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: No token found.");
      return;
    }

    try {
      const response = await fetch(`${Bk_End_SRVR}:5000/api/employers/${employer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fname,lname, title }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update employer");
      }

      fetchEmployers();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">تحديث صاحب العمل</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleUpdate}>
              {/* Name Input */}
              <div className="mb-3">
                <label className="form-label">الاسم</label>
                <input
                  type="text"
                  className="form-control"
                  value={fname}
                  onChange={(e) => setfName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">اللقب</label>
                <input
                  type="text"
                  className="form-control"
                  value={lname}
                  onChange={(e) => setlName(e.target.value)}
                  required
                />
              </div>

              {/* Position Input */}
              <div className="mb-3">
                <label className="form-label">المنصب</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

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
  );
};

export default UpdateEmployerForm;

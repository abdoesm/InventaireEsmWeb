import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Employer } from "../../../models/employerType";

// ✅ Define Props Interface


interface UpdateEmployerFormProps {
  onClose: () => void;
  employer: Employer;
  fetchEmployers: () => void;
}

const UpdateEmployerForm: React.FC<UpdateEmployerFormProps> = ({ onClose, employer, fetchEmployers }) => {
  const [data, setFormData] = useState<Employer>(employer);
  useEffect(() => {
    setFormData(employer);
  }, [employer]);
  
  const handleChange = ( e :React.ChangeEvent<HTMLInputElement>) =>{
    setFormData({...data,[e.target.name]:e.target.value})
  };


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
        body: JSON.stringify(data),
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
                  value={data.fname}
                  name="fname"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">اللقب</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.lname}
                   name="lname"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Position Input */}
              <div className="mb-3">
                <label className="form-label">المنصب</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.title}
                   name="title"
                  onChange={handleChange}
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

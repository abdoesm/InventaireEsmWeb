import React, { useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
interface AddEmployerFormProps {
  onClose: () => void;
  fetchEmployers: () => void;
}

// Add Employer Form
const AddEmployerForm: React.FC<AddEmployerFormProps> = ({ onClose, fetchEmployers }) => {

  const [data,setData]= useState({
    id:"",
    fname:"",
    lname:"",
    title:""
  })


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent)  => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${Bk_End_SRVR}:5000/api/employers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to add employer");

      fetchEmployers();
      onClose();
    } catch (error) {
      console.error("Error adding employer:", error);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">إضافة موظف</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">الاسم الاول للموظف</label>
                 <input
                  type="text"
                  className="form-control"
                  placeholder="الاسم الاول للموظف"
                  name="fname"
                  value={data.fname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">الاسم الاخير  للموظف</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="لاسم الاخير  للموظف"
                  value={data.lname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">المنصب</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="أدخل المنصب"
                  name="title"
                  value={data.title}
                  onChange={handleChange}
              
                />
              </div>
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

export default AddEmployerForm;

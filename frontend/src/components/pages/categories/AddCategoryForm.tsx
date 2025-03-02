import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";

type Props = {
  onClose: () => void;
  fetchCategories: () => void;
};

const AddCategoryForm: React.FC<Props> = ({ onClose, fetchCategories }) => {
  const [name_cat, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Bk_End_SRVR}:5000/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name_cat }),
      });
      if (!response.ok) throw new Error("Failed to add category");
      fetchCategories();
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
            <h5 className="modal-title">إضافة فئة جديدة</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
              {/* Category Name Input */}
              <div className="mb-3">
                <label className="form-label">اسم الفئة</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="أدخل اسم الفئة"
                  value={name_cat}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>


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

export default AddCategoryForm;

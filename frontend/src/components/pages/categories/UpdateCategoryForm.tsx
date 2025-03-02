import React, { useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Category } from "../../../models/categoryTypes"; // Import the Category type

type UpdateProps = {
  onClose: () => void;
  fetchCategories: () => void;
  category: Category; // Ensure the category prop is required
};

const UpdateCategoryForm: React.FC<UpdateProps> = ({ onClose, fetchCategories, category }) => {
  const [name_cat, setName] = useState(category.name_cat);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Bk_End_SRVR}:5000/api/categories/${category.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name_cat }),
      });
      if (!response.ok) throw new Error("Failed to update category");
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
            <h5 className="modal-title">تحديث الفئة</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">اسم الفئة</label>
                <input
                  type="text"
                  className="form-control"
                  value={name_cat}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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

export default UpdateCategoryForm;
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";

type Props = {
  onClose: () => void;
  fetchArticles: () => void;
};

const AddArticleForm: React.FC<Props> = ({ onClose, fetchArticles }) => {
  const [name, setName] = useState("");
  const [unite, setUnite] = useState("");
  const [description, setDescription] = useState("");
  const [remarque, setRemarque] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Bk_End_SRVR}:5000/api/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          unite,
          description,
          remarque,
          id_category: categoryId,
        }),
      });
      if (!response.ok) throw new Error("Failed to add article");
      fetchArticles();
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
            <h5 className="modal-title">إضافة عنصر جديد</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
              {/* Article Name Input */}
              <div className="mb-3">
                <label className="form-label">اسم العنصر</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="أدخل اسم العنصر"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
  
              {/* Unit Input */}
              <div className="mb-3">
                <label className="form-label">الوحدة</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="أدخل الوحدة"
                  value={unite}
                  onChange={(e) => setUnite(e.target.value)}
                />
              </div>
  
              {/* Description Input */}
              <div className="mb-3">
                <label className="form-label">الوصف</label>
                <textarea
                  className="form-control"
                  placeholder="أدخل الوصف"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
  
              {/* Remarks Input */}
              <div className="mb-3">
                <label className="form-label">ملاحظات</label>
                <textarea
                  className="form-control"
                  placeholder="أدخل الملاحظات"
                  value={remarque}
                  onChange={(e) => setRemarque(e.target.value)}
                />
              </div>
  
              {/* Category ID Input */}
              <div className="mb-3">
                <label className="form-label">معرف الفئة</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="أدخل معرف الفئة"
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
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

export default AddArticleForm;
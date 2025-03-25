import React, { useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Article } from "../../../models/articleTypes"; // Import the Article type

type Props = {
  onClose: () => void;
  fetchArticles: () => void;
  article: Article; // Ensure the article prop is required
};

const UpdateArticleForm: React.FC<Props> = ({ onClose, fetchArticles, article }) => {
  const [name, setName] = useState(article.name);
  const [unite, setUnite] = useState(article.unite);
  const [description, setDescription] = useState(article.description);
  const [remarque, setRemarque] = useState(article.remarque);
  const [categoryId, setCategoryId] = useState<number>(article.idCategory);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let id = article.id
      const token = localStorage.getItem("token");
      const response = await fetch(`${Bk_End_SRVR}:5000/api/articles/${article.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id,name, unite, description, remarque, id_category: categoryId }),
      });
      if (!response.ok) throw new Error("Failed to update article");
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
            <h5 className="modal-title">تحديث العنصر</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="mb-3">
                <label className="form-label">اسم العنصر</label>
                <input
                  type="text"
                  className="form-control"
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
                  value={unite}
                  onChange={(e) => setUnite(e.target.value)}
                />
              </div>
  
              {/* Description Input */}
              <div className="mb-3">
                <label className="form-label">الوصف</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
  
              {/* Remark Input */}
              <div className="mb-3">
                <label className="form-label">ملاحظات</label>
                <textarea
                  className="form-control"
                  value={remarque}
                  onChange={(e) => setRemarque(e.target.value)}
                />
              </div>
  
              {/* Category Input */}
              <div className="mb-3">
                <label className="form-label">معرف الفئة</label>
                <input
                  type="number"
                  className="form-control"
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
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

export default UpdateArticleForm;

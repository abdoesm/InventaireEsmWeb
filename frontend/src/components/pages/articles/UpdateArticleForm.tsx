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
  const [categoryId, setCategoryId] = useState<number>(article.id_category);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Bk_End_SRVR}:5000/api/articles/${article.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, unite, description, remarque, id_category: categoryId }),
      });
      if (!response.ok) throw new Error("Failed to update article");
      fetchArticles();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>تحديث العنصر</h3>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="text" value={unite} onChange={(e) => setUnite(e.target.value)} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          <textarea value={remarque} onChange={(e) => setRemarque(e.target.value)} />
          <input type="number" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} required />
          <button type="submit">تحديث</button>
          <button type="button" onClick={onClose}>إلغاء</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateArticleForm;

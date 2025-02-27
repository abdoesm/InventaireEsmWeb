import React, { useState } from "react";
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
    <div className="modal">
      <div className="modal-content">
        <h3>إضافة عنصر جديد</h3>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="اسم العنصر" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="text" placeholder="الوحدة" value={unite} onChange={(e) => setUnite(e.target.value)} />
          <textarea placeholder="الوصف" value={description} onChange={(e) => setDescription(e.target.value)} />
          <textarea placeholder="ملاحظات" value={remarque} onChange={(e) => setRemarque(e.target.value)} />
          <input type="number" placeholder="معرف الفئة" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} required />
          <button type="submit">إضافة</button>
          <button type="button" onClick={onClose}>إلغاء</button>
        </form>
      </div>
    </div>
  );
};

export default AddArticleForm;
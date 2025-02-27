import React from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Article } from "../../../models/articleTypes"; // Import the Article type

type Props = {
  onClose: () => void;
  fetchArticles: () => void;
  article: Article;
};

const DeleteArticleForm: React.FC<Props> = ({ onClose, fetchArticles, article }) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Bk_End_SRVR}:5000/api/articles/${article.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete article");
      fetchArticles();
      onClose();
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>حذف العنصر</h3>
        <p>هل أنت متأكد أنك تريد حذف {article.name}؟</p>
        <button onClick={handleDelete}>نعم، حذف</button>
        <button onClick={onClose}>إلغاء</button>
      </div>
    </div>
  );
};

export default DeleteArticleForm;

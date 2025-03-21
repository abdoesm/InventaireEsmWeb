import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component";
import AddArticleForm from "./AddArticleForm";
import UpdateArticleForm from "./UpdateArticleForm";
import DeleteArticleForm from "./DeleteArticleForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Article } from "../../../models/articleTypes";

const Articles: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${Bk_End_SRVR}:5000/api/articles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch articles.");

      const data: Article[] = await response.json();
      setArticles(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const columns = [
    { name: "المعرف", selector: (row: Article) => row.id ?? 0, sortable: true },
    { name: "الاسم", selector: (row: Article) => row.name ?? "", sortable: true },
    { name: "الوحدة", selector: (row: Article) => row.unite ?? "", sortable: true },
    { name: "الوصف", selector: (row: Article) => row.description ?? "لا يوجد" },
    { name: "ملاحظات", selector: (row: Article) => row.remarque ?? "لا يوجد" },
    { name: "الفئة", selector: (row: Article) => row.idCategory ?? 0, sortable: true },
  
    {
      name: "تعديل",
      cell: (row: Article) => (
        <button
          onClick={() => { 
            setSelectedArticle(row);
            setShowUpdateForm(true); 
          }}
          className="btn btn-warning btn-sm"
        >
          <FaEdit />
        </button>
      ),
      ignoreRowClick: true, 
    },
    {
      name: "حذف",
      cell: (row: Article) => (
        <button
          onClick={() => {
            setSelectedArticle(row);
            setShowDeleteForm(true);
          }}
          className="btn btn-danger btn-sm"
        >
          <FaTrash />
        </button>
      ),
      ignoreRowClick: true, 
    },
  ];
  
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button onClick={() => navigate("/dashboard")} className="btn btn-outline-primary">
          <FaHome className="me-2" /> الصفحة الرئيسية
        </button>
        <h2 className="fw-bold text-center">إدارة المقالات</h2>
      </div>
  
      {loading ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <DataTable
          title="قائمة المقالات"
          columns={columns}
          data={articles}
          pagination
          highlightOnHover
          responsive
          striped
        />
      )}
  
      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-success" onClick={() => setShowAddForm(true)}>
          <FaPlus className="me-2" /> إضافة مقال
        </button>
      </div>
  
      {showAddForm && (
     
          <AddArticleForm onClose={() => setShowAddForm(false)} fetchArticles={fetchArticles} />
     
      )}
  
      {showUpdateForm && selectedArticle && (
      
          <UpdateArticleForm onClose={() => setShowUpdateForm(false)} article={selectedArticle} fetchArticles={fetchArticles} />
      
      )}
  
      {showDeleteForm && selectedArticle && (
       
          <DeleteArticleForm onClose={() => setShowDeleteForm(false)} article={selectedArticle} fetchArticles={fetchArticles} />
     
      )}
    </div>
  );
  
};

export default Articles;

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import DataTable from "react-data-table-component";
import AddArticleForm from "./AddArticleForm";
import UpdateArticleForm from "./UpdateArticleForm";
import DeleteArticleForm from "./DeleteArticleForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { Article } from "../../../models/articleTypes";
import useFetchArticles from "../../../services/article/usefetchArticles";
import useCategories from "../../../services/categories/useCategories";
import ActionButtons from "../../common/ActionButtons";
import HomeBtn from "../../common/HomeBtn";

const Articles: React.FC = () => {

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

const{ articles, loading, error, fetchArticles } = useFetchArticles();
const{categories} = useCategories();
  const columns = [
    { name: "المعرف", selector: (row: Article) => row.id ?? 0, sortable: true },
    { name: "الاسم", selector: (row: Article) => row.name ?? "", sortable: true },
    { name: "الوحدة", selector: (row: Article) => row.unite ?? "", sortable: true },
    { name: "الوصف", selector: (row: Article) => row.description ?? "لا يوجد" },
    { name: "الكمية", selector: (row: Article) => row.totalQuantity ?? 0 },
    { name: "الكمية الدنيا", selector: (row: Article) => row.min_quantity ?? 0 },


    { name: "ملاحظات", selector: (row: Article) => row.remarque ?? "لا يوجد" },
    { name: "الفئة", selector: (row: Article) => {
  
      const category = categories.find(cat => cat.id === row.id_category);
      return category ? category.name_cat : "غير محدد";
    }, sortable: true },

  {  
    name: "الإجراءات",
    cell: (row: Article) => (
      <ActionButtons
        item={row}
        onEdit={(item) => {
          setSelectedArticle(item);
          setShowUpdateForm(true);
        }}
        onDelete={(item) => {
          setSelectedArticle(item);
          setShowDeleteForm(true);
        }}
      />
    ),
    ignoreRowClick: true,
  },
  
  ];
  
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
       <HomeBtn/>
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

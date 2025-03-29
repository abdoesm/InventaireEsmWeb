import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  FaPlus } from "react-icons/fa";
import DataTable from "react-data-table-component";
import AddCategoryForm from "./AddCategoryForm";
import UpdateCategoryForm from "./UpdateCategoryForm";
import DeleteCategoryForm from "./DeleteCategoryForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { Category } from "../../../models/categoryTypes";
import ActionButtons from "../../common/ActionButtons";
import HomeBtn from "../../common/HomeBtn";
import useCategories from "../../../services/categories/useCategories";

const Categories: React.FC = () => {
  const navigate = useNavigate();

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const {categories,loading,error,fetchCategories} = useCategories();
  const columns = [
    { name: "المعرف", selector: (row: Category) => row.id, sortable: true },
    { name: "الاسم", selector: (row: Category) => row.name_cat, sortable: true },
    {
      name: "الإجراءات",
      cell: (row: Category) => (
        <ActionButtons
          item={row}
          onEdit={(item) => {
            setSelectedCategory(item);
            setShowUpdateForm(true);
          }}
          onDelete={(item) => {
            setSelectedCategory(item);
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
        <h2 className="fw-bold text-center">إدارة الفئات</h2>
         <button className="btn btn-success px-4 py-2" onClick={() => setShowAddForm(true)}>
                            <FaPlus className="me-2" /> إضافة فئة          </button>
      </div>

      {loading ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <DataTable
          title="قائمة الفئات"
          columns={columns}
          data={categories}
          pagination
          highlightOnHover
          responsive
          striped
        />
      )}


      {showAddForm && <AddCategoryForm onClose={() => setShowAddForm(false)} fetchCategories={fetchCategories} />}
      {showUpdateForm && selectedCategory && (
        <UpdateCategoryForm
          onClose={() => setShowUpdateForm(false)}
          category={{ ...selectedCategory}}
          fetchCategories={fetchCategories}
        />
      )}
      {showDeleteForm && selectedCategory && (
        <DeleteCategoryForm
          onClose={() => setShowDeleteForm(false)}
          category={{ ...selectedCategory }}
          fetchCategories={fetchCategories}
        />
      )}
    </div>
  );
};

export default Categories;

import React, { useState } from "react";
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
import CreateBtn from "../../common/CreateBtn";

const Categories: React.FC = () => {
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
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
      <HomeBtn/>
        <h2 className="fw-bold text-center">إدارة الفئات</h2>
      
                            <CreateBtn lunch={setShowAddForm} name="إضافة فئة" />
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
    </>
  );
};

export default Categories;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component";
import AddCategoryForm from "./AddCategoryForm";
import UpdateCategoryForm from "./UpdateCategoryForm";
import DeleteCategoryForm from "./DeleteCategoryForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Category } from "../../../models/categoryTypes";
import ActionButtons from "../../common/ActionButtons";

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${Bk_End_SRVR}:5000/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch categories.");

      const data: Category[] = await response.json();
      console.log(data);
      setCategories(data);
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
    fetchCategories();
  }, []);

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
          onAddition={() => setShowAddForm(true)}
        />
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
        <h2 className="fw-bold text-center">إدارة الفئات</h2>
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
          category={{ ...selectedCategory, id: selectedCategory.id.toString() }}
          fetchCategories={fetchCategories}
        />
      )}
      {showDeleteForm && selectedCategory && (
        <DeleteCategoryForm
          onClose={() => setShowDeleteForm(false)}
          category={{ ...selectedCategory, id: selectedCategory.id.toString() }}
          fetchCategories={fetchCategories}
        />
      )}
    </div>
  );
};

export default Categories;

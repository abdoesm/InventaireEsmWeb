import React, { useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Category } from "../../../models/categoryTypes"; 
type DeleteProps = {
    onClose: () => void;
    fetchCategories: () => void;
    category: Category;
  };
  
  const DeleteCategoryForm: React.FC<DeleteProps> = ({ onClose, fetchCategories, category }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
    const handleDelete = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Bk_End_SRVR}:5000/api/categories/${category.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = await response.json();
        if (!response.ok) {
          setErrorMessage(
            data.error === "لا يمكن حذف الفئة لأنها تحتوي على عناصر."
              ? "لا يمكن حذف هذه الفئة لأنها تحتوي على عناصر مرتبطة."
              : "فشل في حذف الفئة."
          );
          return;
        }
  
        fetchCategories();
        onClose();
      } catch (err) {
        setErrorMessage("حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى.");
        console.error((err as Error).message);
      }
    };
  
    return (
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">حذف الفئة</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              <p>هل أنت متأكد أنك تريد حذف الفئة <strong>{category.name_cat}</strong>؟</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={handleDelete}>نعم، حذف</button>
              <button className="btn btn-secondary" onClick={onClose}>إلغاء</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteCategoryForm;
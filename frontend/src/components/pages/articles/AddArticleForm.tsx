import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bk_End_SRVR } from "../../../configs/conf";
import Modal from "../../common/Modal";
import Input from "../../common/Input";
import FormGroup from "../../common/FormGroup";
import useCategories from "../../../services/categories/useCategories";
import { Category } from "../../../models/categoryTypes";
import SelectionList from "../../common/SelectionList";

type Props = {
  onClose: () => void;
  fetchArticles: () => void;
};

const AddArticleForm: React.FC<Props> = ({ onClose, fetchArticles }) => {
  const [name, setName] = useState("");
  const [unite, setUnite] = useState("");
  const [description, setDescription] = useState("");
  const [remarque, setRemarque] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [minQuantity, setMinQuantitiy] = useState<number>(0)
  const [error, setError] = useState<string | null>(null);

  const { categories } = useCategories();

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
          id_category: selectedCategory?.id,
          min_quantity: minQuantity,
        }),
      });
      if (!response.ok) throw new Error("Failed to add article");
      fetchArticles();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  };
  //إضافة عنصر جديد
  return (
    <>
      <Modal isOpen={true} onClose={onClose} title="إضافة عنصر جديد
 ">
        {error ? (
          <div className="error-container">
            <p className="text-danger">{`حدث خطأ: ${error}`}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Article Name Input */}
            <FormGroup label="اسم العنصر" labelClassName="fw-bold">
              <Input
                type="text"
                className="form-control"
                placeholder="أدخل اسم العنصر"
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormGroup>

            {/* Unit Input */}
            <FormGroup label=" الوحدة" labelClassName="fw-bold">
              <Input
                type="text"
                className="form-control"
                placeholder="أدخل الوحدة"
                value={unite}
                name="unite"
                onChange={(e) => setUnite(e.target.value)}
              />
            </FormGroup>

          

            <FormGroup label=" الفئة" labelClassName="fw-bold">



              <SelectionList
                items={categories || []}
                selectedItem={selectedCategory}
                onSelect={(category) => setSelectedCategory(category)}
                getItemLabel={(category) => ` ${category.id} ${category.name_cat}`}
                emptyMessage="لا توجد فئات متاحة"
              />

            </FormGroup>

            {/* Min Quantitiy Input */}
            <FormGroup label=" الكمية الدنيا" labelClassName="fw-bold">
              <Input
                type="number"
                className="form-control"
                placeholder="أدخل  الكمية الدنيا"
                value={minQuantity}
                name="minQuantity"
                onChange={(e) => setMinQuantitiy(Number(e.target.value))}
                required
              />
              </FormGroup>
  {/* Description Input */}
  <FormGroup label=" الوصف" labelClassName="fw-bold">
              <textarea
                className="form-control"
                placeholder="أدخل الوصف"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>

            {/* Remarks Input */}
            <FormGroup label=" ملاحظات" labelClassName="fw-bold">
              <textarea
                className="form-control"
                placeholder="أدخل الملاحظات"
                value={remarque}
                onChange={(e) => setRemarque(e.target.value)}
              />
            </FormGroup>
            {/* Buttons */}
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">إضافة</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>إلغاء</button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );

};

export default AddArticleForm;
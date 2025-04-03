import React, { useEffect, useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Article } from "../../../models/articleTypes"; // Import the Article type
import FormGroup from "../../common/FormGroup";
import SelectionList from "../../common/SelectionList";
import { Category } from "../../../models/categoryTypes";
import useCategories from "../../../services/categories/useCategories";
import Modal from "../../common/Modal";
import Input from "../../common/Input";

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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [minQuantity, setMinQuantitiy] = useState<number>(article.min_quantity);
  const [error, setError] = useState<string | null>(null);

  const { categories } = useCategories();
  // Set initial category once categories are available
  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories.find((category) => category.id === article.id_category) || null);
    }
  }, [categories, article.id_category]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let id = article.id
      const token = localStorage.getItem("token");
      const response = await fetch(`${Bk_End_SRVR}:5000/api/articles/${article.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, name, unite, description, remarque, id_category: selectedCategory?.id, min_quantity: minQuantity }),
      });
      if (!response.ok) throw new Error("Failed to update article");
      fetchArticles();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <>
      <Modal isOpen={true} onClose={onClose} title="تحديث عنصر جديد
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
              <button type="submit" className="btn btn-primary">تحديث</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>إلغاء</button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );

};

export default UpdateArticleForm;

import React, { useEffect, useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf"; // Assuming this is your backend URL configuration
import Modal from "../../common/Modal"; // Modal component for wrapping the form
import Input from "../../common/Input"; // Input component for handling inputs
import FormGroup from "../../common/FormGroup"; // A wrapper for labels and inputs
import { Article } from "../../../models/articleTypes";
import { FaPlus } from "react-icons/fa"; // Icon for adding new adjustment
import SearchInput from "../../common/SearchInput";
import ArticleSelection from "../../common/ArticleSelection";
import useFetchArticles from "../../../services/article/usefetchArticles";
import { checkAuth, UserType } from "../../../App";

type Props = {
  onClose: () => void;
  fetchAdjustments: () => void;
};

const AddAdjustementForm: React.FC<Props> = ({ onClose, fetchAdjustments }) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<string>("increase");
    const [user, setUser] = useState<UserType>();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [adjustmentDate, setAdjustmentDate] = useState<string>("");
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);  // Added state to track submitting
  const { articles } = useFetchArticles();

  const filteredArticles = articles.filter(article =>
    article.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
 

  useEffect(() => {
         const authenticatedUser = checkAuth();
         console.log("Authenticated User:", authenticatedUser);
         setUser(authenticatedUser);
     }, []);
     
     useEffect(() => {
      if (selectedArticle) {
        const article = articles.find((a) => a.id === selectedArticle.id);
        if (article) {
          setAvailableQuantity(article.totalQuantity ?? 0);
        }
      }
    }, [selectedArticle, articles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedArticle) {
      setError("يرجى اختيار المقال");
      return;
    }
    console.log("Available Quantity:", availableQuantity);
    if (adjustmentType === "decrease" && quantity > availableQuantity) {
      setError("الكمية المدخلة أكبر من الكمية المتوفرة للعنصر.");
      return;
    }
  if(quantity <= 0) {
      setError("الكمية يجب أن تكون أكبر من 0.");
      return;
    }
 
    setIsSubmitting(true); // Start submitting

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Bk_End_SRVR}:5000/api/articles/adjustments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          article_id: selectedArticle.id,
          quantity,
          user_id: user?.id,
          adjustment_type: adjustmentType,
          adjustment_date: adjustmentDate,
        }),
      });

      if (!response.ok) throw new Error("فشل إضافة التعديل");

      fetchAdjustments();
      onClose(); // Close the modal after successful submission
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false); // End submitting
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="إضافة تعديل جديد">
    
      <form onSubmit={handleSubmit}>


        {/* Search Input for Articles */}
        <FormGroup label="حدد المقالات لإضافتها" labelClassName="fw-bold">
          <SearchInput
            placeholder="ابحث عن المقال..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ArticleSelection
            articles={filteredArticles}
            selectedEntrees={
              selectedArticle && selectedArticle.id !== undefined
                ? [{ idArticle: selectedArticle.id, quantity: 0 }]
                : []
            }
            onArticleSelect={(article) => {
              if (selectedArticle?.id === article.id) {
                setSelectedArticle(null); // unselect if clicked again
              } else {
                setSelectedArticle(article);
              }
            }}
          />

        </FormGroup>

        {/* Quantity Input */}
        <FormGroup label="الكمية" labelClassName="fw-bold">
          <Input
            type="number"
            className="form-control"
            placeholder="أدخل الكمية"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </FormGroup>

        {/* Adjustment Type Selection */}
        <FormGroup label="النوع" labelClassName="fw-bold">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="increase"
              value="increase"
              checked={adjustmentType === "increase"}
              onChange={() => setAdjustmentType("increase")}
            />
            <label className="form-check-label" htmlFor="increase">
              زيادة
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="decrease"
              value="decrease"
              checked={adjustmentType === "decrease"}
              onChange={() => setAdjustmentType("decrease")}
            />
            <label className="form-check-label" htmlFor="decrease">
              نقص
            </label>
          </div>
        </FormGroup>

        {/* Adjustment Date Input */}
        <FormGroup label="تاريخ التعديل" labelClassName="fw-bold">
          <Input
            type="date"
            className="form-control"
            value={adjustmentDate}
            name="adjustmentDate"
            onChange={(e) => setAdjustmentDate(e.target.value)}
            required
          />
        </FormGroup>

        {/* Submit and Cancel Buttons */}
        <div className="modal-footer">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}  // Disable button when submitting
          >
            {isSubmitting ? "جاري إضافة التعديل..." : <FaPlus />} إضافة التعديل
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            إلغاء
          </button>
        </div>
      </form>
      {error && (
        <div className="error-container">
          <p className="text-danger">{`حدث خطأ: ${error}`}</p>
        </div>
      )}
    </Modal>
  );
};

export default AddAdjustementForm;

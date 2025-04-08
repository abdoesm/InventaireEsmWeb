import React, { useEffect, useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import Input from "../../common/Input";
import FormGroup from "../../common/FormGroup";
import Modal from "../../common/Modal";
import { checkAuth, UserType } from "../../../App";
import { Adjustement } from "../../../models/adjustementTypes";

type Props = {
  onClose: () => void;
  fetchAdjustments: () => void;
  adjustment: Adjustement;
};

const UpdateAdjustementForm: React.FC<Props> = ({ onClose, fetchAdjustments, adjustment }) => {
  const [quantity, setQuantity] = useState<number>(adjustment.quantity);
  const [adjustmentType, setAdjustmentType] = useState<string>(adjustment.adjustment_type);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const authenticatedUser = checkAuth();
    setUser(authenticatedUser);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${Bk_End_SRVR}:5000/api/articles/adjustments/${adjustment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          article_id: adjustment.article_id,
          user_id: user?.id,
          adjustment_date: adjustment.adjustment_date,
          quantity,
          adjustment_type: adjustmentType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "خطأ في تعديل المخزون");
      }

      fetchAdjustments();
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="تعديل المخزون">
      <form onSubmit={handleSubmit} >

        <FormGroup label="الكمية">
          <Input type="number" name="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </FormGroup>

        <FormGroup label="نوع التعديل">
  <select
    value={adjustmentType}
    onChange={(e) => setAdjustmentType(e.target.value)}
    className={`form-select form-select-lg ${adjustmentType === "increase" ? "border-success" : adjustmentType === "decrease" ? "border-danger" : ""}`}
  >
    <option value="increase">زيادة</option>
    <option value="decrease">نقصان</option>
  </select>
</FormGroup>


        {error && <div className="text-red-500">{error}</div>}

        <div className="modal-footer">


        <button type="submit" disabled={isSubmitting}  className="btn btn-primary">
            {isSubmitting ? "جاري التحديث..." : "تعديل"}
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            إلغاء
          </button>
      
        </div>

      </form>
    </Modal>
  );
};

export default UpdateAdjustementForm;

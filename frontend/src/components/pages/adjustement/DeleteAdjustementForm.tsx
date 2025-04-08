import React, { useState, useEffect } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import Modal from "../../common/Modal";
import { checkAuth, UserType } from "../../../App";
type Props = {
  onClose: () => void;
  fetchAdjustments: () => void;
  adjustment_id: number;
};

const DeleteAdjustmentForm: React.FC<Props> = ({ onClose, fetchAdjustments, adjustment_id }) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const authenticatedUser = checkAuth();
    setUser(authenticatedUser);
  }, []);

  const handleDelete = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${Bk_End_SRVR}:5000/api/articles/adjustments/${adjustment_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "خطأ في حذف التعديل");
      }

      fetchAdjustments(); // Refresh adjustments list
      onClose(); // Close modal after successful deletion
    } catch (error: any) {
      setError(error.message); // Set error if deletion fails
    } finally {
      setIsSubmitting(false); // Set submitting state to false after the request
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="حذف التعديل">
     

        {error && <div className="text-red-500">{error}</div>}
        <p>هل أنت متأكد أنك تريد حذف التعديل لهذا العنصر؟  <strong> {adjustment_id}</strong></p>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={handleDelete}>             {isSubmitting ? "جاري الحذف..." : "حذف"}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>إلغاء</button>
        </div>
 
    </Modal>
  );
};

export default DeleteAdjustmentForm;

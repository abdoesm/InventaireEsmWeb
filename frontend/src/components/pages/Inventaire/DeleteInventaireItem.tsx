import React, { useState } from 'react';
import { Bk_End_SRVR } from '../../../configs/conf';

interface DeleteInventaireItemProps {
    onClose: () => void;
    InventaireItemId: number;
    fetchInventaireItems: () => void;
}

const DeleteInventaireItem: React.FC<DeleteInventaireItemProps> = ({
    onClose,
    InventaireItemId,
    fetchInventaireItems,
}) => {
       const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${Bk_End_SRVR}:5000/api/inventaire/${InventaireItemId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                setErrorMessage("فشل في حذف الجرد."
                );
                return;
            }

            fetchInventaireItems();
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
                        <h5 className="modal-title text-danger">حذف الجرد</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <p>هل أنت متأكد أنك تريد حذف  الجرد <strong>{InventaireItemId}</strong>؟</p>
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

export default DeleteInventaireItem;
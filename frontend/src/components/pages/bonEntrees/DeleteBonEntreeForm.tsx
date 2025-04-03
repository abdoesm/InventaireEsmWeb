import React, { useState } from 'react'
import { Bk_End_SRVR } from '../../../configs/conf';
import Modal from '../../common/Modal';



type DeleteProps = {
    onClose: () => void;
    bonEntreeid: number;
    fetchBonEntree: () => void;
  };
const DeleteBonEntreeForm: React.FC<DeleteProps> = ({onClose,bonEntreeid,fetchBonEntree}) => {

 const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
    const handleDelete = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Bk_End_SRVR}:5000/api/bonentrees/${bonEntreeid}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = await response.json();
        if (!response.ok) {
          setErrorMessage(
            data.error === "لا يمكن حذف الوصل لأنها تحتوي على عناصر."
              ? "لا يمكن حذف هذه الوصل لأنها تحتوي على عناصر مرتبطة."
              : "فشل في حذف الوصل."
          );
          return;
        }
  fetchBonEntree()
        onClose();
      } catch (err) {
        setErrorMessage("حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى.");
        console.error((err as Error).message);
      }
    };
  

  return (
    <>
            <Modal isOpen={true} onClose={onClose} title="حذف وصل إستلام">
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <p>هل أنت متأكد أنك تريد حذف الوصل <strong>{bonEntreeid}</strong>؟</p>
        
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={handleDelete}>نعم، حذف</button>
          <button className="btn btn-secondary" onClick={onClose}>إلغاء</button>
        </div>
        </Modal>
        </>
  )
}

export default DeleteBonEntreeForm
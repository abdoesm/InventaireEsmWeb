import React, { useState } from "react";



const DeleteBonSortieForm: React.FC = () => {
    const [data, setData] = useState({
        id_fournisseur: 0,
        date: "",
        document_num: "",
    });


    return (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">حذف وصل خروج</h5>
                        <button type="button" className="btn-close" aria-label="إغلاق" ></button>
                    </div>
                  
                </div>
            </div>
        </div>
    );
};

export default DeleteBonSortieForm;

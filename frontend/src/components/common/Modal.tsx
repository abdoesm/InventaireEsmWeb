


// Define the ModelProps type
interface ModelProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title:string;
}

const Modal  : React.FC<ModelProps> = ({ isOpen, onClose, children,title }) => {
    return (
        <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" aria-label="إغلاق" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;

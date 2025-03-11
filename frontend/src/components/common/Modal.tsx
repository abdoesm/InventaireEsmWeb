interface Props {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }
  
  const Modal: React.FC<Props> = ({ show, onClose, children }) => {
    if (!show) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          {children}
          <button onClick={onClose} className="btn btn-secondary mt-3">إغلاق</button>
        </div>
      </div>
    );
  };
  
  export default Modal;
  
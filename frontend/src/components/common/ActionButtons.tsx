import { FaEdit, FaTrash } from "react-icons/fa";
import { Fournisseur } from "../../models/fournisseurTypes";

interface Props {
  fournisseur: Fournisseur;
  onEdit: (fournisseur: Fournisseur) => void;
  onDelete: (fournisseur: Fournisseur) => void;
}

const ActionButtons: React.FC<Props> = ({ fournisseur, onEdit, onDelete }) => {
  return (
    <div className="d-flex gap-2">
      <button className="btn btn-warning btn-sm" onClick={() => onEdit(fournisseur)}>
        <FaEdit />
      </button>
      <button className="btn btn-danger btn-sm" onClick={() => onDelete(fournisseur)}>
        <FaTrash />
      </button>
    </div>
  );
};

export default ActionButtons;

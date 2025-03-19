import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

interface Props<T> {
  item: T; 
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onAddition?: (item: T) => void;
}

const ActionButtons = <T,>({ item, onEdit, onDelete, onAddition }: Props<T>) => {
  return (
    <div className="d-flex gap-2">
      {onEdit && (
        <button className="btn btn-warning btn-sm" onClick={() => onEdit(item)}>
          <FaEdit />
        </button>
      )}
      {onDelete && (
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(item)}>
          <FaTrash />
        </button>
      )}
   {onAddition && (
  <button 
    className="btn btn-success btn-sm" 
    onClick={() => onAddition(item)}
  >
    <FaPlus />
  </button>
)}

    </div>
  );
};

export default ActionButtons;

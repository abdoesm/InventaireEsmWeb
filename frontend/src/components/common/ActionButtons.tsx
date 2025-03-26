import { FaEdit, FaPlus, FaPrint, FaTrash } from "react-icons/fa";

interface Props<T> {
  item: T; 
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onAddition?: (item: T) => void;
  onPrint?: (item: T) => void;
}

const ActionButtons = <T,>({ item, onEdit, onDelete, onAddition,onPrint }: Props<T>) => {
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
 {onPrint && (
  <button 
    className="btn btn-success btn-sm" 
    onClick={() => onPrint(item)}
  >
    <FaPrint />
  </button>
)}

    </div>
  );
};

export default ActionButtons;

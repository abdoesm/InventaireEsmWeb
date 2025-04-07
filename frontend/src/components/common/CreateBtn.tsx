
import { FaPlus } from "react-icons/fa";



interface CreateBtnProps {
  lunch: (value: boolean) => void;
  name: string;
}

const CreateBtn = ({ lunch, name }: CreateBtnProps) => {
  return (
    <div className="d-flex justify-content-end">
      <button
        className="btn btn-success d-flex align-items-center px-4"
        onClick={() => lunch(true)}
      >
        <FaPlus className="me-2" />{name}
      </button>
    </div>
  );

}
export default CreateBtn;


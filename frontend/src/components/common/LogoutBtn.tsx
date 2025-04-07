import exp from "constants";
import { FaSignOutAlt } from "react-icons/fa";


const LogoutBtn: React.FC<{ logout: () => void }> = ({ logout }) => (
  <button onClick={logout}  className="btn btn-danger btn-sm position-fixed bottom-0 end-0 m-3 d-flex align-items-center shadow" style={{ width: "auto", whiteSpace: "nowrap" }}>
    <FaSignOutAlt className="me-1" /> تسجيل الخروج
  </button>
);
export default LogoutBtn;
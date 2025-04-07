import { FaCog } from "react-icons/fa";


const SettingBtn: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
    <button onClick={() => navigate("/settings")} className="btn btn-secondary btn-sm d-flex align-items-center">
      <FaCog className="me-1" /> الإعدادات
    </button>
  );
  
  export default SettingBtn;
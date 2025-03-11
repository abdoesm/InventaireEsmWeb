import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaCog } from "react-icons/fa";

interface FooterProps {
  logout: () => void;
}

const Footer: React.FC<FooterProps> = ({ logout }) => {
  const navigate = useNavigate();

  return (
    <footer>
      <div className="footer-buttons">
        <button onClick={logout} className="btn btn-danger btn-sm">
          <FaSignOutAlt className="me-1" /> تسجيل الخروج
        </button>
        <button onClick={() => navigate("/settings")} className="btn btn-secondary btn-sm">
          <FaCog className="me-1" /> الإعدادات
        </button>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaCog } from "react-icons/fa";

interface FooterProps {
  logout: () => void;
}

const Footer: React.FC<FooterProps> = ({ logout }) => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid bg-light py-2 mt-3">
      <div className="d-flex justify-content-center gap-2">
        <LogoutBtn logout={logout} />
        <SettingBtn navigate={navigate} />
      </div>
    </div>
  );
};

// Logout Button Component
const LogoutBtn: React.FC<{ logout: () => void }> = ({ logout }) => (
  <button onClick={logout} className="btn btn-danger btn-sm d-flex align-items-center">
    <FaSignOutAlt className="me-1" /> تسجيل الخروج
  </button>
);

// Settings Button Component
const SettingBtn: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
  <button onClick={() => navigate("/settings")} className="btn btn-secondary btn-sm d-flex align-items-center">
    <FaCog className="me-1" /> الإعدادات
  </button>
);

export default Footer;

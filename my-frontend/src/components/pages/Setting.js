import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaDatabase, FaUsers, FaSignOutAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Setting = ({ logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      {/* Title */}
      <h1 className="mb-4 text-center fw-bold">الإعدادات</h1>

      {/* Home Button */}
      <button className="btn btn-outline-secondary position-absolute top-0 start-0 m-3" onClick={() => navigate("/dashboard")}>
        <FaHome size={24} />
      </button>

      {/* Options */}
      <div className="d-flex flex-column gap-3">
        {/* Backup Data Button */}
        <button className="btn btn-warning d-flex align-items-center px-4 py-2 shadow">
          <FaDatabase className="me-2" />
          <span>نسخ احتياطي</span>
        </button>

        {/* Users Button */}
        <button className="btn btn-primary d-flex align-items-center px-4 py-2 shadow" onClick={() => navigate("/users")}>
          <FaUsers className="me-2" />
          <span>المستخدمين</span>
        </button>
      </div>

      {/* Logout Button */}
      <button onClick={handleLogout} className="btn btn-danger position-absolute bottom-0 end-0 m-3 d-flex align-items-center px-4 py-2 shadow">
        <FaSignOutAlt className="me-2" />
        <span>تسجيل الخروج</span>
      </button>
    </div>
  );
};

export default Setting;

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaDatabase, FaUsers, FaSignOutAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Bk_End_SRVR } from "../../configs/conf";

// ✅ Define Props Interface
interface SettingProps {
  logout: () => void;
}

const Setting: React.FC<SettingProps> = ({ logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBackup = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("لم يتم العثور على رمز المصادقة. الرجاء تسجيل الدخول.");
        return;
      }

      const response = await axios.get(`${Bk_End_SRVR}:5000/api/backup`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Important for file download
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "backup.sql"); // ✅ Set filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Backup failed:", error);
      alert("فشل النسخ الاحتياطي! تأكد من تشغيل السيرفر والمحاولة مرة أخرى.");
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      {/* Title */}
      <h1 className="mb-4 text-center fw-bold">الإعدادات</h1>

      {/* Home Button */}
      <button
        className="btn btn-outline-dark position-fixed top-0 start-0 m-3 d-flex align-items-center  shadow-lg p-2"
        onClick={() => navigate("/dashboard")}
        style={{ width: "45px", height: "45px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <FaHome size={20} />
      </button>


      {/* Options */}
      <div className="d-flex flex-column gap-3">
        {/* Backup Data Button */}
        <button className="btn btn-warning d-flex align-items-center px-4 py-2 shadow" onClick={handleBackup}>
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
      <button onClick={handleLogout} className="btn btn-danger btn-sm position-fixed bottom-0 end-0 m-3 d-flex align-items-center shadow" style={{ width: "auto", whiteSpace: "nowrap" }}>
        <FaSignOutAlt className="me-1" />
        <span>تسجيل الخروج</span>
      </button>


    </div>
  );
};

export default Setting;

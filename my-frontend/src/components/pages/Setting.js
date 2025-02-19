import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaDatabase, FaUsers, FaSignOutAlt } from "react-icons/fa";
import "../../assets/css/Setting.css"; // Import the CSS file

const Setting = ({logout}) => {
  const navigate = useNavigate();
 
    const handleLogout = () => {
      logout();
      navigate("/");
    };

  return (
    <div className="settings-container">
      {/* Title Section */}
      <div className="title">
        <h1>الإعدادات</h1>
      </div>

      {/* Home Button */}
      <button className="icon-button home-btn" onClick={() => navigate("/dashboard")}>
        <FaHome className="icon" />
      </button>

      {/* Settings Options */}
      <div className="options">
        {/* Backup Data Button */}
        <button className="option-btn">
          <FaDatabase className="icon" />
          <span>نسخ احتياطي</span>
        </button>

        {/* Users Button */}
        <button className="option-btn" onClick={() => navigate("/users")}>
          <FaUsers className="icon" />
          <span>المستخدمين</span>
        </button>
      </div>

      {/* Logout Button */}
         <button onClick={handleLogout} className="small-btn">
                <FaSignOutAlt className="icon" />
              </button>
    </div>
  );
};

export default Setting;

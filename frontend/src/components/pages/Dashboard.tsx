import React from "react";
import { useNavigate } from "react-router-dom";

import { 
  FaBoxOpen, FaFileInvoice, FaClipboardList, FaMapMarkerAlt, FaUsers, 
  FaCog, FaSignOutAlt, FaWarehouse, FaTruck, FaBoxes, FaClipboardCheck, FaCubes 
} from "react-icons/fa";

import "../../assets/css/Dashboard.css";

// ✅ Define Props Interface
interface DashboardProps {
  logout: () => void;
  userRole: string;  // Accept user role
}

const Dashboard: React.FC<DashboardProps> = ({ logout, userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <h2>مرحبا بك في لوحة التحكم</h2>
      <p>🛠️ دور المستخدم: {userRole}</p> {/* Display user role for debugging */}

      {/* Left Sidebar */}
      <div className="sidebar left">
        <button onClick={() => navigate("/etat-stock")} className="dashboard-btn etat-stock">
          <FaBoxOpen className="icon" /> حالة المخزون
        </button>
        <button onClick={() => navigate("/bon-entrees")} className="dashboard-btn bon-entrees">
          <FaFileInvoice className="icon" /> وصول الاستلام
        </button>
        <button onClick={() => navigate("/bon-sorties")} className="dashboard-btn bon-sorties">
          <FaClipboardList className="icon" /> وصول الإخراج
        </button>
        <button onClick={() => navigate("/location")} className="dashboard-btn location">
          <FaMapMarkerAlt className="icon" /> الاماكن
        </button>
        <button onClick={() => navigate("/adjustment")} className="dashboard-btn adjustment">
          <FaClipboardCheck className="icon" /> تعديل المخزون
        </button>
        <button onClick={() => navigate("/fornisseurs")} className="dashboard-btn fornisseurs">
          <FaTruck className="icon" /> الموردين
        </button>
      </div>

      {/* Right Sidebar */}
      <div className="sidebar right">
        <button onClick={() => navigate("/inventaire")} className="dashboard-btn inventaire">
          <FaClipboardList className="icon" /> الجرد
        </button>
        <button onClick={() => navigate("/services")} className="dashboard-btn services">
          <FaCog className="icon" /> المصالح
        </button>
        <button onClick={() => navigate("/employers")} className="dashboard-btn employers">
          <FaUsers className="icon" /> العمال
        </button>
        <button onClick={() => navigate("/products")} className="dashboard-btn product">
          <FaBoxes className="icon" /> المواد
        </button>
        <button onClick={() => navigate("/categories")} className="dashboard-btn category">
          <FaCubes className="icon" /> الفئات
        </button>
        <button onClick={() => navigate("/bon-retour")} className="dashboard-btn bon-retour">
          <FaWarehouse className="icon" /> وصول الارجاع
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="dashboard-bottom">
        <button onClick={handleLogout} className="small-btn">
          <FaSignOutAlt className="icon" />
        </button>
        <button onClick={() => navigate("/settings")} className="small-btn">
          <FaCog className="icon" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

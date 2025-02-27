import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen, FaFileInvoice, FaClipboardList, FaMapMarkerAlt, FaUsers,
  FaCog, FaSignOutAlt, FaWarehouse, FaTruck, FaBoxes, FaClipboardCheck, FaCubes
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/Dashboard.css";

interface DashboardProps {
  logout: () => void;
  userRole: string;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
  className: string;
}

const Dashboard: React.FC<DashboardProps> = ({ logout, userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems: MenuItem[] = [
    { path: "/etat-stock", label: "حالة المخزون", icon: <FaBoxOpen />, roles: ["Admin", "User"], className: "etat-stock" },
    { path: "/bon-entrees", label: "وصول الاستلام", icon: <FaFileInvoice />, roles: ["Admin", "User"], className: "bon-entrees" },
    { path: "/bon-sorties", label: "وصول الإخراج", icon: <FaClipboardList />, roles: ["Admin"], className: "bon-sorties" },
    { path: "/location", label: "الاماكن", icon: <FaMapMarkerAlt />, roles: ["Admin", "User"], className: "location" },
    { path: "/adjustment", label: "تعديل المخزون", icon: <FaClipboardCheck />, roles: ["Admin"], className: "adjustment" },
    { path: "/fornisseurs", label: "الموردين", icon: <FaTruck />, roles: ["Admin"], className: "fornisseurs" },
    { path: "/inventaire", label: "الجرد", icon: <FaClipboardList />, roles: ["Admin", "User"], className: "inventaire" },
    { path: "/services", label: "المصالح", icon: <FaCog />, roles: ["Admin"], className: "services" },
    { path: "/employers", label: "العمال", icon: <FaUsers />, roles: ["Admin"], className: "employers" },
    { path: "/articles", label: "المواد", icon: <FaBoxes />, roles: ["Admin", "User"], className: "articles" },
    { path: "/categories", label: "الفئات", icon: <FaCubes />, roles: ["Admin"], className: "categories" },
    { path: "/bon-retour", label: "وصول الارجاع", icon: <FaWarehouse />, roles: ["Admin"], className: "bon-retour" },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark mb-3 px-3 d-flex justify-content-between">
        <h2 className="navbar-brand text-white">مرحبا بك في لوحة التحكم</h2>
        <span className="text-light">🛠️ دور المستخدم: {userRole}</span>
      </nav>

      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="menu-list">
            {filteredMenu.map(({ path, className, label, icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`menu-item ${className}`}
              >
                {icon} <span className="menu-text">{label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Your dashboard main content here */}
        </main>
      </div>

      {/* Footer */}
    {/* Footer */}
<footer>
  <div className="footer-buttons">
    <button onClick={handleLogout} className="btn btn-danger btn-sm">
      <FaSignOutAlt className="me-1" /> تسجيل الخروج
    </button>
    <button onClick={() => navigate("/settings")} className="btn btn-secondary btn-sm">
      <FaCog className="me-1" /> الإعدادات
    </button>
  </div>
</footer>

    </div>
  );
};

export default Dashboard;

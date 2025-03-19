import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen, FaFileInvoice, FaClipboardList, FaMapMarkerAlt, FaUsers,
  FaCog, FaWarehouse, FaTruck, FaBoxes, FaClipboardCheck, FaCubes
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/Dashboard.css";

import Navbar from "../Navbar";
import SidebarMenu from "../SidebarMenu";
import Footer from "../Footer";

interface DashboardProps {
  logout: () => void;
  userRole: string;
}

const Dashboard: React.FC<DashboardProps> = ({ logout, userRole }) => {
  const navigate = useNavigate();

  const menuItems = [
    { path: "/etat-stock", label: "حالة المخزون", icon: <FaBoxOpen />, roles: ["Admin", "User"], className: "etat-stock" },
    { path: "/bonentrees", label: "وصول الاستلام", icon: <FaFileInvoice />, roles: ["Admin", "User"], className: "bon-entrees" },
    { path: "/bonsorties", label: "وصول الإخراج", icon: <FaClipboardList />, roles: ["Admin"], className: "bon-sorties" },
    { path: "/localisations", label: "الاماكن", icon: <FaMapMarkerAlt />, roles: ["Admin", "User"], className: "location" },
    { path: "/adjustment", label: "تعديل المخزون", icon: <FaClipboardCheck />, roles: ["Admin"], className: "adjustment" },
    { path: "/fornisseurs", label: "الموردين", icon: <FaTruck />, roles: ["Admin"], className: "fornisseurs" },
    { path: "/inventaire", label: "الجرد", icon: <FaClipboardList />, roles: ["Admin", "User"], className: "inventaire" },
    { path: "/services", label: "المصالح", icon: <FaCog />, roles: ["Admin"], className: "services" },
    { path: "/employers", label: "العمال", icon: <FaUsers />, roles: ["Admin"], className: "employers" },
    { path: "/articles", label: "المواد", icon: <FaBoxes />, roles: ["Admin", "User"], className: "articles" },
    { path: "/categories", label: "الفئات", icon: <FaCubes />, roles: ["Admin"], className: "categories" },
    { path: "/bonretours", label: "وصول الارجاع", icon: <FaWarehouse />, roles: ["Admin"], className: "bon-retour" },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="dashboard-container">
      <Navbar userRole={userRole} />
      <div className="dashboard-content">
        <SidebarMenu menuItems={filteredMenu} />
        <main className="main-content">
          {/* Dashboard Content */}
        </main>
      </div>
      <Footer logout={() => { logout(); navigate("/"); }} />
    </div>
  );
};

export default Dashboard;

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen, FaFileInvoice, FaClipboardList, FaMapMarkerAlt, FaUsers,
  FaCog, FaWarehouse, FaTruck, FaBoxes, FaClipboardCheck, FaCubes
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";


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
    { path: "/etat-stock", label: "حالة المخزون", icon: <FaBoxOpen />, roles: ["Admin", "User"], className: "etat-stock", style: { backgroundColor: "#c7c8cb" } },
    { path: "/bonentrees", label: "وصول الاستلام", icon: <FaFileInvoice />, roles: ["Admin", "User"], className: "bon-entrees", style: {backgroundColor: "#7ea642"} },
    { path: "/bonsorties", label: "وصول الإخراج", icon: <FaClipboardList />, roles: ["Admin"], className: "bon-sorties", style: {backgroundColor: "#c48264"} },
    { path: "/localisations", label: "الاماكن", icon: <FaMapMarkerAlt />, roles: ["Admin", "User"], className: "location", style: {backgroundColor: "#e6b955" }},
    { path: "/adjustment", label: "تعديل المخزون", icon: <FaClipboardCheck />, roles: ["Admin"], className: "adjustment", style: {backgroundColor: "#c7c8cb"} },
    { path: "/fornisseurs", label: "الموردين", icon: <FaTruck />, roles: ["Admin"], className: "fornisseurs", style: {backgroundColor: "#7ea642"} },
    { path: "/inventaire", label: "الجرد", icon: <FaClipboardList />, roles: ["Admin", "User"], className: "inventaire", style: {backgroundColor: "#c48264"} },
    { path: "/services", label: "المصالح", icon: <FaCog />, roles: ["Admin"], className: "services", style: {backgroundColor: "#ed8759"} },
    { path: "/employers", label: "العمال", icon: <FaUsers />, roles: ["Admin"], className: "employers", style: {backgroundColor: "#999573"} },
    { path: "/articles", label: "المواد", icon: <FaBoxes />, roles: ["Admin", "User"], className: "articles", style: {backgroundColor: "#e6b955"} },
    { path: "/categories", label: "الفئات", icon: <FaCubes />, roles: ["Admin"], className: "categories", style: {backgroundColor: "#ed8759"} },
    { path: "/bonretours", label: "وصول الارجاع", icon: <FaWarehouse />, roles: ["Admin"], className: "bon-retour", style: {backgroundColor: "#ed8759"} },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      <Navbar userRole={userRole} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-lg-2 bg-light min-vh-100 p-3">
            <SidebarMenu menuItems={filteredMenu} />
          </div>
          <div className="col-md-9 col-lg-10 p-4">
          </div>
        </div>
      </div>
      <Footer logout={() => { logout(); navigate("/"); }} />
    </>
   
  );
};

export default Dashboard;

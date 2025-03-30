import React from "react";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  className: string;
  style: React.CSSProperties;
}

interface SidebarProps {
  menuItems: MenuItem[];
}

const SidebarMenu: React.FC<SidebarProps> = ({ menuItems }) => {
  const navigate = useNavigate();

  return (

<div className="d-grid gap-2">
      {menuItems.map(({ path, className, label, icon, style }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          className={`btn ${className}  text-white d-flex align-items-center justify-content-start p-3 rounded`}
          style={style} // Apply the background color
        >
         <span className="me-2">{icon}</span>
         <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default SidebarMenu;

import React from "react";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  className: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
}

const SidebarMenu: React.FC<SidebarProps> = ({ menuItems }) => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="menu-list">
        {menuItems.map(({ path, className, label, icon }) => (
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
  );
};

export default SidebarMenu;

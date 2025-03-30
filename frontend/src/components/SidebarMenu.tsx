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
      className={`btn ${className} text-white d-flex align-items-center justify-content-start p-3 shadow-sm rounded border-0`}
      style={{
        ...style,
        transition: "all 0.3s ease-in-out", // Smooth animation
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "black"; // Bootstrap gray-500 on hover
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)"; // Shadow effect
        e.currentTarget.style.transform = "scale(1.05)"; // Slight zoom effect
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = style?.backgroundColor || "";
        e.currentTarget.style.boxShadow = "none"; // Remove shadow
        e.currentTarget.style.transform = "scale(1)"; // Reset zoom
      }}
    >
      <span className="me-2">{icon}</span>
      <span>{label}</span>
    </button>
  ))}
</div>


  );
};

export default SidebarMenu;

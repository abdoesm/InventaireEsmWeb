import React from "react";

interface NavbarProps {
  userRole: string;
}

const Navbar: React.FC<NavbarProps> = ({ userRole }) => {
  return (
    <nav className="navbar navbar-dark bg-dark mb-3 px-3 d-flex justify-content-between">
      <h2 className="navbar-brand text-white">مرحبا بك في لوحة التحكم</h2>
      <span className="text-light">🛠️ دور المستخدم: {userRole}</span>
    </nav>
  );
};

export default Navbar;

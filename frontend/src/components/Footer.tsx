import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutBtn from "./common/LogoutBtn";
import SettingBtn from "./common/SettingBtn";

interface FooterProps {
  logout: () => void;
}

const Footer: React.FC<FooterProps> = ({ logout }) => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid bg-light py-2 mt-3">
      <div className="d-flex justify-content-center gap-2">
        <LogoutBtn logout={logout} />
        <SettingBtn navigate={navigate} />
      </div>
    </div>
  );
};


export default Footer;

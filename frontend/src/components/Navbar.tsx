import React from "react";
import { FaUser } from "react-icons/fa";


interface NavbarProps {
  userRole: string;
}

const Navbar: React.FC<NavbarProps> = ({ userRole }) => {


  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

      <div className="container-fluid">

        <h1 className="navbar-brand" >لوحة التحكم</h1>




        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto d-flex flex-row mt-3 mt-lg-0">
            <li className="nav-item ">
              <h1 className="nav-link  d-flex align-items-center"
                role="button" data-mdb-dropdown-init aria-expanded="false">
                <FaUser />
                {userRole}
              </h1>
            </li>
          </ul>


        </div>

      </div>


    </nav>

  );
};

export default Navbar;

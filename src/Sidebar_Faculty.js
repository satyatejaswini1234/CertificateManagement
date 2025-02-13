import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appContext } from "./App";
import "./sidebar.css";
const Sidebar_Faculty = ({ toggleView }) => {
  const navigate = useNavigate();
  const { setIsLogin } = useContext(appContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogin("notlogin");
    navigate("/");
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <header className="topbar">
      <nav className="menu">
        <div className="hamburger" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        <ul className={isMenuOpen ? "open" : ""}>
          <li onClick={() => toggleView("profile_fac")}>
            <i className="bi bi-person"></i> Home
          </li>
          <li onClick={() => toggleView("research")}>
            <i className="bi bi-search"></i> Research Profile
          </li>
          <li onClick={() => toggleView("")}>
            <i className="bi bi-search"></i> Student Data 
          </li>
          <li className="dropdown">
            <span>
              <i className="fas fa-certificate"></i> Certificates ▼
            </span>
            <div className="dropdown-menu">
              <a href="#Certificate" onClick={() => toggleView("certificate")}>
                <i className="fas fa-upload"></i> Upload Certificate
              </a>
              <a href="#Nptel" onClick={() => toggleView("nptel")}>
                <i className="fas fa-upload"></i> Upload NPTEL Certificate
              </a>
              <a
                href="#viewCertificate"
                onClick={() => toggleView("viewCertificate")}
              >
                <i className="fas fa-eye"></i> View Certificates
              </a>
            </div>
          </li>
          <li onClick={handleLogoutClick}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Sidebar_Faculty;

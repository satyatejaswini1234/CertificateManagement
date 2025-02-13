import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";
import { appContext } from "./App";

const Topbar = ({ toggleView }) => {
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
          {/* <li onClick={handleLogoutClick}>
            <a href="#home">
              <i className="fas fa-home"></i> Home
            </a>
          </li> */}
          {/* <li><a href="#home"><i className="fas fa-dashboard"></i>At a Glance</a></li>
          <li><a href="#notification"><i className="fas fa-bell"></i> Notification </a></li> */}
          <li onClick={() => toggleView("studentDetails")}>
            <a href="#profile">
              <i className="fas fa-user"></i> Home
            </a>
          </li>
          <li className="dropdown">
            <span>
              <i className="fas fa-certificate"></i> Certificates ▼
            </span>
            <div className="dropdown-menu">
              <a href="#Certificate" onClick={() => toggleView("certificate")}>
                <i className="fas fa-upload"></i> Upload Certificate
              </a>
              <a href="#Nptel" onClick={() => toggleView("nptelcertificate")}>
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
          <li>
            <a
              href="#changePassword"
              onClick={() => toggleView("changePassword")}
            >
              <i className="fas fa-lock"></i> Change Password{" "}
            </a>
          </li>
          <li>
            <a href="#ContactUs" onClick={() => toggleView("contactUs")}>
              <i className="fas fa-phone"></i> Contact Us{" "}
            </a>
          </li>
          <li onClick={handleLogoutClick}>
            <a href="#logout">
              <i className="fas fa-sign-out-alt"></i> Log Out
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Topbar;

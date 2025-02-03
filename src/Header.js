import React from "react";
import "./header.css";

function Header() {
 

  return (
    <div className="top-bar">
      {/* Logo Section */}
      <div className="logo-section">
        <img src="logo.png" alt="College Logo" className="college-logo" />
      </div>

      {/* Title Section */}
      <div className="title-section">
        <h1>Shri Vishnu Engineering College for Women</h1>
        <h2>(Autonomous)</h2>
      </div>


    </div>
  );
}

export default Header;

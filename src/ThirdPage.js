import React, { useState } from "react";
import "./thirdpage.css";
import Sidebar from "./Sidebar";
import StudentDetails from "./StudentDetails";
import Certificate from "./Certificate";
import Nptel from "./Nptel";
import ViewCertificate from "./ViewCertificate";
import Header from "./Header";
import ChangePassword from "./ChangePassword";
import ContactUs from "./ContactUs";

function ThirdPage() {
  const [currentView, setCurrentView] = useState("studentDetails");
  const toggleView = (view) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "certificate":
        return <Certificate />;
      case "nptelcertificate":
        return <Nptel />;
      case "viewCertificate": // Add the ViewCertificate case
        return <ViewCertificate />;
      case "changePassword":
        return <ChangePassword />;
      case "contactUs":
        return <ContactUs/>;
      default:
        return <StudentDetails />;
    }
  };

  return (
    <div className="App">
      <Header />
      <Sidebar toggleView={toggleView} />
      <div className="content">{renderCurrentView()}</div>
    </div>
  );
}

export default ThirdPage;

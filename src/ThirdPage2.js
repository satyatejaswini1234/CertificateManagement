import React, { useState } from "react";
import "./thirdpage.css";
import Sidebar_Faculty from "./Sidebar_Faculty";
import Certificate from "./Certificate";
import Nptel from "./Nptel";
import ViewCertificate from "./ViewCertificate";
import Header from "./Header";
import ChangePassword from "./ChangePassword";
import ContactUs from "./ContactUs";
import Profile_fac from "./Profile_fac";
import ResearchProfile from "./Researchprofile";
import Nptel_Faculty from "./Nptel_Faculty";
import ViewCertificate_Faculty from "./ViewCertificate_Faculty";
import Certificate_Faculty from "./Certificate_Faculty";
import FacultyCertificateFilter from "./FacultyCertificateFilter";

function ThirdPage2() {
  const [currentView, setCurrentView] = useState("studentDetails");
  const toggleView = (view) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "certificate":
        return < Certificate_Faculty/>;
      case "nptelcertificate":
        return <Nptel/>;
      case "viewCertificate":
        return <ViewCertificate_Faculty />;
      case "changePassword":
        return <ChangePassword />;
      case "contactUs":
        return <ContactUs />;
      case "profile_fac":
        return <Profile_fac />;
      case "research":
        return <ResearchProfile />;
      case "studentData":
        return <FacultyCertificateFilter/>;
      case "nptel":
        return <Nptel_Faculty/>
      default:
        return <Profile_fac />;
    }
  };

  return (
    <div className="App">
      <Header/>
      <Sidebar_Faculty toggleView={toggleView} />
      <div className="content">{renderCurrentView()}</div>
    </div>
  );
}

export default ThirdPage2;

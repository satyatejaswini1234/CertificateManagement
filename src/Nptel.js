import React, { useState } from "react";
import axios from "axios";
import "./nptel.css";

const NptelForm = () => {
  const [nptelData, setNptelData] = useState({
    registrationNumber: "",
    courseName: "",
    duration: "",
    startDate: "",
    endDate: "",
    academicYear: "",
    consolidatedScore: "",
    credits: "",
    certificateType: "",
    issuedBy: "",
    uploadedCertificate: null,
  });

  const [statusMessage, setStatusMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNptelData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in nptelData) {
      formData.append(key, nptelData[key]);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/nptel",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setStatusMessage(response.data.message || "Data submitted successfully!");
    } catch (error) {
      setStatusMessage("Error submitting data: " + error.message);
    }
  };

  return (
    <div className="outer-container">
      <div className="form-container">
        <h2 className="form-title">NPTEL Form</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        <form onSubmit={handleFormSubmit} className="form">
          {[
            {
              label: "Registration Number",
              name: "registrationNumber",
              type: "text",
            },
            { label: "Course Name", name: "courseName", type: "text" },
            { label: "Duration (weeks)", name: "duration", type: "text" },
            { label: "Start Date", name: "startDate", type: "date" },
            { label: "End Date", name: "endDate", type: "date" },
            { label: "Academic Year", name: "academicYear", type: "text" },
            {
              label: "Consolidated Score",
              name: "consolidatedScore",
              type: "text",
            },
            { label: "Credits", name: "credits", type: "number" },
            { label: "Elite/Non-Elite", name: "certificateType", type: "text" },
            { label: "Issued By", name: "issuedBy", type: "text" },
          ].map((field, index) => (
            <div className="form-field" key={index}>
              <label htmlFor={field.name}>{field.label}:</label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                value={nptelData[field.name]}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}
          <div className="form-field">
            <label htmlFor="uploadedCertificate">Upload Certificate:</label>
            <input
              type="file"
              id="uploadedCertificate"
              name="uploadedCertificate"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="submit-btn-container">
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NptelForm;

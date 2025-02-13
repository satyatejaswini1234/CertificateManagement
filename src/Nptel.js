import React, { useState, useEffect } from "react";
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
  const [academicYears, setAcademicYears] = useState([]);

  useEffect(() => {
    const storedRegNo = localStorage.getItem("reg_no");
    if (storedRegNo) {
      setNptelData((prevState) => ({
        ...prevState,
        registrationNumber: storedRegNo,
      }));
    }

    // Generate dynamic academic years
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 4;
    const endYear = currentYear + 4;

    const years = [];
    for (let year = startYear; year < endYear; year++) {
      years.push(`${year}-${year + 1}`);
    }
    setAcademicYears(years);
  }, []);

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
      if (nptelData[key]) {
        formData.append(key, nptelData[key]);
      }
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/nptel",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setStatusMessage(response.data.message || "Data submitted successfully!");

      // Reset form after successful submission
      setNptelData({
        registrationNumber: localStorage.getItem("reg_no") || "",
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
    } catch (error) {
      console.error(
        "Error submitting data:",
        error.response?.data || error.message
      );
      setStatusMessage(
        "Error: " + (error.response?.data.message || error.message)
      );
    }
  };

  return (
    <div className="outer-container">
      <div className="form-container">
        <h2 className="form-title">NPTEL Form</h2>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        <form onSubmit={handleFormSubmit} className="form">
          {/* Registration Number (Read-only) */}
          <div className="form-field">
            <label htmlFor="registrationNumber">Registration Number:</label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={nptelData.registrationNumber}
              readOnly
            />
          </div>

          {/* Other Form Fields */}
          {[
            { label: "Course Name", name: "courseName", type: "text" },
            { label: "Duration (weeks)", name: "duration", type: "text" },
            { label: "Start Date", name: "startDate", type: "date" },
            { label: "End Date", name: "endDate", type: "date" },
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

          {/* Academic Year Dropdown */}
          <div className="form-field">
            <label htmlFor="academicYear">Academic Year:</label>
            <select
              id="academicYear"
              placeholder="Choose Academic Year"
              name="academicYear"
              value={nptelData.academicYear}
              onChange={handleInputChange}
              className="large-input"
              required
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload Field */}
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

          {/* Submit Button */}
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

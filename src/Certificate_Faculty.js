import React, { useState, useEffect } from "react";
import "./certificate.css";
import axios from "axios";

const Certificate = () => {
  const [formData, setFormData] = useState({
    registrationNumber: "",
    trainingName: "",
    organizedBy: "",
    startDate: "",
    endDate: "",
    mode: "",
    certificateFile: null,
  });
  const [statusMessage, setStatusMessage] = useState("");
  useEffect(() => {
    const storedRegNo = localStorage.getItem("reg_no");
    if (storedRegNo) {
      setFormData((prevState) => ({
        ...prevState,
        registrationNumber: storedRegNo,
      }));
    }
  }, []);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/certificates_normal_faculty",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setStatusMessage(response.data.message || "Data submitted successfully!");
      alert("Data Submitted Successfullyy");
    } catch (error) {
      setStatusMessage("Error submitting data: " + error.message);
      alert("Error Submitting Data");
    }
  };

  return (
    <div className="outer-container11">
      <div className="form-container11">
        <h2 className="form-title11">Certificate Form</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-field11">
            <p>{statusMessage}</p>
            <div className="form-field11">
              <label>Registration Number:</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="form-field11">
              <label htmlFor="trainingName">Name of the Training:</label>
              <input
                type="text"
                id="trainingName"
                name="trainingName"
                placeholder="Enter training name"
                value={formData.trainingName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field11">
              <label htmlFor="organizedBy">Organized By:</label>
              <input
                type="text"
                id="organizedBy"
                name="organizedBy"
                placeholder="Enter organizer name"
                value={formData.organizedBy}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field11">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field11">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field11">
              <label htmlFor="mode">Mode (Online/Offline):</label>
              <input
                type="text"
                id="mode"
                name="mode"
                placeholder="Enter mode (Online/Offline)"
                value={formData.mode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field11">
              <label htmlFor="certificateFile">Upload Certificate:</label>
              <input
                type="file"
                id="certificateFile"
                name="certificateFile"
                onChange={handleChange}
                required
              />
            </div>

            <div className="submit-btn-container1">
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Certificate;

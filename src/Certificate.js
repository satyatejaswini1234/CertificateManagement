import React, { useState } from 'react';
import './certificate.css';

const Certificate = () => {
  const [formData, setFormData] = useState({
    trainingName: '',
    organizedBy: '',
    startDate: '',
    endDate: '',
    mode: '',
    certificateFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
  };

  return (
    <div className="outer-container11">
      <div className="form-container11">
        <h2 className="form-title11">Certificate Form</h2>
        <form onSubmit={handleSubmit} className="form">
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
              type="text"
              id="startDate"
              name="startDate"
              placeholder="Enter start date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field11">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="text"
              id="endDate"
              name="endDate"
              placeholder="Enter end date"
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
        </form>
      </div>
    </div>
  );
};

export default Certificate;

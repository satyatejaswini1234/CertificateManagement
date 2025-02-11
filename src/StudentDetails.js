import React, { useEffect, useState } from "react";
import "./studentdetails.css";

const StudentDetails = () => {
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);

  const regNo = localStorage.getItem("reg_no");

  useEffect(() => {
    if (!regNo) {
      setError("User is not logged in");
      return;
    }

    // Fetch student details from the backend
    fetch(`http://localhost:5000/api/student/${regNo}`)
      .then((response) => response.json())
      .then((data) => {
        setStudentData(data);
      })
      .catch((error) => {
        setError("Error fetching student details");
        console.error(error);
      });
  }, [regNo]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!studentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="student-details-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <img
          src="https://cdn-icons-png.flaticon.com/512/186/186037.png" // Replace with a student girl favicon
          alt="User"
          className="welcome-image"
        />
        <div className="welcome-text">
          <h2>Welcome,</h2>
          <h3>{studentData.student_name}</h3>
        </div>
      </div>

      {/* Profile Details */}
      <div className="details-section">
        <h3>Profile</h3>
        <form>
          <div className="input-group">
            <label>Name:</label>
            <div className="placeholder-space">{studentData.student_name}</div>
          </div>
          <div className="input-group">
            <label>Register Number:</label>
            <div className="placeholder-space">{studentData.reg_no}</div>
          </div>
          <div className="input-group">
            <label>College Email Id:</label>
            <div className="placeholder-space">{studentData.college_email}</div>
          </div>
          <div className="input-group">
            <label>Personal Email Id:</label>
            <div className="placeholder-space">
              {studentData.personal_email}
            </div>
          </div>
          <div className="input-group">
            <label>Date of Birth:</label>
            <div className="placeholder-space">{studentData.college_email}</div>
          </div>
          <div className="input-group">
            <label>Academic Year:</label>
            <div className="placeholder-space">
              {studentData.admission_year}
            </div>
          </div>
          <div className="input-group">
            <label>Branch:</label>
            <div className="placeholder-space">{studentData.branch}</div>
          </div>
          <div className="input-group">
            <label>Section:</label>
            <div className="placeholder-space">{studentData.section}</div>
          </div>
          <div className="input-group">
            <label>Phone No:</label>
            <div className="placeholder-space">{studentData.student_phone}</div>
          </div>
          <div className="input-group">
            <label>Father Name:</label>
            <div className="placeholder-space">{studentData.father_name}</div>
          </div>
          <div className="input-group">
            <label>Father Phone Number:</label>
            <div className="placeholder-space">{studentData.father_phone}</div>
          </div>
          <div className="input-group">
            <label>Mother Name:</label>
            <div className="placeholder-space">{studentData.mother_name}</div>
          </div>
          <div className="input-group">
            <label>Mother Phone Number:</label>
            <div className="placeholder-space">{studentData.mother_phone}</div>
          </div>
          <div className="input-group">
            <label>Address:</label>
            <div className="placeholder-space">{studentData.address}</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentDetails;

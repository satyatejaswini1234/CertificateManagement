import React, { useEffect, useState } from "react";
import "./studentdetails.css";

const Profile_fac = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const regNo = localStorage.getItem("reg_no");

  useEffect(() => {
    if (!regNo) {
      setError("User is not logged in");
      return;
    }

    // Fetch faculty details from the backend
    fetch(`http://localhost:5000/api/faculty/${regNo}`)
      .then((response) => response.json())
      .then((data) => {
        setProfileData(data);
      })
      .catch((error) => {
        setError("Error fetching faculty details");
        console.error(error);
      });
  }, [regNo]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="student-details-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <img
          src="https://cdn-icons-png.flaticon.com/512/219/219983.png" // Replace with a faculty icon if needed
          alt="User"
          className="welcome-image"
        />
        <div className="welcome-text">
          <h2>Welcome,</h2>
          <h3>{profileData.name}</h3>
        </div>
      </div>

      {/* Profile Details */}
      <div className="details-section">
        <h3>Profile</h3>
        <form>
          <div className="input-group">
            <label>Name:</label>
            <div className="placeholder-space">{profileData.name}</div>
          </div>
          <div className="input-group">
            <label>Username:</label>
            <div className="placeholder-space">{profileData.username}</div>
          </div>
          <div className="input-group">
            <label>Qualification:</label>
            <div className="placeholder-space">{profileData.qualification}</div>
          </div>
          <div className="input-group">
            <label>Specialization:</label>
            <div className="placeholder-space">
              {profileData.specialization}
            </div>
          </div>
          <div className="input-group">
            <label>Date of Birth:</label>
            <div className="placeholder-space">{profileData.dob}</div>
          </div>
          <div className="input-group">
            <label>Experience:</label>
            <div className="placeholder-space">
              {profileData.experience} years
            </div>
          </div>
          <div className="input-group">
            <label>College Email:</label>
            <div className="placeholder-space">{profileData.college_email}</div>
          </div>
          <div className="input-group">
            <label>Personal Email:</label>
            <div className="placeholder-space">
              {profileData.personal_email}
            </div>
          </div>
          <div className="input-group">
            <label>Phone:</label>
            <div className="placeholder-space">{profileData.phone_number}</div>
          </div>
          <div className="input-group">
            <label>Address:</label>
            <div className="placeholder-space">{profileData.address}</div>
          </div>
          <div className="input-group">
            <label>Research Interests:</label>
            <div className="placeholder-space">
              {profileData.research_interests}
            </div>
          </div>
          <div className="input-group">
            <label>Publications:</label>
            <div className="placeholder-space">{profileData.publications}</div>
          </div>
          <div className="input-group">
            <label>Awards:</label>
            <div className="placeholder-space">{profileData.awards}</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile_fac;

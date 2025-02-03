import React, { useState, useEffect } from "react";
import axios from "axios";
import "./viewcertificate.css";

const ViewCertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetching regNo from the logged-in user's session or context (e.g., localStorage, global context)
  const regNo = localStorage.getItem("reg_no"); // or use a context/global state to retrieve it

  useEffect(() => {
    if (regNo) {
      fetchCertificates();
    } else {
      setError("You are not logged in or no registration number found.");
    }
  }, [regNo]);

  const fetchCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/certificates/${regNo}`
      );
      setCertificates(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 404) {
        setError("No certificates found for this registration number.");
      } else {
        setError("There was an error fetching the certificates.");
      }
      console.error("Error fetching certificates:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container">
      <h1 className="header">Certificates</h1>

      {loading && <div className="loading">Loading certificates...</div>}

      {error && <div className="error-message">{error}</div>}

      {certificates.length > 0 && (
        <div className="certificates-grid">
          {certificates.map((cert, index) => (
            <div key={index} className="card">
              <div className="card-image">
                {cert.certificate_path.toLowerCase().endsWith(".pdf") ? (
                  <embed
                    src={`http://localhost:5000${cert.certificate_path}`}
                    type="application/pdf"
                  />
                ) : (
                  <img
                    src={`http://localhost:5000${cert.certificate_path}`}
                    alt="Certificate"
                  />
                )}
              </div>
              <div className="card-body">
                <h3 className="card-title">{cert.course_name}</h3>
                <p className="card-info">
                  <span>Academic Year:</span> {cert.academic_year}
                </p>
                <p className="card-info">
                  <span>Score:</span> {cert.consolidated_score}%
                </p>
                <p className="card-info">
                  <span>Status:</span> {cert.elite_status}
                </p>
                <p className="card-info">
                  <span>Duration:</span> {formatDate(cert.start_date)} -{" "}
                  {formatDate(cert.end_date)}
                </p>
                <a
                  href={`http://localhost:5000${cert.certificate_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-button"
                >
                  Download Certificate
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewCertificate;

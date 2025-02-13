import React, { useState, useEffect } from "react";
import axios from "axios";
import "./viewcertificate.css";

const ViewCertificate_Faculty = () => {
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState(null);

  const regNo = localStorage.getItem("reg_no");

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
        `http://localhost:5000/api/certificates_faculty/${regNo}`
      );
      setCertificates(response.data);
    } catch (err) {
      setError("Error fetching certificates. Please try again later.");
      console.error("Error fetching certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownload = async (certificatePath, fileName, index) => {
    try {
      setDownloadingIndex(index);
      const fileUrl = `http://localhost:5000${certificatePath}`;

      // Fetch the file as a blob
      const response = await axios.get(fileUrl, {
        responseType: "blob",
        headers: {
          Accept: "application/pdf,image/*",
        },
      });

      // Create blob URL
      const blob = new Blob([response.data], {
        type: certificatePath.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg",
      });
      const blobUrl = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${fileName}${certificatePath.substring(
        certificatePath.lastIndexOf(".")
      )}`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      setError("Failed to download certificate. Please try again.");
    } finally {
      setDownloadingIndex(null);
    }
  };
  const renderCertificateCard = (cert, index, type) => {
    const isNPTEL = type === "nptel";
    return (
      <div key={index} className="card">
        <div className="card-image">
          {cert.certificate_path.toLowerCase().endsWith(".pdf") ? (
            <embed
              src={`http://localhost:5000${cert.certificate_path}`}
              type="application/pdf"
              className="pdf-preview"
            />
          ) : (
            <img
              src={`http://localhost:5000${cert.certificate_path}`}
              alt="Certificate"
              className="image-preview"
            />
          )}
        </div>
        <div className="card-body">
          <h3 className="card-title">
            {isNPTEL ? cert.course_name : cert.training_name}
          </h3>
          {isNPTEL ? (
            <>
              <p className="card-info">
                <span>Academic Year:</span> {cert.academic_year}
              </p>
              <p className="card-info">
                <span>Score:</span> {cert.consolidated_score}%
              </p>
              <p className="card-info">
                <span>Status:</span> {cert.elite_status}
              </p>
            </>
          ) : (
            <>
              <p className="card-info">
                <span>Organized By:</span> {cert.organized_by}
              </p>
              <p className="card-info">
                <span>Mode:</span> {cert.mode}
              </p>
            </>
          )}
          <p className="card-info">
            <span>Duration:</span> {formatDate(cert.start_date)} -{" "}
            {formatDate(cert.end_date)}
          </p>
          <button
            className={`card-button ${
              downloadingIndex === index ? "downloading" : ""
            }`}
            onClick={() =>
              handleDownload(
                cert.certificate_path,
                isNPTEL ? cert.course_name : cert.training_name,
                index
              )
            }
            disabled={downloadingIndex === index}
          >
            {downloadingIndex === index
              ? "Downloading..."
              : "Download Certificate"}
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="container">
      <h1 className="header">NPTEL CERTIFICATES</h1>

      {loading && <div className="loading">Loading certificates...</div>}

      {error && <div className="error-message">{error}</div>}

      {certificates.nptelCertificates?.length > 0 ? (
        <div className="certificates-grid">
          {certificates.nptelCertificates.map((cert, index) =>
            renderCertificateCard(cert, index, "nptel")
          )}
        </div>
      ) : (
        <div className="no-certificates">No NPTEL certificates found</div>
      )}
      <br></br>
      <br></br>
      <h1 className="header">TRAINING CERTIFICATES</h1>
      {certificates.normalCertificates?.length > 0 ? (
        <div className="certificates-grid">
          {certificates.normalCertificates.map((cert, index) =>
            renderCertificateCard(cert, index + 100, "training")
          )}
        </div>
      ) : (
        <div className="no-certificates">No Training certificates found</div>
      )}
    </div>
  );
};

export default ViewCertificate_Faculty;

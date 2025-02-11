import React, { useState } from "react";

const ResearchProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  const faculty = {
    name: "Dr. Arjun",
    qualification: "PhD in Computer Science",
    specialization: "Artificial Intelligence",
    designation: "Professor",
    department: "Computer Science",
    researchInterests: ["Machine Learning", "Natural Language Processing"],
    publications: [
      {
        title: "AI in Education",
        journal: "International Journal of AI Research",
        year: 2022,
        link: "#",
      },
      {
        title: "Blockchain for Secure Systems",
        journal: "Journal of Secure Computing",
        year: 2023,
        link: "#",
      },
    ],
    awards: ["Best Researcher Award, 2020", "Top AI Researcher Award, 2019"],
    researchFiles: [
      {
        title: "AI in Education",
        description:
          "This paper explores AI in education and its potential impacts.",
        filePath: "/path/to/Researchpaper1.pdf",
      },
      {
        title: "Blockchain in Education",
        description:
          "Exploring blockchain's role in securing educational data.",
        filePath: "/path/to/Researchpaper2.pdf",
      },
    ],
  };

  const handleFileClick = (file) => {
    setCurrentFile(file);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentFile(null);
  };

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      maxWidth: "800px",
      margin: "auto",
      padding: "20px",
      background: "linear-gradient(135deg, #d8a7ca, #b39ddb, #f3e5f5)",
      borderRadius: "10px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
    },
    headerTitle: {
      fontSize: "2.5rem",
      color: "black",
      textDecoration: "underline",
      textDecorationColor: "#5f27cd",
    },
    headerSub: {
      fontSize: "1.2rem",
      color: "black",
    },
    section: {
      marginBottom: "20px",
      backgroundColor: "#f3e5f5",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    sectionTitle: {
      color: "#343a40",
      borderBottom: "2px solid #5f27cd",
      display: "inline-block",
      paddingBottom: "5px",
      marginBottom: "10px",
    },
    card: {
      backgroundColor: "#b39ddb",
      border: "1px solid #d1c4e9",
      borderRadius: "8px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      padding: "15px",
      transition: "transform 0.2s ease, box-shadow 0.3s ease",
    },
    cardHover: {
      transform: "scale(1.03)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    },
    button: {
      display: "inline-block",
      textDecoration: "none",
      padding: "10px 15px",
      backgroundColor: "#16a34a",
      color: "#fff",
      borderRadius: "5px",
      fontWeight: "bold",
      marginTop: "10px",
      cursor: "pointer",
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    modalContent: {
      backgroundColor: "#d8a7ca",
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "90%",
      maxHeight: "90%",
      overflow: "auto",
    },
    closeButton: {
      position: "absolute",
      top: "10px",
      right: "10px",
      fontSize: "1.5rem",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>{faculty.name}</h1>
        <p style={styles.headerSub}>
          {faculty.qualification} - {faculty.specialization}
        </p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Research Interests</h2>
        <ul>
          {faculty.researchInterests.map((interest, index) => (
            <li key={index}>{interest}</li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Publications</h2>
        <ul>
          {faculty.publications.map((pub, index) => (
            <li key={index}>
              <strong>{pub.title}</strong> - {pub.journal} ({pub.year}){" "}
              <a href={pub.link} target="_blank" rel="noopener noreferrer">
                [View]
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Awards</h2>
        <ul>
          {faculty.awards.map((award, index) => (
            <li key={index}>{award}</li>
          ))}
        </ul>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {faculty.researchFiles.map((file, index) => (
          <div style={styles.card} key={index}>
            <h3>{file.title}</h3>
            <p>{file.description}</p>
            <button style={styles.button} onClick={() => handleFileClick(file)}>
              Preview File
            </button>
            <a
              href={file.filePath}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.button, backgroundColor: "#15803d" }}
            >
              Download File
            </a>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <span style={styles.closeButton} onClick={closeModal}>
              &times;
            </span>
            {currentFile.filePath.endsWith(".pdf") ? (
              <embed
                src={currentFile.filePath}
                width="100%"
                height="600px"
                type="application/pdf"
              />
            ) : (
              <img
                src={currentFile.filePath}
                alt={currentFile.title}
                style={{ width: "100%", height: "auto" }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchProfile;

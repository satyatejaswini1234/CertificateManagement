import React from "react";

const ContactUs = () => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "90%",
      padding: "20px",
      animation: "fadeIn 1s ease-in-out",
    },
    card: {
      background: "#ffffff",
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
      borderRadius: "16px",
      padding: "30px",
      width: "50%",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      transition: "transform 0.3s ease-in-out",
    },
    cardHover: {
      transform: "scale(1.05)",
    },
    heading: {
      marginBottom: "15px",
      color: "#004080",
      fontSize: "28px",
    },
    text: {
      margin: "10px 0",
      color: "#333333",
      fontSize: "16px",
    },
    link: {
      color: "#007acc",
      textDecoration: "none",
      fontWeight: "bold",
    },
    linkHover: {
      textDecoration: "underline",
    },
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = styles.cardHover.transform;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "none";
  };

  return (
    <div style={styles.container}>
      <div
        style={styles.card}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <h2 style={styles.heading}>Contact Us</h2>
        <p style={styles.text}>For further queries, please contact:</p>
        <p style={styles.text}>
          <strong>Phone:</strong> 9876543210
        </p>
        <p style={styles.text}>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:22b01a4265@svecw.edu.in"
            style={styles.link}
            onMouseOver={(e) =>
              (e.target.style.textDecoration = styles.linkHover.textDecoration)
            }
            onMouseOut={(e) =>
              (e.target.style.textDecoration = styles.link.textDecoration)
            }
          >
            22b01a4265@svecw.edu.in
          </a>
        </p>
      </div>
    </div>
  );
};

export default ContactUs;

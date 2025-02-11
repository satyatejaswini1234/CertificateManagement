import { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const regNo = localStorage.getItem("reg_no");
  const existingPassword = localStorage.getItem("student_password");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (oldPassword !== existingPassword) {
      alert("Old password does not match the current password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/update-password",
        {
          regNo,
          existingPassword,
          newPassword,
        }
      );

      if (response.status === 200) {
        setStatusMessage("Password changed successfully.");
      } else {
        setStatusMessage("Failed to change the password.");
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("An error occurred while changing the password.");
    }
  };

  const styles = {
    outerContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "80%",
      fontFamily: "Arial, sans-serif",
      animation: "fadeIn 1s ease-in-out",
    },
    formContainer: {
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      width: "50%",
      border: "1px solid #dcdcdc",
    },
    formTitle: {
      marginBottom: "20px",
      textAlign: "center",
      fontSize: "1.6rem",
      fontWeight: "bold",
      color: "#003366",
      borderBottom: "2px solid #003366",
      paddingBottom: "10px",
    },
    formField: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
      color: "#333333",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "0.95rem",
      outline: "none",
      transition: "border-color 0.3s ease",
    },
    inputFocus: {
      borderColor: "#003366",
    },
    submitBtnContainer: {
      textAlign: "center",
    },
    submitBtn: {
      padding: "12px 30px",
      backgroundColor: "#003366",
      color: "#ffffff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "1rem",
      transition: "background-color 0.3s ease",
    },
    submitBtnHover: {
      backgroundColor: "#002244",
    },
    statusMessage: {
      color: "green",
      textAlign: "center",
      marginBottom: "15px",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>Change Password</h2>
        {statusMessage && <p style={styles.statusMessage}>{statusMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formField}>
            <label htmlFor="oldPassword" style={styles.label}>
              Old Password:
            </label>
            <input
              type="password"
              id="oldPassword"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              style={styles.input}
              onFocus={(e) =>
                (e.target.style.borderColor = styles.inputFocus.borderColor)
              }
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
          </div>
          <div style={styles.formField}>
            <label htmlFor="newPassword" style={styles.label}>
              New Password:
            </label>
            <input
              type="password"
              id="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={styles.input}
              onFocus={(e) =>
                (e.target.style.borderColor = styles.inputFocus.borderColor)
              }
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
          </div>
          <div style={styles.formField}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
              onFocus={(e) =>
                (e.target.style.borderColor = styles.inputFocus.borderColor)
              }
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
          </div>
          <div style={styles.submitBtnContainer}>
            <button
              type="submit"
              style={styles.submitBtn}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor =
                  styles.submitBtnHover.backgroundColor)
              }
              onMouseOut={(e) =>
                (e.target.style.backgroundColor =
                  styles.submitBtn.backgroundColor)
              }
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

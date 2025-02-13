import React, { useState, useEffect } from "react";
import axios from "axios";

const styles = {
  tabButtons: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
  },
  tabButton: {
    padding: "12px 24px",
    backgroundColor: "#F3F4F6",
    color: "#4B5563",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#E5E7EB",
    },
  },
  activeTabButton: {
    backgroundColor: "#4338CA",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#3730A3",
    },
  },
  pageContainer: {
    padding: "24px",
    width: "60%",
    background: "linear-gradient(to bottom right, #EEF2FF, #C7D2FE)",
  },
  mainContainer: {
    Width: "100%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    animation: "fadeIn 1s ease-in-out",
  },
  filterSection: {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    color: "#4338CA",
    marginBottom: "24px",
    paddingBottom: "10px",
    borderBottom: "2px solid #4338CA",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginBottom: "24px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#4338CA",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.3s ease",
    "&:focus": {
      borderColor: "#4338CA",
      boxShadow: "0 0 0 2px rgba(67, 56, 202, 0.2)",
    },
  },
  select: {
    width: "100%",
    padding: "12px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.3s ease",
    "&:focus": {
      borderColor: "#4338CA",
      boxShadow: "0 0 0 2px rgba(67, 56, 202, 0.2)",
    },
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
    marginTop: "24px",
  },
  primaryButton: {
    padding: "12px 24px",
    backgroundColor: "#4338CA",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#3730A3",
    },
  },
  secondaryButton: {
    padding: "12px 24px",
    backgroundColor: "#10B981",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#059669",
    },
    "&:disabled": {
      backgroundColor: "#9CA3AF",
      cursor: "not-allowed",
    },
  },
  clearButton: {
    padding: "12px 24px",
    backgroundColor: "#F3F4F6",
    color: "#4B5563",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#E5E7EB",
    },
  },
  certificatesSection: {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  errorMessage: {
    color: "#EF4444",
    padding: "16px",
    backgroundColor: "#FEF2F2",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  certificatesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  certificateCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: "12px",
  },
  cardText: {
    fontSize: "0.9rem",
    color: "#6B7280",
    marginBottom: "8px",
  },
  certificatePreview: {
    width: "100%",
    height: "256px",
    objectFit: "contain",
    marginTop: "16px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  noPreview: {
    textAlign: "center",
    padding: "16px",
    backgroundColor: "#EEF2FF",
    color: "#4338CA",
    borderRadius: "8px",
    marginTop: "16px",
  },
  noResults: {
    textAlign: "center",
    padding: "24px",
    backgroundColor: "#EEF2FF",
    color: "#4338CA",
    borderRadius: "8px",
  },
};
const FacultyCertificates = () => {
  const [activeTab, setActiveTab] = useState("NPTEL");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [nptelFilters, setNptelFilters] = useState({
    section: "",
    courseName: "",
    academicYear: "",
    branch: "",
    issuedBy: "",
    certificateType: "",
  });
  const [trainingFilters, setTrainingFilters] = useState({
    branch: "",
    section: "",
    trainingName: "",
    organisedBy: "",
    mode: "",
  });
  const [nptelOptions, setNptelOptions] = useState({
    sections: [],
    courseNames: [],
    academicYears: [],
    branches: [],
    issuedBy: [],
  });

  const [trainingOptions, setTrainingOptions] = useState({
    branches: [],
    sections: [],
    trainingNames: [],
    organisedBy: [],
    modes: [],
  });
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  useEffect(() => {
    fetchDropdownOptions();
  }, [activeTab]);
  const fetchDropdownOptions = async () => {
    try {
      const endpoint =
        activeTab === "NPTEL"
          ? "/api/nptel_distinct_values"
          : "/api/training_distinct_values";

      const response = await axios.get(`http://localhost:5000${endpoint}`);

      if (activeTab === "NPTEL") {
        setNptelOptions(response.data);
      } else {
        setTrainingOptions(response.data);
      }
    } catch (error) {
      setError("Failed to fetch filter options. Please refresh the page.");
    }
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setCertificates([]); // Clear certificates when switching tabs
    setError(""); // Clear any existing errors
  };
  const handleNptelFilterChange = (name, value) => {
    setNptelFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTrainingFilterChange = (name, value) => {
    setTrainingFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchCertificates = () => {
    setError("");
    const endpoint =
      activeTab === "NPTEL"
        ? "/api/nptel_certificates"
        : "/api/training_certificates";
    const filters = activeTab === "NPTEL" ? nptelFilters : trainingFilters;

    axios
      .get(`http://localhost:5000${endpoint}`, { params: filters })
      .then((res) => setCertificates(res.data))
      .catch(() => setError("Failed to fetch certificates. Please try again."));
  };

  const downloadExcel = async () => {
    try {
      setDownloading(true);
      const endpoint =
        activeTab === "NPTEL"
          ? "/api/nptel_certificates/download"
          : "/api/training_certificates/download";
      const filters = activeTab === "NPTEL" ? nptelFilters : trainingFilters;

      const response = await axios.get(`http://localhost:5000${endpoint}`, {
        params: filters,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${activeTab.toLowerCase()}_certificates.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download Excel file.");
    } finally {
      setDownloading(false);
    }
  };

  const renderNptelFilters = () => (
    <div style={styles.filterGrid}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Academic Year</label>
        <select
          value={nptelFilters.academicYear}
          onChange={(e) =>
            handleNptelFilterChange("academicYear", e.target.value)
          }
          style={styles.select}
        >
          <option value="">All Academic Years</option>
          {nptelOptions.academicYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Branch</label>
        <select
          value={nptelFilters.branch}
          onChange={(e) => handleNptelFilterChange("branch", e.target.value)}
          style={styles.select}
        >
          <option value="">All Branches</option>
          {nptelOptions.branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Section</label>
        <select
          value={nptelFilters.section}
          onChange={(e) => handleNptelFilterChange("section", e.target.value)}
          style={styles.select}
        >
          <option value="">All Sections</option>
          {nptelOptions.sections.map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Course Name</label>
        <select
          value={nptelFilters.courseName}
          onChange={(e) =>
            handleNptelFilterChange("courseName", e.target.value)
          }
          style={styles.select}
        >
          <option value="">All Courses</option>
          {nptelOptions.courseNames.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Issued By</label>
        <select
          value={nptelFilters.issuedBy}
          onChange={(e) => handleNptelFilterChange("issuedBy", e.target.value)}
          style={styles.select}
        >
          <option value="">All Issuers</option>
          {nptelOptions.issuedBy.map((issuer) => (
            <option key={issuer} value={issuer}>
              {issuer}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Certificate Type</label>
        <select
          value={nptelFilters.certificateType}
          onChange={(e) =>
            handleNptelFilterChange("certificateType", e.target.value)
          }
          style={styles.select}
        >
          <option value="">All Types</option>
          <option value="Elite">Elite</option>
          <option value="Non-elite">Non-elite</option>
        </select>
      </div>
    </div>
  );

  const renderTrainingFilters = () => (
    <div style={styles.filterGrid}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Branch</label>
        <select
          value={trainingFilters.branch}
          onChange={(e) => handleTrainingFilterChange("branch", e.target.value)}
          style={styles.select}
        >
          <option value="">All Branches</option>
          {trainingOptions.branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Section</label>
        <select
          value={trainingFilters.section}
          onChange={(e) =>
            handleTrainingFilterChange("section", e.target.value)
          }
          style={styles.select}
        >
          <option value="">All Sections</option>
          {trainingOptions.sections.map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Training Name</label>
        <select
          value={trainingFilters.trainingName}
          onChange={(e) =>
            handleTrainingFilterChange("trainingName", e.target.value)
          }
          style={styles.select}
        >
          <option value="">All Trainings</option>
          {trainingOptions.trainingNames.map((training) => (
            <option key={training} value={training}>
              {training}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Organised By</label>
        <select
          value={trainingFilters.organisedBy}
          onChange={(e) =>
            handleTrainingFilterChange("organisedBy", e.target.value)
          }
          style={styles.select}
        >
          <option value="">All Organisers</option>
          {trainingOptions.organisedBy.map((organiser) => (
            <option key={organiser} value={organiser}>
              {organiser}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Mode</label>
        <select
          value={trainingFilters.mode}
          onChange={(e) => handleTrainingFilterChange("mode", e.target.value)}
          style={styles.select}
        >
          <option value="">All Modes</option>
          {trainingOptions.modes.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContainer}>
        <div style={styles.tabButtons}>
          <button
            onClick={() => handleTabChange("NPTEL")}
            style={{
              ...styles.tabButton,
              ...(activeTab === "NPTEL" ? styles.activeTabButton : {}),
            }}
          >
            NPTEL Certifications
          </button>
          <button
            onClick={() => handleTabChange("Training")}
            style={{
              ...styles.tabButton,
              ...(activeTab === "Training" ? styles.activeTabButton : {}),
            }}
          >
            Training Certifications
          </button>
        </div>

        <div style={styles.filterSection}>
          <h2 style={styles.sectionTitle}>Filter {activeTab} Certificates</h2>
          {activeTab === "NPTEL"
            ? renderNptelFilters()
            : renderTrainingFilters()}
          <div style={styles.buttonGroup}>
            <button onClick={fetchCertificates} style={styles.primaryButton}>
              Apply Filters
            </button>
            <button
              onClick={downloadExcel}
              disabled={downloading}
              style={styles.secondaryButton}
            >
              {downloading ? "Downloading..." : "Download Excel"}
            </button>
            <button
              onClick={() => {
                if (activeTab === "NPTEL") {
                  setNptelFilters({
                    section: "",
                    courseName: "",
                    academicYear: "",
                    branch: "",
                    issuedBy: "",
                    certificateType: "",
                  });
                } else {
                  setTrainingFilters({
                    branch: "",
                    section: "",
                    trainingName: "",
                    organisedBy: "",
                    mode: "",
                  });
                }
              }}
              style={styles.clearButton}
            >
              Clear
            </button>
          </div>
        </div>

        <div style={styles.certificatesSection}>
          <h2 style={styles.sectionTitle}>{activeTab} Certificates</h2>
          {error && <div style={styles.errorMessage}>{error}</div>}
          {certificates.length > 0 ? (
            <div style={styles.certificatesGrid}>
              {certificates.map((item, index) => (
                <div key={index} style={styles.certificateCard}>
                  <h3 style={styles.cardTitle}>
                    {activeTab === "NPTEL"
                      ? item.course_name
                      : item.training_name}
                  </h3>
                  {activeTab === "NPTEL" ? (
                    <>
                      <p style={styles.cardText}>
                        Academic Year: {item.academic_year}
                      </p>
                      <p style={styles.cardText}>Branch: {item.branch}</p>
                      <p style={styles.cardText}>Issued By: {item.issued_by}</p>
                      <p style={styles.cardText}>Type: {item.elite_status}</p>
                    </>
                  ) : (
                    <>
                      <p style={styles.cardText}>
                        Organised By: {item.organized_by}
                      </p>
                      <p style={styles.cardText}>Mode: {item.mode}</p>
                    </>
                  )}

                  {item.certificate_path ? (
                    item.certificate_path.endsWith(".pdf") ? (
                      <embed
                        src={`http://localhost:5000${item.certificate_path}`}
                        type="application/pdf"
                        style={styles.certificatePreview}
                      />
                    ) : (
                      <img
                        src={`http://localhost:5000${item.certificate_path}`}
                        alt="Certificate"
                        style={styles.certificatePreview}
                      />
                    )
                  ) : (
                    <div style={styles.noPreview}>No preview available</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.noResults}>No certificates found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyCertificates;

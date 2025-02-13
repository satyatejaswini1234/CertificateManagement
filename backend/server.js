const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql");
const XLSX = require("xlsx");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(
  "/certificates",
  express.static(path.join(__dirname, "web/certificates"))
);

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "satya",
  password: "1234",
  database: "svecw",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Database");
});
app.get("/api/student/:regNo", (req, res) => {
  const { regNo } = req.params;

  // Query to fetch student details from the `profile` table
  const query = `
    SELECT 
      student_name, reg_no, college_email, personal_email,date_of_birth,admission_year, branch, 
      section, student_phone,father_name,father_phone,mother_name,mother_phone,address
    FROM profile 
    WHERE reg_no = ?`;

  db.query(query, [regNo], (err, results) => {
    if (err) {
      console.error("Error fetching student details:", err);
      return res
        .status(500)
        .json({ message: "Error fetching student details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(results[0]);
  });
});
app.get("/api/faculty/:regNo", (req, res) => {
  const { regNo } = req.params;
  const query = "SELECT * FROM faculty_profile WHERE username = ?";

  db.query(query, [regNo], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json(results[0]);
  });
});
// Login API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (username.length === 4) {
    const facultyQuery = `SELECT username, password FROM faculty_profile WHERE username = ?`;
    db.query(facultyQuery, [username], (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (results.length === 0)
        return res.status(404).json({ message: "Faculty not found" });

      const faculty = results[0];
      if (password !== faculty.password)
        return res.status(401).json({ message: "Invalid password" });

      return res
        .status(200)
        .json({ message: "Login successful", role: "faculty", username });
    });
  } else {
    const studentQuery = `SELECT reg_no, student_password FROM profile WHERE reg_no = ?`;
    db.query(studentQuery, [username], (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (results.length === 0)
        return res.status(404).json({ message: "Student not found" });

      const student = results[0];
      if (password !== student.student_password)
        return res.status(401).json({ message: "Invalid password" });

      return res
        .status(200)
        .json({ message: "Login successful", role: "student", username });
    });
  }
});

// API to Update Password
app.post("/api/update-password", (req, res) => {
  console.log(req.body);
  const { regNo, existingPassword, newPassword } = req.body;

  if (!regNo || !existingPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const verifyQuery = `SELECT student_password FROM profile WHERE reg_no = ?`;
  db.query(verifyQuery, [regNo], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentPassword = results[0].student_password;

    if (existingPassword !== currentPassword) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const updateQuery = `UPDATE profile SET student_password = ? WHERE reg_no = ?`;
    db.query(updateQuery, [newPassword, regNo], (err) => {
      if (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({ message: "Failed to update password" });
      }

      res.status(200).json({ message: "Password updated successfully!" });
    });
  });
});

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "web/certificates");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Keep original file extension
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// File filter to allow only PDFs and images
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF and image files are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// API to Add NPTEL Data
app.post("/api/nptel", upload.single("uploadedCertificate"), (req, res) => {
  const {
    registrationNumber, // Get username from request
    courseName,
    duration,
    startDate,
    endDate,
    academicYear,
    consolidatedScore,
    credits,
    certificateType,
    issuedBy,
  } = req.body;

  if (!registrationNumber) {
    return res.status(400).json({ message: "Registration number is required" });
  }

  if (!courseName) {
    return res.status(400).json({ message: "Course name is required" });
  }

  const certificatePath = `/certificates/${req.file.filename}`;

  const query = `
    INSERT INTO nptel (
      reg_no, course_name, duration, start_date, end_date,
      academic_year, consolidated_score, credits, elite_status,
      issued_by, certificate_path
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    registrationNumber,
    courseName,
    duration,
    startDate,
    endDate,
    academicYear,
    consolidatedScore,
    credits,
    certificateType,
    issuedBy,
    certificatePath,
  ];

  db.query(query, values, (err) => {
    if (err) {
      console.error("Error inserting NPTEL data:", err.message);
      res.status(500).json({ message: "Failed to insert NPTEL data" });
    } else {
      res.status(200).json({ message: "NPTEL data added successfully!" });
    }
  });
});

app.post(
  "/api/nptel_faculty",
  upload.single("uploadedCertificate"),
  (req, res) => {
    const {
      registrationNumber,
      courseName,
      duration,
      startDate,
      endDate,
      academicYear,
      consolidatedScore,
      credits,
      certificateType,
      issuedBy,
    } = req.body;

    if (!courseName) {
      return res.status(400).json({ message: "Course name is required" });
    }

    const certificatePath = `/certificates/${req.file.filename}`;

    const query = `
    INSERT INTO faculty_nptel (
      username, course_name, duration, start_date, end_date,
      academic_year, consolidated_score, credits, elite_status,
      issued_by, certificate_path
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const values = [
      registrationNumber,
      courseName,
      duration,
      startDate,
      endDate,
      academicYear,
      consolidatedScore,
      credits,
      certificateType,
      issuedBy,
      certificatePath,
    ];

    db.query(query, values, (err) => {
      if (err) {
        console.error("Error inserting NPTEL data:", err.message);
        res.status(500).json({ message: "Failed to insert NPTEL data" });
      } else {
        res.status(200).json({ message: "NPTEL data added successfully!" });
      }
    });
  }
);
app.post(
  "/api/certificates_normal_faculty",
  upload.single("certificateFile"),
  (req, res) => {
    const formData = req.body;
    const file = req.file;

    console.log("Form Data:", formData);
    console.log("Uploaded File:", file);

    if (formData && file) {
      const certificatePath = `/certificates/${req.file.filename}`;
      const {
        registrationNumber,
        trainingName,
        organizedBy,
        startDate,
        endDate,
        mode,
      } = formData;

      if (
        !registrationNumber ||
        !trainingName ||
        !organizedBy ||
        !startDate ||
        !endDate ||
        !mode ||
        !certificatePath
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const sql =
        "INSERT INTO certificates_normal_faculty (username,training_name, organized_by, start_date, end_date, mode, certificate_path) VALUES (?,?, ?, ?, ?, ?, ?)";
      db.query(
        sql,
        [
          registrationNumber,
          trainingName,
          organizedBy,
          startDate,
          endDate,
          mode,
          certificatePath,
        ],
        (err, result) => {
          if (err) {
            console.error(
              "Database insert error:",
              err.message,
              err.sqlMessage
            );
            return res
              .status(500)
              .json({ message: "Database error", error: err.sqlMessage });
          }
          res.status(200).json({
            message: "Certificate submitted successfully!",
            certificatePath: certificatePath,
          });
        }
      );
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  }
);
app.post(
  "/api/certificates_normal",
  upload.single("certificateFile"),
  (req, res) => {
    const formData = req.body;
    const file = req.file;

    console.log("Form Data:", formData);
    console.log("Uploaded File:", file);

    if (formData && file) {
      const certificatePath = `/certificates/${req.file.filename}`;
      const {
        registrationNumber,
        trainingName,
        organizedBy,
        startDate,
        endDate,
        mode,
      } = formData;

      if (
        !registrationNumber ||
        !trainingName ||
        !organizedBy ||
        !startDate ||
        !endDate ||
        !mode ||
        !certificatePath
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const sql =
        "INSERT INTO certificates_normal (username,training_name, organized_by, start_date, end_date, mode, certificate_path) VALUES (?,?, ?, ?, ?, ?, ?)";
      db.query(
        sql,
        [
          registrationNumber,
          trainingName,
          organizedBy,
          startDate,
          endDate,
          mode,
          certificatePath,
        ],
        (err, result) => {
          if (err) {
            console.error(
              "Database insert error:",
              err.message,
              err.sqlMessage
            );
            return res
              .status(500)
              .json({ message: "Database error", error: err.sqlMessage });
          }
          res.status(200).json({
            message: "Certificate submitted successfully!",
            certificatePath: certificatePath,
          });
        }
      );
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  }
);
// API endpoint to fetch NPTEL and Normal Certificates
app.get("/api/nptel_certificates", (req, res) => {
  const { section, courseName } = req.query;

  let query = `
    SELECT nptel.*, profile.section 
    FROM nptel 
    JOIN profile ON nptel.reg_no = profile.reg_no
    WHERE 1=1
  `;

  let queryParams = [];

  if (section) {
    query += " AND profile.section = ?";
    queryParams.push(section);
  }
  if (courseName) {
    query += " AND nptel.course_name = ?";
    queryParams.push(courseName);
  }

  // Add logging to debug the query
  console.log("Query:", query);
  console.log("Parameters:", queryParams);

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching NPTEL certificates:", err);
      return res.status(500).json({ message: "Database error" });
    }
    // Log the results
    console.log("Query results:", results);
    res.status(200).json(results);
  });
});
app.get("/api/nptel_certificates/download", (req, res) => {
  const { section, courseName } = req.query;
  const baseUrl = "http://localhost:5000";

  let query = `
    SELECT 
      nptel.reg_no as 'Registration Number',
      profile.student_name as 'Student Name',
      profile.branch as 'Branch',
      profile.section as 'Section',
      nptel.course_name as 'Course Name',
      nptel.duration as 'Duration',
      nptel.academic_year as 'Academic Year',
      nptel.consolidated_score as 'Consolidated Score',
      nptel.elite_status as 'Elite/Non-Elite',
      nptel.issued_by as 'Issued By',
      nptel.certificate_path as 'Certificate Path'
    FROM nptel
    JOIN profile ON nptel.reg_no = profile.reg_no
    WHERE 1=1
  `;

  let queryParams = [];

  if (section) {
    query += " AND profile.section = ?";
    queryParams.push(section);
  }
  if (courseName) {
    query += " AND nptel.course_name = ?";
    queryParams.push(courseName);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching data for excel:", err);
      return res.status(500).json({ message: "Database error" });
    }

    try {
      // Add full URL to certificate paths
      const modifiedResults = results.map(row => ({
        ...row,
        'Certificate Path': `${baseUrl}${row['Certificate Path']}`
      }));

      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Convert the modified results to worksheet
      const worksheet = XLSX.utils.json_to_sheet(modifiedResults);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "NPTEL Certificates");

      // Generate buffer
      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      // Set headers for excel download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=nptel_certificates.xlsx"
      );

      // Send the file
      res.send(excelBuffer);
    } catch (error) {
      console.error("Error generating excel:", error);
      res.status(500).json({ message: "Error generating excel file" });
    }
  });
});
app.get("/api/certificates/:regNo", (req, res) => {
  const regNo = req.params.regNo;

  const nptelQuery = "SELECT * FROM nptel WHERE reg_no = ?";
  const normalQuery = "SELECT * FROM certificates_normal WHERE username = ?";

  db.query(nptelQuery, [regNo], (err, nptelResults) => {
    if (err) {
      console.error("Error fetching NPTEL certificates:", err);
      return res
        .status(500)
        .json({ message: "Database error fetching NPTEL certificates" });
    }

    db.query(normalQuery, [regNo], (err, normalResults) => {
      if (err) {
        console.error("Error fetching Normal certificates:", err);
        return res
          .status(500)
          .json({ message: "Database error fetching Normal certificates" });
      }

      res.status(200).json({
        nptelCertificates: nptelResults,
        normalCertificates: normalResults,
      });
    });
  });
});
app.get("/api/certificates_faculty/:regNo", (req, res) => {
  const regNo = req.params.regNo;

  const nptelQuery = "SELECT * FROM faculty_nptel WHERE username = ?";
  const normalQuery =
    "SELECT * FROM certificates_normal_faculty WHERE username = ?";

  db.query(nptelQuery, [regNo], (err, nptelResults) => {
    if (err) {
      console.error("Error fetching NPTEL certificates:", err);
      return res
        .status(500)
        .json({ message: "Database error fetching NPTEL certificates" });
    }

    db.query(normalQuery, [regNo], (err, normalResults) => {
      if (err) {
        console.error("Error fetching Normal certificates:", err);
        return res
          .status(500)
          .json({ message: "Database error fetching Normal certificates" });
      }

      res.status(200).json({
        nptelCertificates: nptelResults,
        normalCertificates: normalResults,
      });
    });
  });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

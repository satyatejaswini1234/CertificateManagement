const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql");

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
/// API to Get Student Details by Registration Number
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

// Login API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // Query to check if the username exists in the `profile` table
  const query = `SELECT reg_no FROM profile WHERE reg_no = ?`;
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error querying database:", err.message);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password (static password: "svecw2022" for all users)
    if (password !== "svecw2022") {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful" });
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

// API to Get Certificates by Registration Number
app.get("/api/certificates/:regNo", (req, res) => {
  const { regNo } = req.params;

  const query = `
    SELECT 
      certificate_path,
      course_name,
      academic_year,
      consolidated_score,
      elite_status,
      start_date,
      end_date
    FROM nptel 
    WHERE reg_no = ?
    ORDER BY start_date DESC
  `;

  db.query(query, [regNo], (err, results) => {
    if (err) {
      console.error("Error fetching certificates:", err);
      return res.status(500).json({ message: "Error fetching certificates" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No certificates found" });
    }

    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

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
app.get("/api/training_distinct_values", (req, res) => {
  let query = `
    SELECT DISTINCT p.branch AS branch, NULL AS section, NULL AS trainingName, NULL AS organisedBy, NULL AS mode FROM profile p
    UNION
    SELECT NULL AS branch, p.section AS section, NULL AS trainingName, NULL AS organisedBy, NULL AS mode FROM profile p
    UNION
    SELECT NULL AS branch, NULL AS section, cn.training_name AS trainingName, NULL AS organisedBy, NULL AS mode FROM certificates_normal cn
    UNION
    SELECT NULL AS branch, NULL AS section, NULL AS trainingName, cn.organized_by AS organisedBy, NULL AS mode FROM certificates_normal cn
    UNION
    SELECT NULL AS branch, NULL AS section, NULL AS trainingName, NULL AS organisedBy, cn.mode AS mode FROM certificates_normal cn
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching distinct values:", err);
      return res.status(500).json({ message: "Database error" });
    }

    console.log("Training Distinct Values:", results);

    const response = {
      branches: [],
      sections: [],
      trainingNames: [],
      organisedBy: [],
      modes: [],
    };

    results.forEach((row) => {
      if (row.branch) response.branches.push(row.branch);
      if (row.section) response.sections.push(row.section);
      if (row.trainingName) response.trainingNames.push(row.trainingName);
      if (row.organisedBy) response.organisedBy.push(row.organisedBy);
      if (row.mode) response.modes.push(row.mode);
    });

    console.log("Formatted Training Response:", response);
    res.status(200).json(response);
  });
});


app.get("/api/nptel_distinct_values", (req, res) => {
  let query = `
    SELECT DISTINCT p.section AS section, NULL AS courseName, NULL AS academicYear, NULL AS branch, NULL AS issuedBy FROM profile p
    UNION
    SELECT NULL AS section, n.course_name AS courseName, NULL AS academicYear, NULL AS branch, NULL AS issuedBy FROM nptel n
    UNION
    SELECT NULL AS section, NULL AS courseName, n.academic_year AS academicYear, NULL AS branch, NULL AS issuedBy FROM nptel n
    UNION
    SELECT NULL AS section, NULL AS courseName, NULL AS academicYear, p.branch AS branch, NULL AS issuedBy FROM profile p
    UNION
    SELECT NULL AS section, NULL AS courseName, NULL AS academicYear, NULL AS branch, n.issued_by AS issuedBy FROM nptel n
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching distinct values:", err);
      return res.status(500).json({ message: "Database error" });
    }

    console.log("NPTEL Distinct Values:", results);

    const response = {
      sections: [],
      courseNames: [],
      academicYears: [],
      branches: [],
      issuedBy: [],
    };

    results.forEach((row) => {
      if (row.section) response.sections.push(row.section);
      if (row.courseName) response.courseNames.push(row.courseName);
      if (row.academicYear) response.academicYears.push(row.academicYear);
      if (row.branch) response.branches.push(row.branch);
      if (row.issuedBy) response.issuedBy.push(row.issuedBy);
    });

    console.log("Formatted NPTEL Response:", response);
    res.status(200).json(response);
  });
});


app.get("/api/nptel_certificates", (req, res) => {
  const {
    section,
    courseName,
    academicYear,
    branch,
    issuedBy,
    certificateType,
  } = req.query;

  let query = `
    SELECT nptel.*, profile.section, profile.branch
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

  if (academicYear) {
    query += " AND nptel.academic_year = ?";
    queryParams.push(academicYear);
  }

  if (branch) {
    query += " AND profile.branch = ?";
    queryParams.push(branch);
  }

  if (issuedBy) {
    query += " AND nptel.issued_by = ?";
    queryParams.push(issuedBy);
  }

  if (certificateType) {
    query += " AND nptel.elite_status = ?";
    queryParams.push(certificateType);
  }

  console.log("Query:", query);
  console.log("Parameters:", queryParams);

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching NPTEL certificates:", err);
      return res.status(500).json({ message: "Database error" });
    }
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
      const modifiedResults = results.map((row) => ({
        ...row,
        "Certificate Path": `${baseUrl}${row["Certificate Path"]}`,
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
// Training certificates route
app.get("/api/training_certificates", (req, res) => {
  const { branch, section, trainingName, organizedBy, mode } = req.query;

  let query = `
    SELECT 
      cn.*,
      p.reg_no,
      p.branch,
      p.section,
      CONCAT('${process.env.BASE_URL}', cn.certificate_path) AS full_certificate_path
    FROM certificates_normal cn
    JOIN profile p ON cn.username = p.reg_no
    WHERE 1=1
  `;

  let queryParams = [];

  if (trainingName) {
    query += " AND cn.training_name = ?";
    queryParams.push(trainingName);
  }
  if (organizedBy) {
    query += " AND cn.organized_by = ?";
    queryParams.push(organizedBy);
  }
  if (mode) {
    query += " AND cn.mode = ?";
    queryParams.push(mode);
  }
  if (branch) {
    query += " AND p.branch = ?";
    queryParams.push(branch);
  }
  if (section) {
    query += " AND p.section = ?";
    queryParams.push(section);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching training certificates:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
});

app.get("/api/training_certificates/download", (req, res) => {
  const { section, courseName } = req.query;
  const baseUrl = "http://localhost:5000";

  let query = `
    SELECT 
      profile.reg_no as 'Registration Number',
      profile.student_name as 'Student Name',
      profile.branch as 'Branch',
      profile.section as 'Section',
    certificates_normal.training_name as 'Course Name',
      certificates_normal.organized_by as 'Organised By',
      certificates_normal.certificate_path as 'Certificate Path'
    FROM certificates_normal
    JOIN profile ON certificates_normal.username = profile.reg_no
    WHERE 1=1
  `;

  let queryParams = [];

  if (section) {
    query += " AND profile.section = ?";
    queryParams.push(section);
  }
  if (courseName) {
    query += " AND certificates_normal.training_name = ?";
    queryParams.push(courseName);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching data for Excel:", err);
      return res.status(500).json({ message: "Database error" });
    }

    try {
      // Add full URL to certificate paths
      const modifiedResults = results.map((row) => ({
        ...row,
        "Certificate Path": `${baseUrl}${row["Certificate Path"]}`,
      }));

      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Convert results to worksheet
      const worksheet = XLSX.utils.json_to_sheet(modifiedResults);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Training Certificates"
      );

      // Generate buffer
      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      // Set headers for Excel download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=training_certificates.xlsx"
      );

      // Send file
      res.send(excelBuffer);
    } catch (error) {
      console.error("Error generating Excel:", error);
      res.status(500).json({ message: "Error generating Excel file" });
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

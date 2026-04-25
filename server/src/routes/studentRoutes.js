import express from "express";
import multer from "multer";
import Student from "../models/studentModel.js";
import PlacementRecord from "../models/PlacementRecord.js";
import { uploadStudents } from "../controllers/studentController.js";
import * as XLSX from "xlsx";
import Result from "../models/Result.js";
import User from "../models/userModels.js";

const router = express.Router();

/* ================= Multer Setup ================= */

const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ================= GET STUDENTS ================= */

router.get("/", async (req, res) => {
  try {
    const { department, year, batch, search } = req.query;

    let filter = {};

    if (department) filter.department = department;
    if (year) filter.year = Number(year);
    if (batch) filter.batch = batch;

    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: "i" } },
        { registerNo: { $regex: search, $options: "i" } }
      ];
    }

    const students = await Student.find(filter).sort({ createdAt: -1 });

    res.json({
      status: "SUCCESS",
      data: students,
      count: students.length
    });

  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch students"
    });
  }
});

/* ================= GET DEPARTMENTS ================= */

router.get("/departments", async (req, res) => {
  try {

    const departments = await Student.distinct("department");

    res.json({
      status: "SUCCESS",
      data: departments
    });

  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch departments"
    });
  }
});

/* ================= GET BATCHES ================= */

router.get("/batches", async (req, res) => {
  try {

    const batches = await Student.distinct("batch");

    res.json({
      status: "SUCCESS",
      data: batches
    });

  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch batches"
    });
  }
});

/* ================= UPLOAD EXCEL ================= */

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Get department, year, batch from form data (sent from dropdown)
    const { department: formDepartment, year: formYear, batch: formBatch } = req.body;
    
    // Pass form data to the controller
    req.formDepartment = formDepartment;
    req.formYear = formYear;
    req.formBatch = formBatch;
    
    // Call the controller function
    await uploadStudents(req, res);
  } catch (error) {
    console.error("Upload route error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Upload failed"
    });
  }
});

/* ================= DELETE STUDENT ================= */

router.delete("/:id", async (req, res) => {
  try {

    await Student.findByIdAndDelete(req.params.id);

    res.json({
      status: "SUCCESS",
      message: "Student deleted"
    });

  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Failed to delete student"
    });
  }
});

/* ================= UPDATE PLACEMENT ================= */

router.put("/:id/placement", async (req, res) => {
  try {
    const { companyName, companyName2, packageOffered, packageOffered2, location, jobRole, placementDate, isPlaced } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        isPlaced: isPlaced,
        companyName: companyName || "",
        companyName2: companyName2 || "",
        packageOffered: packageOffered || "",
        packageOffered2: packageOffered2 || "",
        location: location || "",
        jobRole: jobRole || "",
        placementDate: placementDate || null
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        status: "ERROR",
        message: "Student not found"
      });
    }

    res.json({
      status: "SUCCESS",
      data: student,
      message: "Placement updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Failed to update placement"
    });
  }
});

/* ================= GET PLACED STUDENTS ================= */

router.get("/placed", async (req, res) => {
  try {
    const { department, batch, year } = req.query;

    let filter = { isPlaced: true };

    if (department) filter.department = department;
    if (batch) filter.batch = batch;
    if (year) filter.year = Number(year);

    // Fetch from PlacementRecord collection (separate from Student)
    const placedStudents = await PlacementRecord.find(filter).sort({ placementDate: -1 });

    res.json({
      status: "SUCCESS",
      data: placedStudents,
      count: placedStudents.length
    });

  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch placed students"
    });
  }
});

export default router;

/* ================= GET LEADERBOARD ================= */

router.get("/leaderboard", async (req, res) => {
  try {
    // Get top 3 placed students per department by package from PlacementRecord
    const topPerDepartment = await PlacementRecord.find({ isPlaced: true, packageOffered: { $ne: "" } })
      .sort({ packageOffered: -1 })
      .lean();
    
    // Group by department and get top 3 from each
    const departmentGroups = {};
    topPerDepartment.forEach(student => {
      const dept = student.department || "Other";
      if (!departmentGroups[dept]) {
        departmentGroups[dept] = [];
      }
      if (departmentGroups[dept].length < 3) {
        departmentGroups[dept].push({
          userName: student.userName,
          registerNo: student.registerNo,
          department: student.department,
          packageOffered: student.packageOffered,
          companyName: student.companyName
        });
      }
    });

    // Get top 5 from each department (for whole department view)
    const topPerDepartmentFive = await PlacementRecord.find({ isPlaced: true, packageOffered: { $ne: "" } })
      .sort({ packageOffered: -1 })
      .lean();
    
    const departmentGroupsFive = {};
    topPerDepartmentFive.forEach(student => {
      const dept = student.department || "Other";
      if (!departmentGroupsFive[dept]) {
        departmentGroupsFive[dept] = [];
      }
      if (departmentGroupsFive[dept].length < 5) {
        departmentGroupsFive[dept].push({
          userName: student.userName,
          registerNo: student.registerNo,
          department: student.department,
          packageOffered: student.packageOffered,
          companyName: student.companyName
        });
      }
    });

    // Get top 3 highest package placed students overall from PlacementRecord
    const topThreeOverall = await PlacementRecord.find({ isPlaced: true, packageOffered: { $ne: "" } })
      .sort({ packageOffered: -1 })
      .limit(3)
      .lean();

    const topThreeHighPackage = topThreeOverall.map(student => ({
      userName: student.userName,
      registerNo: student.registerNo,
      department: student.department,
      packageOffered: student.packageOffered,
      companyName: student.companyName
    }));

    // Get quiz rankings - Aggregate all quiz scores per student
    // First, get all results
    const allQuizResults = await Result.find({})
      .lean();
    
    // Get unique userIds to fetch fresh data from User collection
    const userIds = [...new Set(allQuizResults.map(r => r.userId?.toString()).filter(Boolean))];
    
    // Fetch user data from User collection to get current year and department
    const usersMap = {};
    if (userIds.length > 0) {
      const users = await User.find({ _id: { $in: userIds } })
        .select('userName registerNo department year')
        .lean();
      
      users.forEach(user => {
        usersMap[user._id.toString()] = user;
      });
    }
    
    // Also try to get data from Student collection as fallback
    const studentDataMap = {};
    const registerNos = [...new Set(allQuizResults.map(r => r.registerNo).filter(Boolean))];
    if (registerNos.length > 0) {
      const students = await Student.find({ registerNo: { $in: registerNos } })
        .select('registerNo department year')
        .lean();
      
      students.forEach(student => {
        studentDataMap[student.registerNo] = student;
      });
    }
    
    // Group by userId and aggregate scores
    const userQuizAggregate = {};
    allQuizResults.forEach(result => {
      const userId = result.userId?.toString();
      if (!userId) return;
      
      // Get fresh user data
      const userData = usersMap[userId] || {};
      const studentData = studentDataMap[result.registerNo] || {};
      
      // Prioritize: User collection > Student collection > Result stored data
      const name = userData.userName || studentData.userName || result.studentName || "";
      const regNo = userData.registerNo || studentData.registerNo || result.registerNo || "";
      const dept = userData.department || studentData.department || result.department || "";
      const yr = userData.year !== undefined ? userData.year : (studentData.year !== undefined ? studentData.year : (result.year || null));
      
      if (!userQuizAggregate[userId]) {
        userQuizAggregate[userId] = {
          userId: userId,
          studentName: name,
          registerNo: regNo,
          department: dept,
          year: yr,
          totalScore: 0,
          totalTotal: 0,
          quizCount: 0
        };
      }
      userQuizAggregate[userId].totalScore += result.score || 0;
      userQuizAggregate[userId].totalTotal += result.total || 0;
      userQuizAggregate[userId].quizCount += 1;
    });
    
    console.log("Aggregated users:", Object.keys(userQuizAggregate).length);
    
    // Calculate percentage and sort by total score - include ALL students
    const aggregatedRankers = Object.values(userQuizAggregate)
      .map(user => ({
        ...user,
        percentage: user.totalTotal > 0 ? ((user.totalScore / user.totalTotal) * 100) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage || b.totalScore - a.totalScore);
    
    // Get top 5 quiz rankers overall (with aggregated scores)
    const topFiveQuizRankers = aggregatedRankers.slice(0, 5).map(user => ({
      studentName: user.studentName,
      registerNo: user.registerNo,
      department: user.department,
      year: user.year,
      score: user.totalScore,
      total: user.totalTotal,
      quizCount: user.quizCount,
      percentage: Math.round(user.percentage * 100) / 100
    }));
    
    // Get top 5 quiz rankers per department (with aggregated scores)
    const quizPerDepartment = {};
    aggregatedRankers.forEach(user => {
      const dept = user.department || "Other";
      if (!quizPerDepartment[dept]) {
        quizPerDepartment[dept] = [];
      }
      if (quizPerDepartment[dept].length < 5) {
        quizPerDepartment[dept].push({
          studentName: user.studentName,
          registerNo: user.registerNo,
          department: user.department,
          year: user.year,
          score: user.totalScore,
          total: user.totalTotal,
          quizCount: user.quizCount,
          percentage: Math.round(user.percentage * 100) / 100
        });
      }
    });

    res.json({
      status: "SUCCESS",
      data: {
        topThreePerDepartment: departmentGroups,
        topFivePerDepartment: departmentGroupsFive,
        topThreeHighPackage,
        topFiveQuizRankers,
        topFiveQuizPerDepartment: quizPerDepartment
      }
    });

  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch leaderboard data"
    });
  }
});

/* ================= DOWNLOAD PLACEMENT EXCEL ================= */

router.get("/placed/download", async (req, res) => {
  try {
    const { department, batch, year } = req.query;

    // Get only placed students from PlacementRecord collection (same as /placed endpoint)
    let filter = { isPlaced: true };

    if (department) filter.department = department;
    if (batch) filter.batch = batch;
    if (year) filter.year = Number(year);

    const placedStudents = await PlacementRecord.find(filter).sort({ placementDate: -1 }).lean();

    // Create Excel data - if students exist, include their data
    let excelData;
    
    if (placedStudents && placedStudents.length > 0) {
      // Populate with existing student data
      excelData = placedStudents.map((student, index) => ({
        "S.No": index + 1,
        "Student Name": student.userName || "",
        "Register No": student.registerNo || "",
        "Email": student.email || "",
        "Department": student.department || "",
        "Year": student.year || "",
        "Batch": student.batch || "",
        "Is Placed": student.isPlaced ? "Yes" : "No",
        "Company Name 1": student.companyName || "",
        "Company Name 2": student.companyName2 || "",
        "Package(company1)": student.packageOffered || "",
        "Package(company2)": student.packageOffered2 || "",
        "Job Role 1": student.jobRole || "",
        "Job Role 2": student.jobRole2 || "",
        "Location": student.location || "",
        "Placement Date": student.placementDate ? new Date(student.placementDate).toLocaleDateString() : ""
      }));
    } else {
      // No students found - create empty template
      excelData = [
        {
          "S.No": "",
          "Student Name": "",
          "Register No": "",
          "Email": "",
          "Department": "",
          "Year": "",
          "Batch": "",
          "Is Placed": "",
          "Company Name 1": "",
          "Company Name 2": "",
          "Package(company1)": "",
          "Package(company2)": "",
          "Job Role 1": "",
          "Job Role 2": "",
          "Location": "",
          "Placement Date": ""
        }
      ];
    }

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    ws["!cols"] = [
      { wch: 5 },   // S.No
      { wch: 20 },  // Student Name
      { wch: 15 },  // Register No
      { wch: 25 },  // Email
      { wch: 30 },  // Department
      { wch: 8 },   // Year
      { wch: 12 },  // Batch
      { wch: 10 },  // Is Placed
      { wch: 20 },  // Company Name 1
      { wch: 20 },  // Company Name 2
      { wch: 15 },  // Package(company1)
      { wch: 15 },  // Package(company2)
      { wch: 20 },  // Job Role 1
      { wch: 20 },  // Job Role 2
      { wch: 20 },  // Location
      { wch: 15 }   // Placement Date
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Placements");

    // Generate buffer
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    // Set response headers
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=placement_details.xlsx");

    res.send(buffer);

  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Failed to download placement data"
    });
  }
});

/* ================= UPLOAD PLACEMENT EXCEL ================= */

router.post("/placed/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "ERROR",
        message: "Please upload an Excel file"
      });
    }

    // Read the Excel file
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (!data || data.length === 0) {
      return res.status(400).json({
        status: "ERROR",
        message: "Excel file is empty"
      });
    }

    let updatedCount = 0;
    let notFoundCount = 0;

    // Process each row - save to PlacementRecord collection
    for (const row of data) {
      const registerNo = row["Register No"] || row["registerNo"];
      
      if (!registerNo) {
        notFoundCount++;
        continue;
      }

      // Parse date
      let placementDateVal = null;
      if (row["Placement Date"]) {
        const parsedDate = new Date(row["Placement Date"]);
        if (!isNaN(parsedDate.getTime())) {
          placementDateVal = parsedDate;
        }
      }

      // Create/update placement record with EXACT data from Excel
      const recordData = {
        registerNo: String(registerNo),
        userName: row["Student Name"] || row["studentName"] || row["Name"] || "",
        email: row["Email"] || row["email"] || "",
        department: row["Department"] || row["department"] || "",
        year: row["Year"] || row["year"] || null,
        batch: row["Batch"] || row["batch"] || "",
        isPlaced: true,
        companyName: row["Company Name 1"] || row["Company Name1"] || row["Company 1"] || "",
        companyName2: row["Company Name 2"] || row["Company Name2"] || row["Company 2"] || "",
        packageOffered: row["Package(company1)"] || row["Package(Company 1)"] || row["Package 1"] || "",
        packageOffered2: row["Package(company2)"] || row["Package(Company 2)"] || row["Package 2"] || "",
        jobRole: row["Job Role 1"] || row["JobRole 1"] || row["Job Role"] || "",
        jobRole2: row["Job Role 2"] || row["JobRole 2"] || "",
        location: row["Location"] || "",
        placementDate: placementDateVal
      };

      // Use upsert to create or update the record
      await PlacementRecord.findOneAndUpdate(
        { registerNo: String(registerNo) },
        recordData,
        { upsert: true, new: true }
      );
      updatedCount++;
    }

    res.json({
      status: "SUCCESS",
      message: "Placement data uploaded successfully",
      data: {
        updated: updatedCount,
        notFound: notFoundCount
      }
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Failed to upload placement data"
    });
  }
});
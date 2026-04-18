import xlsx from "xlsx";
import bcrypt from "bcryptjs";
import Student from "../models/studentModel.js";
import User from "../models/userModels.js";

export const uploadStudents = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        status: "ERROR",
        message: "No file uploaded"
      });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const studentsData = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

    let added = 0;
    let updated = 0;
    let errors = [];

    for (const row of studentsData) {

      try {

        console.log("Processing row:", row);
        console.log("Department from Excel:", row.department || row.Department);
        
        // Handle both lowercase and uppercase column names from Excel
        // Use Excel value if available, otherwise fall back to form data from dropdown
        const deptValue = row.department || row.Department || req.formDepartment || "";
        const yearValue = row.year || row.Year || req.formYear || "";
        const batchValue = row.batch || row.Batch || req.formBatch || "";
        
        const student = {
          userName: row.userName || row.Name || row.studentName || "",
          registerNo: row.registerNo || row.RegisterNo || row['Register No'] || row.registerNumber || "",
          email: row.email || row.Email || "",
          mobileNo: row.mobileNo || row.MobileNo || row.mobile || row.Mobile || "",
          department: deptValue,
          year: typeof yearValue === 'number' ? yearValue : (yearValue ? parseInt(yearValue) : null),
          batch: batchValue
        };

        const existing = await Student.findOne({
          registerNo: student.registerNo
        });

        if (existing) {

          await Student.updateOne(
            { registerNo: student.registerNo },
            { $set: student }
          );

          // Also update user in User collection if exists
          await User.updateOne(
            { registerNo: student.registerNo, role: "STUDENT" },
            { 
              $set: {
                userName: student.userName,
                email: student.email,
                department: student.department,
                year: student.year,
                batch: student.batch
              }
            }
          );

          updated++;

        } else {

          await Student.create(student);

          // Also create user in User collection for login
          // Default password is the register number (student should change it)
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(student.registerNo, salt);
          await User.findOneAndUpdate(
            { registerNo: student.registerNo },
            {
              userName: student.userName,
              registerNo: student.registerNo,
              email: student.email,
              password: hashedPassword, // Default password is register number (hashed)
              role: "STUDENT",
              department: student.department,
              year: student.year,
              batch: student.batch,
              mobileNo: student.mobileNo
            },
            { upsert: true }
          );

          added++;

        }

      } catch (err) {

        errors.push({
          registerNo: row.registerNo,
          error: err.message
        });

      }

    }

    res.status(200).json({
      status: "SUCCESS",
      data: {
        added,
        updated,
        errors
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      status: "ERROR",
      message: "Upload failed"
    });

  }
};
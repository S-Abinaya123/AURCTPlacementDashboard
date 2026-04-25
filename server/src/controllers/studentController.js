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

        // Normalize values
        const regNo = String(
          row.registerNo ||
          row.RegisterNo ||
          row["Register No"] ||
          row.registerNumber ||
          ""
        ).trim();

        const email = String(row.email || row.Email || "").trim();
        const mobileNo = String(
          row.mobileNo || row.MobileNo || row.mobile || row.Mobile || ""
        ).trim();

        const deptValue =
          row.department || row.Department || req.formDepartment || "";

        const yearValue = row.year || row.Year || req.formYear || "";
        const batchValue = row.batch || row.Batch || req.formBatch || "";

        // Validate
        if (!regNo) {
          throw new Error("Register number missing");
        }

        const student = {
          userName: row.userName || row.Name || row.studentName || "",
          registerNo: regNo,
          email,
          mobileNo,
          department: deptValue,
          year:
            typeof yearValue === "number"
              ? yearValue
              : yearValue
              ? parseInt(yearValue)
              : null,
          batch: batchValue
        };

        // Check if student exists
        const existing = await Student.findOne({ registerNo: regNo });

        // Hash password once
        const hashedPassword = await bcrypt.hash(regNo, 10);

        if (existing) {
          // ✅ Update student
          await Student.updateOne(
            { registerNo: regNo },
            { $set: student }
          );

          updated++;
        } else {
          // ✅ Create student
          await Student.create(student);
          added++;
        }

        // ✅ ALWAYS ensure user exists (important fix)
        await User.updateOne(
          { registerNo: regNo, role: "STUDENT" },
          {
            $set: {
              userName: student.userName,
              email: student.email,
              department: student.department,
              year: student.year,
              batch: student.batch,
              mobileNo: student.mobileNo
            },
            $setOnInsert: {
              registerNo: regNo,
              role: "STUDENT",
              password: hashedPassword
            }
          },
          {
            upsert: true
          }
        );

      } catch (err) {
        console.error("ROW ERROR:", err.message);

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
    console.error("UPLOAD ERROR:", error);

    res.status(500).json({
      status: "ERROR",
      message: "Upload failed"
    });
  }
};
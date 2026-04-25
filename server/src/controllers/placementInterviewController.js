// import PlacementInterview from "../models/PlacementInterview.js";
// import { response } from "../utils/response.js";
// import fs from "fs";
// import { createNotification } from "./notificationController.js";
// import { saveICSFile } from "../utils/calendarUtils.js";

// // Create a new placement interview
// export const createPlacementInterview = async (req, res) => {
//   try {
//     const { companyName, role, interviewDate, description, jobLink, fileName, fileType, fileUrl, fileSize } = req.body;

//     if (!companyName || !role || !interviewDate) {
//       return res.status(400).json(response("FAILED", "Company name, role, and interview date are required"));
//     }

//     // Generate Google Calendar event link with reminders
//     const formatDate = (date) => {
//       const d = new Date(date);
//       return d.toISOString().replace(/-|:|\.\d{3}/g, "");
//     };

//     const startTime = new Date(interviewDate);
//     const endTime = new Date(interviewDate);
//     endTime.setHours(endTime.getHours() + 1);

//     let details = description || `Placement interview with ${companyName} for the role of ${role}`;
//     if (jobLink) {
//       details += `\n\nJob Link: ${jobLink}`;
//     }

//     const calendarEventParams = new URLSearchParams({
//       action: "TEMPLATE",
//       text: `Interview: ${companyName} - ${role}`,
//       dates: `${formatDate(startTime)}/${formatDate(endTime)}`,
//       details: details,
//       reminder: "email;1440", // 1 day before
//       pprop: "HOW2;2", // Reminder popup 2 hours before
//     });

//     const calendarEventLink = `https://www.google.com/calendar/render?${calendarEventParams.toString()}`;

//     const newPlacement = new PlacementInterview({
//       companyName,
//       role,
//       interviewDate,
//       description,
//       jobLink,
//       fileName,
//       fileType,
//       fileUrl,
//       fileSize,
//       uploadedBy: req.user?.id,
//       calendarEventLink,
//     });

//     await newPlacement.save();

//     // Generate ICS file for calendar (auto-added to Google Calendar)
//     let icsFileUrl = "";
//     try {
//       icsFileUrl = await saveICSFile(newPlacement);
//       newPlacement.icsFileUrl = icsFileUrl;
//       await newPlacement.save();
//       console.log("ICS file saved:", icsFileUrl);
//     } catch (icsError) {
//       console.error("Error generating ICS file:", icsError.message);
//     }

//     // Create notification for students
//     try {
//       await createNotification({
//         title: "New Job Opportunity",
//         message: `${companyName} is hiring for ${role}. Interview scheduled on ${new Date(interviewDate).toLocaleDateString()}. The interview has been automatically added to Google Calendar!`,
//         type: "JOB_POST",
//         relatedId: newPlacement._id
//       });
//     } catch (notifError) {
//       console.error("Error creating notification:", notifError);
//     }

//     res.status(201).json(response("SUCCESS", "Placement interview created successfully", newPlacement));
//   } catch (error) {
//     console.error("Create Placement Interview Error:", error);
//     res.status(500).json(response("FAILED", "Error creating placement interview"));
//   }
// };

// // Get all placement interviews
// export const getAllPlacementInterviews = async (req, res) => {
//   try {
//     console.log("GET /api/placement-interviews called");
//     const placements = await PlacementInterview.find().sort({ interviewDate: 1 });
//     console.log("Found placements:", placements.length);
//     res.json(response("SUCCESS", "Placement interviews fetched successfully", placements));
//   } catch (error) {
//     console.error("Get All Placement Interviews Error:", error);
//     res.status(500).json(response("FAILED", "Error fetching placement interviews"));
//   }
// };

// // Get placement interview by ID
// export const getPlacementInterviewById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const placement = await PlacementInterview.findById(id);

//     if (!placement) {
//       return res.status(404).json(response("FAILED", "Placement interview not found"));
//     }

//     res.json(response("SUCCESS", "Placement interview fetched successfully", placement));
//   } catch (error) {
//     console.error("Get Placement Interview By ID Error:", error);
//     res.status(500).json(response("FAILED", "Error fetching placement interview"));
//   }
// };

// // Get placement interviews by date
// export const getPlacementInterviewsByDate = async (req, res) => {
//   try {
//     const { date } = req.params;
//     const startOfDay = new Date(date);
//     startOfDay.setHours(0, 0, 0, 0);
    
//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);

//     const placements = await PlacementInterview.find({
//       interviewDate: {
//         $gte: startOfDay,
//         $lte: endOfDay,
//       },
//     }).sort({ interviewDate: 1 });

//     res.json(response("SUCCESS", "Placement interviews fetched successfully", placements));
//   } catch (error) {
//     console.error("Get Placement Interviews By Date Error:", error);
//     res.status(500).json(response("FAILED", "Error fetching placement interviews"));
//   }
// };

// // Update placement interview
// export const updatePlacementInterview = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = { ...req.body, updatedAt: new Date() };

//     const placement = await PlacementInterview.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!placement) {
//       return res.status(404).json(response("FAILED", "Placement interview not found"));
//     }

//     res.json(response("SUCCESS", "Placement interview updated successfully", placement));
//   } catch (error) {
//     console.error("Update Placement Interview Error:", error);
//     res.status(500).json(response("FAILED", "Error updating placement interview"));
//   }
// };

// // Delete placement interview
// export const deletePlacementInterview = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const placement = await PlacementInterview.findByIdAndDelete(id);

//     if (!placement) {
//       return res.status(404).json(response("FAILED", "Placement interview not found"));
//     }

//     res.json(response("SUCCESS", "Placement interview deleted successfully"));
//   } catch (error) {
//     console.error("Delete Placement Interview Error:", error);
//     res.status(500).json(response("FAILED", "Error deleting placement interview"));
//   }
// };

// // Download placement interview file
// export const downloadPlacementInterviewFile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const placement = await PlacementInterview.findById(id);

//     if (!placement) {
//       return res.status(404).json(response("FAILED", "Placement interview not found"));
//     }

//     if (!placement.fileUrl) {
//       return res.status(404).json(response("FAILED", "File not found"));
//     }

//     // If fileUrl is an external URL, redirect to it
//     if (placement.fileUrl.startsWith("http") && !placement.fileUrl.includes("data:")) {
//       return res.redirect(placement.fileUrl);
//     }

//     // If it's a base64 string, decode and send as downloadable file
//     if (placement.fileUrl.startsWith("data:")) {
//       const matches = placement.fileUrl.match(/^data:([^;]+);base64,(.+)$/);
//       if (!matches) {
//         return res.status(400).json(response("FAILED", "Invalid base64 data"));
//       }

//       const mimeType = matches[1];
//       const base64Data = matches[2];
//       const buffer = Buffer.from(base64Data, "base64");

//       // Get extension from MIME type
//       const extMap = {
//         "application/pdf": ".pdf",
//         "application/vnd.ms-excel": ".xls",
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
//         "text/csv": ".csv",
//         "image/png": ".png",
//         "image/jpeg": ".jpg",
//         "application/vnd.ms-powerpoint": ".ppt",
//         "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
//       };

//       const ext = extMap[mimeType] || extMap[placement.fileType] || "";

//       // Determine filename
//       let fileName = placement.fileName || placement.title || `document_${id}`;
//       if (ext && !fileName.includes(ext)) {
//         fileName = fileName + ext;
//       }

//       // Encode filename for RFC 5987 (UTF-8)
//       const encodedFileName = encodeURIComponent(fileName).replace(/['()]/g, escape);

//       res.setHeader("Content-Type", mimeType || placement.fileType || "application/octet-stream");
//       res.setHeader("Content-Disposition", `attachment; filename="${fileName}"; filename*=UTF-8''${encodedFileName}`);
//       return res.send(buffer);
//     }

//     // Otherwise try to serve as a file from filesystem
//     if (fs.existsSync(placement.fileUrl)) {
//       let fileName = placement.fileName || `document_${id}`;
//       const encodedFileName = encodeURIComponent(fileName).replace(/['()]/g, escape);
//       res.setHeader("Content-Disposition", `attachment; filename="${fileName}"; filename*=UTF-8''${encodedFileName}`);
//       return res.download(placement.fileUrl, fileName);
//     }

//     res.status(404).json(response("FAILED", "File not found"));
//   } catch (error) {
//     console.error("Download Placement Interview File Error:", error);
//     res.status(500).json(response("FAILED", "Error downloading file"));
//   }
// };

// // Download ICS calendar file
// export const downloadICSFile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const placement = await PlacementInterview.findById(id);

//     if (!placement) {
//       return res.status(404).json(response("FAILED", "Placement interview not found"));
//     }

//     if (!placement.icsFileUrl || !fs.existsSync(placement.icsFileUrl)) {
//       return res.status(404).json(response("FAILED", "Calendar file not found"));
//     }

//     const fileName = `${placement.companyName.replace(/\s+/g, '_')}_interview.ics`;
//     const encodedFileName = encodeURIComponent(fileName).replace(/['()]/g, escape);

//     res.setHeader("Content-Type", "text/calendar; charset=utf-8");
//     res.setHeader("Content-Disposition", `attachment; filename="${fileName}"; filename*=UTF-8''${encodedFileName}`);
//     return res.download(placement.icsFileUrl, fileName);
//   } catch (error) {
//     console.error("Download ICS File Error:", error);
//     res.status(500).json(response("FAILED", "Error downloading calendar file"));
//   }
// };


import PlacementInterview from "../models/PlacementInterview.js";
import { response } from "../utils/response.js";
// 1. REMOVED 'fs' import
import { createNotification } from "./notificationController.js";
import { getICSContent } from "../utils/calendarUtils.js";

// Create a new placement interview
export const createPlacementInterview = async (req, res) => {
  try {
    const { companyName, role, interviewDate, description, jobLink, fileName, fileType, fileUrl, fileSize } = req.body;

    if (!companyName || !role || !interviewDate) {
      return res.status(400).json(response("FAILED", "Company name, role, and interview date are required"));
    }

    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().replace(/-|:|\.\d{3}/g, "");
    };

    const startTime = new Date(interviewDate);
    const endTime = new Date(interviewDate);
    endTime.setHours(endTime.getHours() + 1);

    let details = description || `Placement interview with ${companyName} for the role of ${role}`;
    if (jobLink) { details += `\n\nJob Link: ${jobLink}`; }

    const calendarEventParams = new URLSearchParams({
      action: "TEMPLATE",
      text: `Interview: ${companyName} - ${role}`,
      dates: `${formatDate(startTime)}/${formatDate(endTime)}`,
      details: details,
    });

    const calendarEventLink = `https://www.google.com/calendar/render?${calendarEventParams.toString()}`;

    const newPlacement = new PlacementInterview({
      companyName, role, interviewDate, description, jobLink,
      fileName, fileType, fileUrl, fileSize,
      uploadedBy: req.user?.id,
      calendarEventLink,
    });

    // 2. FIXED: Generate ICS as content string, not a URL/Path
    try {
      const icsContent = getICSContent(newPlacement);
      // We store the raw string content in the DB if we want to retrieve it later without a file system
      newPlacement.icsFileUrl = icsContent; 
    } catch (icsError) {
      console.error("Error generating ICS content:", icsError.message);
    }

    await newPlacement.save();

    await createNotification({
      title: "New Job Opportunity",
      message: `${companyName} is hiring for ${role}.`,
      type: "JOB_POST",
      relatedId: newPlacement._id
    });

    res.status(201).json(response("SUCCESS", "Placement interview created successfully", newPlacement));
  } catch (error) {
    res.status(500).json(response("FAILED", "Error creating placement interview"));
  }
};

// ... getAllPlacementInterviews, getPlacementInterviewById etc remain the same ...

// Download placement interview file
export const downloadPlacementInterviewFile = async (req, res) => {
  try {
    const { id } = req.params;
    const placement = await PlacementInterview.findById(id);

    if (!placement || !placement.fileUrl) {
      return res.status(404).json(response("FAILED", "File not found"));
    }

    // 3. FIXED: Redirect for external URLs (Cloudinary/S3)
    if (placement.fileUrl.startsWith("http")) {
      return res.redirect(placement.fileUrl);
    }

    // 4. FIXED: Handle Base64 (This works on Cloudflare)
    if (placement.fileUrl.startsWith("data:")) {
      const matches = placement.fileUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        res.setHeader("Content-Type", mimeType);
        return res.send(buffer);
      }
    }

    // 5. REMOVED fs.existsSync logic. 
    // On Cloudflare, if it's not a URL or Base64, it doesn't exist.
    res.status(404).json(response("FAILED", "Local file storage is not supported on this platform"));
  } catch (error) {
    res.status(500).json(response("FAILED", "Error downloading file"));
  }
};

// Download ICS calendar file
export const downloadICSFile = async (req, res) => {
  try {
    const { id } = req.params;
    const placement = await PlacementInterview.findById(id);

    if (!placement || !placement.icsFileUrl) {
      return res.status(404).json(response("FAILED", "Calendar data not found"));
    }

    const fileName = `${placement.companyName.replace(/\s+/g, '_')}_interview.ics`;

    // 6. FIXED: Serve the ICS string directly from the DB
    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    return res.send(placement.icsFileUrl); // Send the raw string
  } catch (error) {
    res.status(500).json(response("FAILED", "Error downloading calendar file"));
  }
};
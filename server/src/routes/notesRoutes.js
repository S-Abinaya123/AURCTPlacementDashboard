import express from "express";
import Note from "../models/Note.js";
import { response } from "../utils/response.js";
import fs from "fs";
import { createNotification } from "../controllers/notificationController.js";

const router = express.Router();

/* ===== Upload Note (JSON only) ===== */
router.post("/upload", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { title, description, fileUrl, fileName, fileType, fileSize } = req.body;

    if (!title || !fileUrl) {
      return res.status(400).json({ message: "Title and fileUrl required" });
    }

    const newNote = new Note({
      title,
      description,
      fileUrl,
      fileName: fileName || null,
      fileType: fileType || null,
      fileSize: fileSize || null,
    });

    await newNote.save();

    // Create notification for students
    try {
      await createNotification({
        title: "New Note Uploaded",
        message: `New note "${title}" has been uploaded. Check it out!`,
        type: "NOTES",
        relatedId: newNote._id
      });
    } catch (notifError) {
      console.error("Error creating notification:", notifError);
    }

    res.status(201).json({
      message: "Note uploaded successfully",
      note: {
        _id: newNote._id,
        title: newNote.title,
        description: newNote.description,
        fileName: newNote.fileName,
        fileType: newNote.fileType,
        fileSize: newNote.fileSize,
        fileUrl: newNote.fileUrl,
        createdAt: newNote.createdAt,
      },
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ===== Get All Notes ===== */
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ===== Download Note ===== */
router.get("/download/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!note.fileUrl) {
      return res.status(404).json({ message: "File not found" });
    }

    // If fileUrl is an external URL, redirect to it
    if (note.fileUrl.startsWith("http") && !note.fileUrl.includes("data:")) {
      return res.redirect(note.fileUrl);
    }

    // If it's a base64 string, decode and send as downloadable file
    if (note.fileUrl.startsWith("data:")) {
      const matches = note.fileUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ message: "Invalid base64 data" });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      // Get extension from MIME type
      const extMap = {
        "application/pdf": ".pdf",
        "application/vnd.ms-excel": ".xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
        "text/csv": ".csv",
        "image/png": ".png",
        "image/jpeg": ".jpg",
        "application/vnd.ms-powerpoint": ".ppt",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
      };

      const ext = extMap[mimeType] || extMap[note.fileType] || "";

      // Determine filename: use stored name, or title with extension, or default
      let fileName = note.fileName || note.title || `document_${id}`;
      if (ext && !fileName.includes(ext)) {
        fileName = fileName + ext;
      }

      // Encode filename for RFC 5987 (UTF-8)
      const encodedFileName = encodeURIComponent(fileName).replace(/['()]/g, escape);

      res.setHeader("Content-Type", mimeType || note.fileType || "application/octet-stream");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"; filename*=UTF-8''${encodedFileName}`);
      return res.send(buffer);
    }

    // Otherwise try to serve as a file from filesystem
    if (fs.existsSync(note.fileUrl)) {
      // Use stored filename or construct from title + fileType
      let fileName = note.fileName;
      if (!fileName && note.title && note.fileType) {
        const extMap2 = {
          "application/pdf": ".pdf",
          "application/vnd.ms-excel": ".xls",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
          "text/csv": ".csv",
          "image/png": ".png",
          "image/jpeg": ".jpg",
          "application/vnd.ms-powerpoint": ".ppt",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
        };
        const ext = extMap2[note.fileType] || "";
        fileName = note.title + ext;
      }
      
      // Encode filename for RFC 5987 (UTF-8)
      const encodedFileName = encodeURIComponent(fileName).replace(/['()]/g, escape);
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"; filename*=UTF-8''${encodedFileName}`);
      res.download(note.fileUrl, fileName || note.fileName);
      return;
    }

    res.status(404).json({ message: "File not found" });
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ===== Delete Note ===== */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Delete the note from database
    await Note.findByIdAndDelete(id);

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
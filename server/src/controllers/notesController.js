import Note from "../models/Note.js";
import { response } from "../utils/response.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createNotification } from "./notificationController.js";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/notes";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Upload a new note
export const uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send(response("FAILED", "No file uploaded", null));
    }

    const { title, description } = req.body;
    const userId = req.user.userId;
    
    console.log("Upload note - User ID:", userId);
    console.log("Upload note - Title:", title);

    if (!title) {
      return res.status(400).send(response("FAILED", "Title is required", null));
    }

    const note = new Note({
      title,
      description: description || "",
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: userId,
    });

    await note.save();
    
    // Create notification for students
    try {
      await createNotification({
        title: "New Notes Uploaded",
        message: `"${title}" has been uploaded. Check it out in the Notes section!`,
        type: "NOTES",
        relatedId: note._id
      });
    } catch (notifError) {
      console.error("Error creating notification:", notifError);
    }
    
    console.log("Note saved successfully with ID:", note._id);

    res.status(201).send(
      response("SUCCESS", "Note uploaded successfully", {
        id: note._id,
        title: note.title,
        description: note.description,
        fileName: note.fileName,
        fileType: note.fileType,
        fileSize: note.fileSize,
        createdAt: note.createdAt,
      })
    );
  } catch (error) {
    console.error("Error uploading note:", error);
    res.status(500).send(response("FAILED", "Error uploading note", null));
  }
};

// Get all notes
export const getAllNotes = async (req, res) => {
  try {
    console.log("Fetching all notes...");
    const notes = await Note.find()
      .populate("uploadedBy", "userName email")
      .sort({ createdAt: -1 });
    
    console.log(`Found ${notes.length} notes`);

    const notesData = notes.map((note) => ({
      id: note._id,
      title: note.title,
      description: note.description,
      fileName: note.fileName,
      fileType: note.fileType,
      fileSize: note.fileSize,
      createdAt: note.createdAt,
      uploadedBy: note.uploadedBy?.userName || "Unknown",
    }));

    res.send(response("SUCCESS", "Notes retrieved successfully", notesData));
  } catch (error) {
    console.error("Error getting notes:", error);
    res.status(500).send(response("FAILED", "Error getting notes", null));
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).send(response("FAILED", "Note not found", null));
    }

    // Check if the user is the owner or admin
    if (note.uploadedBy.toString() !== userId && req.user.role !== "ADMIN") {
      return res
        .status(403)
        .send(response("FAILED", "Not authorized to delete this note", null));
    }

    // Delete the file from filesystem
    if (fs.existsSync(note.filePath)) {
      fs.unlinkSync(note.filePath);
    }

    await Note.findByIdAndDelete(id);

    res.send(response("SUCCESS", "Note deleted successfully", null));
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).send(response("FAILED", "Error deleting note", null));
  }
};

// Download a note file
export const downloadNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).send(response("FAILED", "Note not found", null));
    }

    if (!fs.existsSync(note.filePath)) {
      return res.status(404).send(response("FAILED", "File not found", null));
    }

    res.download(note.filePath, note.fileName);
  } catch (error) {
    console.error("Error downloading note:", error);
    res.status(500).send(response("FAILED", "Error downloading note", null));
  }
};

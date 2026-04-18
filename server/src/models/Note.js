import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "", // ✅ allow empty description
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileName: String,
    fileType: String,
    fileSize: Number,

    uploadedBy: String,
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
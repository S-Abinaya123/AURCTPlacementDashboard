import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  type: { type: String, default: "link" },
  title: { type: String, default: "" },
  url: { type: String, default: "" }
}, { _id: false });

const topicSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  resources: { type: [resourceSchema], default: [] }
}, { _id: false });

const stepSchema = new mongoose.Schema({
  level: { type: String, default: "" },
  taskId: { type: String, default: "" },
  topics: { type: [topicSchema], default: [] }
}, { _id: false });

const companyRoadmapSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    trim: true,
    default: ""
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  steps: {
    type: [stepSchema],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const CompanyRoadmap = mongoose.model("CompanyRoadmap", companyRoadmapSchema);

export default CompanyRoadmap;
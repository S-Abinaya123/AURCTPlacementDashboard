import express from "express";
import axios from "axios";
import multer from "multer";
import PizZip from "pizzip";
import Quiz from "../models/MCQModels/quizModel.js";
import { createNotification } from "../controllers/notificationController.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/* =========================
   GET ALL QUIZZES
========================= */
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching quizzes" });
  }
});

/* =========================
   GET QUIZ BY ID
========================= */
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch {
    res.status(500).json({ message: "Error fetching quiz" });
  }
});

/* =========================
   CREATE QUIZ (UPLOAD BUTTON)
========================= */
router.post("/", async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    
    // Create notification for students
    try {
      await createNotification({
        title: "New MCQ Uploaded",
        message: `New quiz "${req.body.title || 'MCQ'}" has been uploaded. Check it out!`,
        type: "MCQ",
        relatedId: quiz._id
      });
    } catch (notifError) {
      console.error("Error creating notification:", notifError);
    }
    
    res.json(quiz);
  } catch {
    res.status(500).json({ message: "Quiz creation failed" });
  }
});

/* =========================
   GENERATE MCQ (ONLY PREVIEW)
========================= */
router.post("/generate-mcq", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    // Determine type of topic
    const programmingLanguages = ["python", "java", "c", "c++", "javascript"];
    let prompt = "";

    if (programmingLanguages.includes(topic.toLowerCase())) {
      // Programming language: coding MCQs
      prompt = `
Generate 10 UNIQUE multiple choice questions strictly about ${topic} coding.
Rules:
- Include error detection, output prediction, debugging
- No unrelated theory
- Mix easy, medium, hard
- Return ONLY valid JSON (no markdown)
Format:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact correct option"
  }
]
`;
    } else if (topic.toLowerCase() === "aptitude") {
      // General aptitude: mixed topics
      prompt = `
Generate 10 UNIQUE aptitude multiple choice questions across mixed topics
(e.g., percentage, simplification, ratio, averages, time & work, probability)
Rules:
- Include easy, medium, hard questions
- Include calculations if applicable
- No GK or unrelated theory
- Return ONLY valid JSON (no markdown)
Format:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact correct option"
  }
]
`;
    } else {
      // Specific aptitude topic
      prompt = `
Generate 10 UNIQUE aptitude multiple choice questions strictly on "${topic}".
Rules:
- Include calculations if applicable
- No unrelated theory or GK
- Mix easy, medium, hard
- Return ONLY valid JSON (no markdown)
Format:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact correct option"
  }
]
`;
    }

    // Call AI API
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0].message.content.trim();
    const questions = JSON.parse(text); // parse AI output

    // ❗ Only preview, do not save
    res.json({ questions });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "MCQ generation failed" });
  }
});

/* =========================
   DELETE QUIZ
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: "Quiz deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* =========================
   EXTRACT QUESTIONS FROM FILE
========================= */
router.post("/extract-from-file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("No file in request");
      return res.status(400).json({ status: "FAILED", message: "No file uploaded" });
    }

    const file = req.file;
    console.log("File received:", file.originalname, file.mimetype, file.size, "buffer len:", file.buffer?.length);

    let fileContent = "";

    // Read file content based on type  
    if (file.mimetype === "text/plain" || file.originalname.endsWith(".txt")) {
      fileContent = file.buffer.toString("utf8");
    } else if (file.originalname.endsWith(".docx")) {
      // DOCX is ZIP with XML - simple extraction
      try {
        const zip = new PizZip(file.buffer);
        let docText = "";
        
        // Try to find document.xml or word/document.xml
        try {
          const docXml = zip.file("word/document.xml");
          if (docXml) {
            const content = docXml.asText();
            // Extract text between <w:t> tags
            const matches = content.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
            if (matches) {
              matches.forEach(match => {
                const text = match.replace(/<[^>]+>/g, "").trim();
                if (text) docText += text + " ";
              });
            }
          }
        } catch (e1) {
          console.log("First DOCX method failed:", e1.message);
          // Try other approach
          for (const filename in zip.files) {
            if (filename.includes("document.xml")) {
              const content = zip.files[filename].asText();
              const matches = content.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
              if (matches) {
                matches.forEach(match => {
                  const text = match.replace(/<[^>]+>/g, "").trim();
                  if (text) docText += text + " ";
                });
              }
              break;
            }
          }
        }
        
        if (docText.length > 20) {
          fileContent = docText.replace(/\s+/g, " ").trim().substring(0, 15000);
        } else {
          throw new Error("No text found in DOCX");
        }
      } catch (docxError) {
        console.error("DOCX extraction error:", docxError.message);
        // Use buffer directly and strip XML tags
        fileContent = file.buffer.toString("utf8")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .substring(0, 15000);
      }
    } else if (file.mimetype.includes("pdf") || file.originalname.endsWith(".pdf")) {
      // For PDF - simple approach: read as binary and extract printable text
      // Use buffer directly and clean out non-printable characters
      const buffer = file.buffer;
      
      // Convert buffer to a string by extracting only printable ASCII characters
      let result = "";
      for (let i = 0; i < buffer.length; i++) {
        const code = buffer[i];
        if (code >= 32 && code <= 126) {  // printable ASCII
          result += String.fromCharCode(code);
        } else if (code === 10 || code === 13) {  // newlines
          result += " ";
        }
      }
      
      // Clean up - remove multiple spaces and get first portion
      fileContent = result.replace(/\s+/g, " ").trim().substring(0, 20000);
    } else {
      // Try as text for other files
      fileContent = file.buffer.toString("utf8").substring(0, 15000);
    }

    console.log("File content length after processing:", fileContent.length);

    // Make content more readable - remove excessive whitespace  
    const cleanedContent = fileContent.replace(/\s+/g, " ").trim();
    console.log("Content sample (first 300 chars):", cleanedContent.substring(0, 300));

    if (!cleanedContent || cleanedContent.length < 20) {
      return res.status(400).json({ 
        status: "FAILED", 
        message: "Could not read text from file. Try using a .txt file instead of PDF." 
      });
    }

    // Check if content looks like it might have questions
    const hasQuestionMarks = /\?/.test(cleanedContent);
    const hasAns = /ans|answer/i.test(cleanedContent);
    const hasOption = /\b[a-d]\b|\b[1-4]\b/i.test(cleanedContent);
    console.log("Content analysis - has ?, has ans, has options:", hasQuestionMarks, hasAns, hasOption);

    if (!hasQuestionMarks && !hasAns && !hasOption) {
      console.log("Content doesn't appear to have MCQ format. Returning 0 questions.");
    }

    // More explicit prompt with examples - handle ALL MCQ formats
    const prompt = `
I have a document containing multiple choice questions (MCQ). Extract ALL questions you can find.

The file may have questions in ANY of these formats - recognize ALL of them:
1. Q1. What is 2+2? a) 1 b) 2 c) 3 d) 4 Ans: b
2. 1. What is capital? (1) Mumbai (2) Delhi (3) Chennai (4) Kolkata - Answer: Delhi
3. Q1) What is 2+2? A. 1 B. 2 C. 3 D. 4 Answer: B
4. 1) What is 2+2? a. 1 b. 2 c. 3 d. 4 ans: a
5. 1. What is 2+2? 1) 1 2) 2 3) 3 4) 4 Answer: 2
6. Question: What is 2+2? Options: 1) 1, 2) 2, 3) 3, 4) 4. Correct: 2

Your job is to parse the content below and extract each question with its 4 options and correct answer.

Content to extract from:
${cleanedContent.substring(0, 12000)}

Return as JSON array - ONE object per question:
[{"question": "Question text here", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": "Exact correct option"}]

IMPORTANT:
- Each question MUST have exactly 4 options in the options array  
- correctAnswer must EXACTLY match one of the options (case-sensitive)
- Include ALL questions you find
- If none found, return []

Return ONLY valid JSON array, no explanation.`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 4000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0].message.content.trim();
    console.log("AI Response length:", text.length);
    console.log("AI Response full:", text);

    let questions = [];

    try {
      // Try direct JSON parse first
      questions = JSON.parse(text);
      console.log("Parsed directly, count:", questions.length);
    } catch (e) {
      console.log("Direct parse failed, trying to find JSON array");
      // Try to find JSON array in the response
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          questions = JSON.parse(match[0]);
          console.log("Extracted JSON from response, count:", questions.length);
        } catch (e2) {
          console.error("Failed to parse extracted JSON:", e2.message);
        }
      } else {
        // Try alternative: look for patterns like {"question":...}
        const matches = text.match(/\{[^}]+"question"[^}]+\}/g);
        if (matches) {
          console.log("Found question patterns:", matches.length);
          try {
            questions = matches.map(m => {
              try { return JSON.parse(m); } 
              catch { return null; }
            }).filter(Boolean);
          } catch {}
        }
      }
    }

    // Validate questions have required fields
    const beforeFilter = questions.length;
    questions = questions.filter(q => 
      q && 
      q.question && 
      q.options && 
      Array.isArray(q.options) && 
      q.options.length >= 4 && 
      q.correctAnswer
    );
    console.log("After validation filter:", beforeFilter, "->", questions.length);

    res.json({ 
      status: "SUCCESS", 
      data: { questions },
      message: `Extracted ${questions.length} questions`
    });

  } catch (err) {
    console.error("File extraction error:", err.response?.data || err.message);
    res.status(500).json({ 
      status: "FAILED", 
      message: "Failed to extract questions from file" 
    });
  }
});

export default router;

import React, { useEffect, useState } from "react";
import {
  getQuizzes,
  generateMCQ,
  createQuiz,
  deleteQuiz
} from "../../api/Facultymcqapi";

type Question = {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

type Quiz = {
  _id?: string;
  topic: string;
  time: number;
  dueDate?: string | null;
  questions: Question[];
};

const FacultyPage = () => {
  const [showUpload, setShowUpload] = useState<"self" | "generate" | "file">("self");
  const [topic, setTopic] = useState("");
  const [time, setTime] = useState<number>(0);
  const [dueDate, setDueDate] = useState<string>("");

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileQuestions, setFileQuestions] = useState<Question[]>([]);

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [viewQuiz, setViewQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    const data = await getQuizzes();
    setQuizzes(data);
  };

  const handleOptionChange = (i: number, val: string) => {
    const copy = [...options];
    copy[i] = val;
    setOptions(copy);
  };

  const addQuestion = () => {
    if (!question || options.some(o => !o) || !correctAnswer) {
      alert("Fill all fields");
      return;
    }

    setQuestions(prev => [
      ...prev,
      { question, options, correctAnswer }
    ]);

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
  };

  const uploadQuiz = async () => {
    let usedQuestions: Question[] = [];
    
    if (showUpload === "self") {
      usedQuestions = questions;
    } else if (showUpload === "generate") {
      usedQuestions = generatedQuestions;
    } else if (showUpload === "file") {
      usedQuestions = fileQuestions;
    }

    if (!topic || !time || usedQuestions.length === 0) {
      alert("Complete all fields and add questions");
      return;
    }

    const savedQuiz = await createQuiz({
      topic,
      time,
      dueDate: dueDate || null,
      questions: usedQuestions
    });

    setQuizzes(prev => [savedQuiz, ...prev]);

    setTopic("");
    setTime(0);
    setDueDate("");
    setQuestions([]);
    setGeneratedQuestions([]);
    setFileQuestions([]);
    setSelectedFile(null);

    alert("Quiz uploaded successfully");
  };

  const generateQuiz = async () => {
    if (!topic) {
      alert("Enter topic");
      return;
    }

    setLoading(true);
    try {
      const quiz = await generateMCQ({
        topic,
        numberOfQuestions: 10
      });

      setGeneratedQuestions(quiz.questions);
    } catch {
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const fetchFromFile = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    console.log("Selected file:", selectedFile.name, selectedFile.size, selectedFile.type);

    setFetching(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const token = localStorage.getItem("Token");
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://192.168.152.204:5000/api";

      console.log("Sending request to:", `${backendUrl}/quizzes/extract-from-file`);

      const response = await fetch(`${backendUrl}/quizzes/extract-from-file`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Response:", data);

      if (data.status === "SUCCESS" && data.data?.questions) {
        setFileQuestions(data.data.questions);
        alert(`Successfully extracted ${data.data.questions.length} questions from the file!`);
      } else {
        alert(data.message || "Failed to extract questions from file");
      }
    } catch (error) {
      console.error("Error fetching from file:", error);
      alert("Failed to process file. Please try a .txt file.");
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    if (!window.confirm("Delete this quiz?")) return;

    await deleteQuiz(id);
    setQuizzes(prev => prev.filter(q => q._id !== id));
    if (viewQuiz?._id === id) setViewQuiz(null);
  };

  const renderOptions = (q: Question) =>
    q.options.map((op, idx) => {
      const isCorrect =
        op.trim().toLowerCase() ===
        q.correctAnswer.trim().toLowerCase();

      return (
        <p key={idx} className={`ml-4 ${isCorrect ? "text-green-600 font-semibold" : ""}`}>
          {String.fromCharCode(65 + idx)}. {op}
          {isCorrect && " ✔"}
        </p>
      );
    });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">MCQ</h2>
          <button
            onClick={uploadQuiz}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            Upload Quiz
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowUpload("self")}
            className={`px-4 py-2 rounded-xl ${showUpload === "self" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Self Upload
          </button>

          <button
            onClick={() => setShowUpload("generate")}
            className={`px-4 py-2 rounded-xl ${showUpload === "generate" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Generate Quiz
          </button>

          <button
            onClick={() => setShowUpload("file")}
            className={`px-4 py-2 rounded-xl ${showUpload === "file" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Quiz from Files
          </button>
        </div>

        {/* Quiz Details - Always visible */}
        <div className="bg-white p-5 rounded-2xl shadow mb-6">
          <h3 className="font-semibold mb-3">Quiz Details</h3>
          
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Enter topic"
                className="border p-2 rounded-xl w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time (minutes)</label>
              <input
                type="number"
                value={time}
                onChange={e => setTime(Number(e.target.value))}
                placeholder="Enter time"
                className="border p-2 rounded-xl w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (optional)</label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="border p-2 rounded-xl w-full"
              />
            </div>
          </div>

          {showUpload === "self" && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Add Question</h3>

              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Enter Question"
                className="border p-2 rounded-xl w-full mb-3"
              />

              {options.map((op, i) => (
                <input
                  key={i}
                  value={op}
                  onChange={e => handleOptionChange(i, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  className="border p-2 rounded-xl w-full mb-3"
                />
              ))}

              <input
                value={correctAnswer}
                onChange={e => setCorrectAnswer(e.target.value)}
                placeholder="Correct Answer (exact option text)"
                className="border p-2 rounded-xl w-full mb-3"
              />

              <button
                onClick={addQuestion}
                className="bg-green-600 text-white px-5 py-2 rounded-xl"
              >
                Add Question
              </button>

              {questions.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold">Added Questions:</h4>
                  {questions.map((q, i) => (
                    <div key={i} className="mt-2">
                      <p>{i + 1}. {q.question}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {showUpload === "generate" && (
          <div className="bg-white p-5 rounded-2xl shadow mb-6">
            <button
              onClick={generateQuiz}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl"
            >
              {loading ? "Generating..." : "Generate Quiz"}
            </button>

            {generatedQuestions.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold">Generated Questions:</h4>
                {generatedQuestions.map((q, i) => (
                  <div key={i} className="mt-3">
                    <p>{i + 1}. {q.question}</p>
                    {renderOptions(q)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showUpload === "file" && (
          <div className="bg-white p-5 rounded-2xl shadow mb-6">
            <h3 className="font-semibold mb-3">Upload File to Extract Questions</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File (TXT recommended, or PDF/DOC)
              </label>
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="border p-2 rounded-xl w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                For best results, use a .txt file with questions in format: Question? Option1 Option2 Option3 Option4 Answer
              </p>
            </div>

            <button
              onClick={fetchFromFile}
              disabled={fetching || !selectedFile}
              className="bg-purple-600 text-white px-5 py-2 rounded-xl disabled:bg-gray-400"
            >
              {fetching ? "Extracting Questions..." : "Fetch Questions"}
            </button>

            {fileQuestions.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold">Extracted Questions ({fileQuestions.length}):</h4>
                {fileQuestions.map((q, i) => (
                  <div key={i} className="mt-3">
                    <p>{i + 1}. {q.question}</p>
                    {renderOptions(q)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <h3 className="text-xl font-semibold mb-4">Uploaded Quizzes</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(q => (
            <div key={q._id} className="bg-white p-5 rounded-2xl shadow">
              <h4 className="font-bold">{q.topic}</h4>
              <p>Questions: {q.questions.length}</p>
              <p>Time: {q.time} min</p>
              {q.dueDate && (
                <p className="text-sm text-gray-600">
                  Due: {new Date(q.dueDate).toLocaleString()}
                </p>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setViewQuiz(q)}
                  className="bg-blue-500 text-white py-2 w-full rounded-xl"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(q._id)}
                  className="bg-red-500 text-white py-2 w-full rounded-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {viewQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{viewQuiz.topic}</h3>
                <button
                  onClick={() => setViewQuiz(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                  {viewQuiz.questions.length} Questions
                </span>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm ml-2">
                  {viewQuiz.time} minutes
                </span>
              </div>

              <div className="space-y-4">
                {viewQuiz.questions.map((ques, idx) => (
                  <div key={idx} className="border-b pb-4">
                    <p className="font-semibold mb-2">
                      {idx + 1}. {ques.question}
                    </p>
                    <div className="ml-2 space-y-1">
                      {ques.options.map((opt, optIdx) => {
                        const isCorrect = 
                          opt.trim().toLowerCase() === 
                          ques.correctAnswer.trim().toLowerCase();
                        return (
                          <p 
                            key={optIdx} 
                            className={`text-sm ${isCorrect ? "text-green-600 font-semibold" : "text-gray-600"}`}
                          >
                            {String.fromCharCode(65 + optIdx)}. {opt}
                            {isCorrect && " ✓"}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewQuiz(null)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyPage;

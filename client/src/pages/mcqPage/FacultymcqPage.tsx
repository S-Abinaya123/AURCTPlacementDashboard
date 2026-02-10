import React, { useState } from "react";
import { generateMCQ, Question } from "../../api/Facultymcqapi";

type Quiz = {
  id: number;
  topic: string;
  time: number;
  questions: Question[];
};

const FacultyPage = () => {
  const [showUpload, setShowUpload] = useState(true);
  const [topic, setTopic] = useState("");
  const [time, setTime] = useState<number>(0);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [viewQuiz, setViewQuiz] = useState<Quiz | null>(null);

  const handleOptionChange = (i: number, val: string) => {
    const copy = [...options];
    copy[i] = val;
    setOptions(copy);
  };

  const addQuestion = () => {
    if (!question || options.some(o => !o) || !correctAnswer) return;

    setQuestions(prev => [
      ...prev,
      { question, options, correctAnswer }
    ]);

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
  };

  const uploadQuiz = () => {
    const usedQuestions = showUpload ? questions : generatedQuestions;

    if (!topic || !time || usedQuestions.length === 0) return;

    setQuizzes(prev => [
      ...prev,
      { id: Date.now(), topic, time, questions: usedQuestions }
    ]);

    setTopic("");
    setTime(0);
    setQuestions([]);
    setGeneratedQuestions([]);
  };

  const generateQuiz = async () => {
    if (!topic) return;

    setLoading(true);
    try {
      const qns = await generateMCQ(topic);
      setGeneratedQuestions(qns);
    } catch {
      alert("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">MCQ</h2>
          <button
            onClick={uploadQuiz}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            Upload Quiz
          </button>
        </div>

        {/* Mode Switch */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowUpload(true)}
            className={`px-4 py-2 rounded-xl ${showUpload ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Self Upload
          </button>
          <button
            onClick={() => setShowUpload(false)}
            className={`px-4 py-2 rounded-xl ${!showUpload ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Generate Quiz
          </button>
        </div>

        {/* Topic & Time */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Topic"
            className="border p-2 rounded-xl"
          />
          <input
            type="number"
            value={time}
            onChange={e => setTime(Number(e.target.value))}
            placeholder="Time (minutes)"
            className="border p-2 rounded-xl"
          />
        </div>

        {/* Self Upload */}
        {showUpload && (
          <div className="bg-white p-5 rounded-2xl shadow mb-6">
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Question"
              className="border p-2 rounded-xl w-full mb-3"
            />

            {options.map((o, i) => (
              <input
                key={i}
                value={o}
                onChange={e => handleOptionChange(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="border p-2 rounded-xl w-full mb-2"
              />
            ))}

            <input
              value={correctAnswer}
              onChange={e => setCorrectAnswer(e.target.value)}
              placeholder="Correct Answer (must match option)"
              className="border p-2 rounded-xl w-full mb-3"
            />

            <button
              onClick={addQuestion}
              className="bg-gray-800 text-white px-4 py-2 rounded-xl"
            >
              Add Question
            </button>
          </div>
        )}

        {/* AI Generate */}
        {!showUpload && (
          <div className="bg-white p-5 rounded-2xl shadow mb-6">
            <button
              onClick={generateQuiz}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl"
            >
              {loading ? "Generating..." : "Generate Quiz"}
            </button>
          </div>
        )}

        {/* Generated Preview */}
        {!showUpload && generatedQuestions.length > 0 && (
          <div className="bg-white p-5 rounded-2xl shadow mb-6">
            <h3 className="font-semibold mb-4">Generated Questions</h3>

            {generatedQuestions.map((q, i) => (
              <div key={i} className="mb-5">
                <p className="font-semibold mb-2">{i + 1}. {q.question}</p>

                {q.options.map((op, idx) => (
                  <p
                    key={idx}
                    className={`ml-4 ${
                      op === q.correctAnswer ? "text-green-600 font-semibold" : ""
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}. {op}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Uploaded Quizzes */}
        <h3 className="text-xl font-semibold mb-4">Uploaded Quizzes</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(q => (
            <div key={q.id} className="bg-white p-5 rounded-2xl shadow">
              <h4 className="font-bold">{q.topic}</h4>
              <p className="text-sm text-gray-600">Questions: {q.questions.length}</p>
              <p className="text-sm text-gray-600">Time: {q.time} min</p>

              <button
                onClick={() => setViewQuiz(q)}
                className="mt-4 bg-blue-500 text-white py-2 w-full rounded-xl"
              >
                View
              </button>
            </div>
          ))}
        </div>

        {/* View Modal */}
        {viewQuiz && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-3 z-50">
            <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden">

              <div className="flex justify-between items-center px-5 py-3 border-b">
                <h3 className="font-bold">{viewQuiz.topic}</h3>
                <button onClick={() => setViewQuiz(null)} className="text-red-500">Close</button>
              </div>

              <div className="p-5 max-h-[70vh] overflow-y-auto">
                {viewQuiz.questions.map((q, i) => (
                  <div key={i} className="mb-5">
                    <p className="font-semibold mb-2">{i + 1}. {q.question}</p>

                    {q.options.map((op, idx) => (
                      <p
                        key={idx}
                        className={`ml-4 ${
                          op === q.correctAnswer ? "text-green-600 font-semibold" : ""
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}. {op}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FacultyPage;

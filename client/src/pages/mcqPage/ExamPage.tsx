import React, { useEffect, useState } from "react";

type Question = {
  id: number;
  question: string;
  options: string[];
  correct: number;
  selected?: number;
  review?: boolean;
  visited?: boolean; // ✅ NEW
};

const TOTAL_TIME = 15 * 60;

const ExamPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "What is the time complexity of Binary Search?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      correct: 1,
    },
    {
      id: 2,
      question: "Which data structure uses FIFO?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      correct: 1,
    },
    {
      id: 3,
      question: "Which is NOT an operating system?",
      options: ["Linux", "Windows", "Oracle", "MacOS"],
      correct: 2,
    },
  ]);

  // ⏱ TIMER
  useEffect(() => {
    if (timeLeft <= 0) {
      setShowOverlay(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // ✅ MARK QUESTION AS VISITED
  useEffect(() => {
    const updated = [...questions];
    updated[current].visited = true;
    setQuestions(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleOptionSelect = (index: number) => {
    const updated = [...questions];
    updated[current].selected = index;
    setQuestions(updated);
  };

  const toggleReview = () => {
    const updated = [...questions];
    updated[current].review = !updated[current].review;
    setQuestions(updated);
  };

  const handleSubmit = () => {
    setShowOverlay(true);
  };

  const score = questions.filter(
    (q) => q.selected === q.correct
  ).length;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Exam Submitted ✅</h1>
          <p className="text-lg">
            Score: <b>{score}</b> / {questions.length}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-semibold text-gray-800">
            Data Structures – Final Exam
          </h1>

          <div className="flex items-center gap-4">
            <span className="px-4 py-1 rounded-full border text-red-600 font-semibold">
              ⏱ {formatTime(timeLeft)}
            </span>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </header>

      {/* BODY */}
      <main className="flex flex-grow max-w-7xl mx-auto w-full">
        {/* QUESTION AREA */}
        <div className="w-3/4 p-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-2">
              Question {current + 1} of {questions.length}
            </p>

            <h2 className="text-lg font-medium mb-6">
              {questions[current].question}
            </h2>

            <div className="space-y-3">
              {questions[current].options.map((opt, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer
                  ${
                    questions[current].selected === idx
                      ? "border-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    checked={questions[current].selected === idx}
                    onChange={() => handleOptionSelect(idx)}
                    className="accent-blue-600"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            {/* CONTROLS */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={toggleReview}
                className={`px-4 py-2 rounded-lg border
                ${
                  questions[current].review
                    ? "bg-yellow-100 border-yellow-500"
                    : "hover:bg-gray-100"
                }`}
              >
                Mark for Review
              </button>

              <div className="flex gap-3">
                <button
                  disabled={current === 0}
                  onClick={() => setCurrent((c) => c - 1)}
                  className="px-5 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={current === questions.length - 1}
                  onClick={() => setCurrent((c) => c + 1)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QUESTION PALETTE */}
        <aside className="w-1/4 p-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold mb-4">Question Palette</h3>

            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, idx) => {
                let color = "bg-gray-200"; // not visited

                if (q.visited && q.selected === undefined) {
                  color = "bg-yellow-400 text-white"; // visited only
                }
                if (q.selected !== undefined) {
                  color = "bg-green-500 text-white"; // answered
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrent(idx)}
                    className={`h-10 rounded-lg text-sm font-semibold
                      ${color}
                      ${current === idx ? "ring-2 ring-blue-500" : ""}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* LEGEND */}
            <div className="mt-4 text-xs space-y-2">
              <p>
                <span className="inline-block w-3 h-3 bg-green-500 mr-2"></span>
                Answered
              </p>
              <p>
                <span className="inline-block w-3 h-3 bg-yellow-400 mr-2"></span>
                Visited
              </p>
              <p>
                <span className="inline-block w-3 h-3 bg-gray-300 mr-2"></span>
                Not Visited
              </p>
            </div>
          </div>
        </aside>
      </main>

      {/* SUBMIT OVERLAY */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[380px] text-center shadow-xl">
            <div className="text-green-600 text-5xl mb-4">✅</div>
            <h2 className="text-xl font-semibold mb-2">
              Exam Submitted Successfully
            </h2>
            <p className="text-gray-600 mb-6">
              Your responses have been recorded.
            </p>
            <button
              onClick={() => {
                setShowOverlay(false);
                setSubmitted(true);
              }}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              View Result
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById, submitResult } from "../../api/mcqApi";

export default function ExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isOverdue, setIsOverdue] = useState(false);

  const hasSubmitted = useRef(false);
  const answersRef = useRef<string[]>([]);
  answersRef.current = answers;

  /* =========================
     SUBMIT FUNCTION (Manual)
  ========================= */
  const submitExamManual = useCallback(async () => {
    if (!quiz || hasSubmitted.current) return;

    // Check if all questions have been answered
    const hasAnsweredAll = answersRef.current.every((ans) => ans && ans.trim() !== "");
    if (!hasAnsweredAll) {
      alert("Please answer all questions before submitting.");
      hasSubmitted.current = false;
      return;
    }

    hasSubmitted.current = true;
    await submitExamLogic();
  }, [quiz, navigate]);

  /* =========================
     SUBMIT FUNCTION (Timer/Auto)
  ========================= */
  const submitExamAuto = useCallback(async () => {
    if (!quiz || hasSubmitted.current) return;
    hasSubmitted.current = true;
    await submitExamLogic();
  }, [quiz, navigate]);

  /* =========================
     SHARED SUBMIT LOGIC
  ========================= */
  const submitExamLogic = useCallback(async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User not logged in");
      navigate("/login");
      return;
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q: any, i: number) => {
      if (q.correctAnswer === answersRef.current[i]) score++;
    });

    console.log("Submitting exam with:", {
      userId,
      quizId: quiz._id,
      score,
    });

    try {
      await submitResult({
        userId,
        quizId: quiz._id,
        score,
        total: quiz.questions.length,
      });

      navigate("/student/result", {
        state: { score, total: quiz.questions.length, quiz },
      });

    } catch (err: any) {
      console.error("Failed to save score:", err.response?.data || err);

      navigate("/student/result", {
        state: {
          score,
          total: quiz.questions.length,
          quiz,
          saveError: true,
        },
      });
    }
  }, [quiz, navigate]);

  /* =========================
     FETCH QUIZ
  ========================= */
  useEffect(() => {
    if (id) {
      getQuizById(id).then((res) => {
        const quizData = res.data;
        
        // Check if quiz is overdue
        if (quizData.dueDate) {
          const dueDate = new Date(quizData.dueDate);
          const currentTime = new Date();
          if (currentTime > dueDate) {
            setIsOverdue(true);
            return;
          }
        }
        
        setQuiz(quizData);
        setAnswers(new Array(res.data.questions.length).fill(""));
        setTimeLeft(res.data.time * 60);
      });
    }
  }, [id]);

  /* =========================
     TIMER
  ========================= */
  useEffect(() => {
    if (!quiz) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExamAuto();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, submitExamAuto]);

  if (!quiz) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        {isOverdue ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Exam Closed</h2>
            <p className="text-gray-600 mb-4">This exam is overdue and no longer available.</p>
            <button 
              onClick={() => navigate("/student")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Back to Quizzes
            </button>
          </div>
        ) : (
          <p className="text-xl font-semibold text-gray-600">Loading...</p>
        )}
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
        <h2 className="font-bold">{quiz.topic}</h2>
        <div className="font-semibold text-red-500">
          ⏳ {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>

      <div className="flex flex-1">

        {/* LEFT SIDE */}
        <div className="w-3/4 p-6 overflow-y-auto">
          <p className="font-semibold mb-4">
            Q{current + 1}. {quiz.questions[current].question}
          </p>

          <div className="space-y-3">
            {quiz.questions[current].options.map((opt: string) => (
              <label
                key={opt}
                className={`block border p-3 rounded cursor-pointer ${
                  answers[current] === opt
                    ? "bg-blue-100 border-blue-400"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  className="mr-2"
                  checked={answers[current] === opt}
                  onChange={() => {
                    const newAns = [...answers];
                    newAns[current] = opt;
                    setAnswers(newAns);
                  }}
                />
                {opt}
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setCurrent(current - 1)}
              disabled={current === 0}
            >
              Prev
            </button>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setCurrent(current + 1)}
              disabled={current === quiz.questions.length - 1}
            >
              Next
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/4 bg-white border-l p-4 flex flex-col">
          <h3 className="font-semibold mb-3">Question Palette</h3>

          <div className="grid grid-cols-5 gap-2 mb-6">
            {quiz.questions.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-10 rounded text-sm font-medium ${
                  answers[index]
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                } ${current === index ? "ring-2 ring-blue-500" : ""}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className="mt-auto bg-green-600 text-white py-2 rounded"
            onClick={submitExamManual}
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}
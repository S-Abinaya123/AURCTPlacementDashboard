import { useEffect, useState } from "react";
import { getQuizzes, checkUserAttempt } from "../../api/mcqApi";
import { useNavigate } from "react-router-dom";

export default function TopicPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get userId from localStorage (assuming it's stored after login)
  const userId = localStorage.getItem("userId") || "demoUser";

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await getQuizzes();
        const quizzesData = res.data;
        
        // Get current time
        const currentTime = new Date();
        
        // Check attempt status and overdue status for each quiz
        const quizzesWithAttemptStatus = await Promise.all(
          quizzesData.map(async (quiz: any) => {
            // Check if quiz is overdue
            let isOverdue = false;
            if (quiz.dueDate) {
              const dueDate = new Date(quiz.dueDate);
              isOverdue = currentTime > dueDate;
            }
            
            try {
              const attemptRes = await checkUserAttempt(userId, quiz._id);
              return { ...quiz, attempted: attemptRes.data.attempted, previousResult: attemptRes.data.result, isOverdue };
            } catch {
              return { ...quiz, attempted: false, isOverdue };
            }
          })
        );
        
        setQuizzes(quizzesWithAttemptStatus);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [userId]);

  const handleStart = (quiz: any) => {
    if (quiz.attempted) {
      // If already attempted, show the previous result
      navigate("/student/result", {
        state: { 
          score: quiz.previousResult?.score, 
          total: quiz.previousResult?.total, 
          quiz,
          isReattempt: false
        },
      });
    } else {
      // If not attempted, start the exam
      navigate(`/student/exam/${quiz._id}`);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-600">Loading exams...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Available Quizzes</h1>
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {quizzes.map((quiz) => (
          <div 
            key={quiz._id} 
            className={`border p-4 rounded-lg transition ${
              quiz.attempted || quiz.isOverdue
                ? 'bg-gray-50 border-gray-300' 
                : 'bg-white border-gray-200 hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-lg">{quiz.topic}</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {quiz.questions?.length || 0} Questions
                </p>
                <p className="text-gray-600 text-sm">
                  {quiz.time} mins
                </p>
                {quiz.dueDate && (
                  <p className={`text-sm mt-1 ${quiz.isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                    Due: {new Date(quiz.dueDate).toLocaleString()}
                    {quiz.isOverdue && ' (Overdue)'}
                  </p>
                )}
              </div>
              {quiz.attempted && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  Completed
                </span>
              )}
              {quiz.isOverdue && !quiz.attempted && (
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                  Overdue
                </span>
              )}
            </div>

            {quiz.attempted ? (
              <div className="mt-4">
                <div className="bg-gray-100 rounded p-3 mb-3">
                  <p className="text-sm text-gray-600">Your Previous Score</p>
                  <p className="text-xl font-bold text-gray-800">
                    {quiz.previousResult?.score} / {quiz.previousResult?.total}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Math.round((quiz.previousResult?.score / quiz.previousResult?.total) * 100)}%
                  </p>
                </div>
                <button
                  onClick={() => handleStart(quiz)}
                  className="w-full bg-gray-400 text-white px-3 py-2 rounded cursor-not-allowed"
                  disabled
                >
                  Already Attempted
                </button>
              </div>
            ) : quiz.isOverdue ? (
              <div className="mt-4">
                <button
                  className="w-full bg-red-400 text-white px-3 py-2 rounded cursor-not-allowed"
                  disabled
                >
                  Exam Closed - Overdue
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleStart(quiz)}
                className="w-full bg-blue-600 text-white px-3 py-2 mt-3 rounded hover:bg-blue-700 transition"
              >
                Start Exam
              </button>
            )}
          </div>
        ))}
      </div>

      {quizzes.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-600">No exams available at the moment.</p>
        </div>
      )}
    </div>
  );
}

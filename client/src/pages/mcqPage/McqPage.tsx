import { useEffect, useState } from "react";
import { getQuizzes } from "../../api/mcqApi";
import { useNavigate } from "react-router-dom";

export default function MCQPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getQuizzes().then((res) => setQuizzes(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Quizzes</h1>

      {quizzes.map((quiz) => (
        <div key={quiz._id} className="border p-4 mt-3 rounded">
          <h2>{quiz.topic}</h2>
          <button
            onClick={() => navigate(`/exam/${quiz._id}`)}
            className="bg-blue-600 text-white px-3 py-1 mt-2 rounded"
          >
            Start
          </button>
        </div>
      ))}
    </div>
  );
}
import { useLocation, Link } from "react-router-dom";

export default function ResultPage() {
  const { state } = useLocation() as any;

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">No Result Found</h1>
          <p className="text-gray-600 mb-4">You haven't completed any quiz yet.</p>
          <Link
            to="/student"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { score, total, quiz } = state;
  const percentage = Math.round((score / total) * 100);

  // Determine pass/fail status (assuming 35% as passing threshold)
  const isPass = percentage >= 35;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full">
        {/* Header */}
        <div className={`py-8 px-6 text-center ${isPass ? 'bg-green-500' : 'bg-red-500'}`}>
          <div className="text-6xl mb-4">
            {isPass ? '🎉' : '😔'}
          </div>
          <h1 className="text-3xl font-bold text-white">
            {isPass ? 'Congratulations!' : 'Time Up!'}
          </h1>
          <p className="text-white/80 mt-2">
            {isPass ? 'You passed the quiz' : 'Better luck next time'}
          </p>
        </div>

        {/* Score Details */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm uppercase tracking-wide">Your Score</p>
            <p className="text-5xl font-bold text-gray-800 mt-2">
              {score} <span className="text-xl text-gray-400">/ {total}</span>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  isPass ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Quiz Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Quiz Topic</span>
              <span className="font-semibold text-gray-800">{quiz?.topic || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Status</span>
              <span className={`font-semibold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                {isPass ? 'PASSED' : 'FAILED'}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Correct Answers</span>
              <span className="font-semibold text-gray-800">
                {score} out of {total}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              to="/student"
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg text-center hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </Link>
            <Link
              to={`/exam/${quiz?._id}`}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg text-center hover:bg-gray-300 transition"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

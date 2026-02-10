import React from "react";

type Exam = {
  id: number;
  subject: string;
  description: string;
  tests: number;
};

const exams: Exam[] = [
  {
    id: 1,
    subject: "Data Structures & Algorithms",
    description:
      "Covers arrays, linked lists, trees, graphs, sorting, and searching algorithms.",
    tests: 12,
  },
  {
    id: 2,
    subject: "Operating Systems",
    description:
      "Process scheduling, memory management, deadlocks, and file systems.",
    tests: 9,
  },
  {
    id: 3,
    subject: "Computer Networks",
    description:
      "OSI & TCP/IP models, routing, switching, and network security.",
    tests: 15,
  },
];

const TopicPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Available Exams
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {exam.subject}
                </h2>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {exam.description}
                </p>

                <p className="text-sm text-gray-500 mt-4">
                  Total Tests:{" "}
                  <span className="font-semibold">{exam.tests}</span>
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">
                  Learn
                </button>
                <button className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  Start Exam
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicPage;

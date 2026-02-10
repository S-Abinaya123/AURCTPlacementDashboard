import { useState } from "react";

type RoadmapStep = {
  level: string;
  topics: string[];
};

const Roadmap = () => {
  const [department, setDepartment] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);

  // Mock AI roadmap generator
  const generateRoadmapFromAI = () => {
    setLoading(true);

    setTimeout(() => {
      setRoadmap([
        {
          level: "Beginner (Scratch)",
          topics: [
            `What is ${domain}?`,
            "Basic fundamentals",
            "Tools & setup",
          ],
        },
        {
          level: "Intermediate",
          topics: [
            "Core concepts",
            "Hands-on mini projects",
            "Best practices",
          ],
        },
        {
          level: "Advanced",
          topics: [
            "Advanced techniques",
            "Performance & optimization",
            "Real-world use cases",
          ],
        },
        {
          level: "Master",
          topics: [
            "System design",
            "Capstone project",
            "Interview & career prep",
          ],
        },
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      {/* Heading */}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900">
          Roadmap Generator
        </h1>
        <p className="text-gray-600 mt-2 mb-8">
          From scratch to mastery 
        </p>

        {/* Input Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Department */}
            <div>
              <label className="block font-semibold mb-2">
                Department
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Geoinformatics">Geoinformatics</option>
              </select>
            </div>

            {/* Domain */}
            <div>
              <label className="block font-semibold mb-2">
                Domain
              </label>
              <input
                type="text"
                placeholder="Eg: Full Stack, Cyber Security, VLSI, GIS"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={generateRoadmapFromAI}
            disabled={!department || !domain || loading}
            className="mt-6 w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Generating Roadmap..." : "Generate Roadmap"}
          </button>
        </div>

        {/* Roadmap Output */}
        {roadmap.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {roadmap.map((step) => (
              <div
                key={step.level}
                className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-700"
              >
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  {step.level}
                </h3>

                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {step.topics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmap;

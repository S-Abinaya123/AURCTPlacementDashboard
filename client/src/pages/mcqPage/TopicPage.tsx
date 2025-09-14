import React from 'react';

// Main App component
const TopicPage = () => {
    // Combined data for all exams with descriptions and topics
    const exams = [
        {
            id: 1,
            subject: 'Applied Mechanics',
            description: 'This test covers the fundamental principles of mechanics, including statics, dynamics, and the analysis of forces and motion.',
            tests: 10, // Example number of tests
            isActive: true,
        },
        {
            id: 2,
            subject: 'Data Structures & Algorithms',
            description: 'This exam will assess your knowledge of core data structures and common algorithms used in computer science.',
            tests: 12,
            isActive: true,
        },
        {
            id: 3,
            subject: 'Communication Skills',
            description: 'This test focuses on essential communication techniques for professional and academic settings, covering verbal and non-verbal skills.',
            tests: 8,
            isActive: true,
        },
        {
            id: 4,
            subject: 'Computer Networks',
            description: 'This exam will test your understanding of network architecture, protocols, and technologies, including the OSI and TCP/IP models.',
            tests: 15,
             isActive: true,
        },
        {
            id: 5,
            subject: 'Operating Systems',
            description: 'This test covers the core concepts of operating systems, including process management, memory management, and file systems.',
            tests: 9,
             isActive: true,
        },
        {
            id: 6,
            subject: 'Database Management',
            description: 'This exam assesses your knowledge of database design, SQL, and database security, focusing on relational models and normalization.',
            tests: 11,
             isActive: true,
        },
        {
            id: 7,
            subject: 'Software Engineering',
            description: 'This test covers the full software development lifecycle, from requirements gathering to maintenance and quality assurance.',
            tests: 13,
             isActive: true,
        },
    ];

    // Reusable Exam Card component
    const ExamCard = ({ exam }) => {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 w-full flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{exam.subject}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">{exam.description}</p>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 12a1 1 0 100-2 1 1 0 000 2z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold text-gray-400 mr-1">Total Tests:</span> {exam.tests}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <button className="flex-1  bg-gray-200 text-gray-800 font-medium py-2 rounded-xl hover:bg-gray-300 transition duration-300">
                        Start Learning
                    </button>
                    <button className="flex-1 bg-blue-500 text-white font-medium py-2 rounded-xl  hover:bg-blue-600  transition duration-300">
                        Start Exam
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <script src="https://cdn.tailwindcss.com"></script>
            <div className="container mx-auto max-w-7xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Exams & Training 🎓</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.map((exam) => (
                        <ExamCard key={exam.id} exam={exam} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopicPage;
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../service/auth.service';
import { studentApi } from '../../api/studentApi';
import { placementInterviewApi, type PlacementInterviewData } from '../../api/placementInterviewApi';
import VerifyingUserLoading from '../../components/loadingComponent/loginPageLoading/VerifyingUserLoading';

interface UserDetails {
  userId: string;
  userName: string;
  role: string;
  registerNo: string;
  email: string;
  profilePicture: string;
  department: string;
}

interface PackageStudent {
  userName: string;
  registerNo: string;
  department: string;
  packageOffered: string;
  companyName: string;
}

interface QuizRanker {
  studentName: string;
  registerNo: string;
  department: string;
  year: number;
  score: number;
  total: number;
  quizCount?: number;
  percentage?: number;
}

interface LeaderboardData {
  topThreePerDepartment?: { [key: string]: PackageStudent[] };
  topFivePerDepartment?: { [key: string]: PackageStudent[] };
  topThreeHighPackage?: PackageStudent[];
  topFiveQuizRankers?: QuizRanker[];
  topFiveQuizPerDepartment?: { [key: string]: QuizRanker[] };
}

const HomePage: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobPosts, setJobPosts] = useState<PlacementInterviewData[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const details = authService.getUserDetails();
    
    if (details.userId) {
      setUserDetails(details as UserDetails);
    }
    fetchLeaderboard();
    fetchJobPosts();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await studentApi.getLeaderboard();
      if (response.status === "SUCCESS" && response.data) {
        setLeaderboard(response.data);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobPosts = async () => {
    try {
      const response = await placementInterviewApi.getAllPlacementInterviews();
      if (response.status === "SUCCESS" && response.data) {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        // Sort by date and take latest 10
        const sortedJobs = data
          .sort((a, b) => new Date(b.interviewDate).getTime() - new Date(a.interviewDate).getTime())
          .slice(0, 10);
        setJobPosts(sortedJobs);
      }
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  // Navigate to calendar page with job ID
  const handleJobClick = (job: PlacementInterviewData) => {
    navigate(`/student/calendar?jobId=${job._id}`);
  };

  if (loading) {
    return <VerifyingUserLoading />;
  }

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 mb-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome{userDetails?.userName ? `, ${userDetails.userName}` : ''}!
        </h1>
        <p className="text-blue-100">Track your placement progress and achievements</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content - Leaderboard Sections */}
        <div className="flex-1">
          {/* Top 3 High Package Overall - Package Only */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>🏆</span> Top 3 Highest Package Placements
            </h2>
            
            {leaderboard && leaderboard.topThreeHighPackage && leaderboard.topThreeHighPackage.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leaderboard.topThreeHighPackage.map((student, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="text-center mb-2">
                      <span className={`text-2xl font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`}>
                        #{index + 1}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-800">{student.userName}</p>
                      <p className="text-sm text-gray-500">{student.department}</p>
                      <p className="text-sm text-blue-600">{student.companyName}</p>
                      <p className="text-xl font-bold text-green-600 mt-2">{student.packageOffered}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No placement data available</p>
            )}
          </div>

          {/* Top 5 Quiz Rankers Overall */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span>📝</span> Top 5 Quiz Rankers (Overall)
            </h2>
            <p className="text-sm text-gray-500 mb-4">Based on aggregated scores for students with 2+ quiz attempts</p>
            
            {leaderboard && leaderboard.topFiveQuizRankers && leaderboard.topFiveQuizRankers.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="space-y-2">
                  {leaderboard.topFiveQuizRankers.map((ranker, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-lg ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-600'}`}>
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">{ranker.studentName}</p>
                          <p className="text-sm text-gray-500">
                            {ranker.department}
                            {ranker.year && ` - Year ${ranker.year}`}
                          </p>
                          {ranker.quizCount && <p className="text-xs text-blue-500">Quiz Attempts: {ranker.quizCount}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{ranker.score}/{ranker.total}</p>
                        {ranker.percentage !== undefined && (
                          <p className="text-sm font-semibold text-green-600">{ranker.percentage}%</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-500 text-center py-4">No quiz data available</p>
              </div>
            )}
          </div>

          {/* Top 5 Quiz Rankers Per Department - 2 columns grid */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span>⭐</span> Top 5 Quiz Rankers Per Department
            </h2>
            <p className="text-sm text-gray-500 mb-4">Based on aggregated scores for students with 2+ quiz attempts</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leaderboard && leaderboard.topFiveQuizPerDepartment && Object.entries(leaderboard.topFiveQuizPerDepartment).map(([dept, rankers]) => (
                <div key={dept} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{dept}</h3>
                  
                  {rankers.length > 0 ? (
                    <div className="space-y-2">
                      {rankers.map((ranker, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700">#{index + 1}</span>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{ranker.studentName}</p>
                              <p className="text-xs text-gray-500">
                                {ranker.year ? `Year ${ranker.year}` : 'N/A'}
                              </p>
                              {ranker.quizCount && <p className="text-xs text-blue-500">Attempts: {ranker.quizCount}</p>}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-blue-600">{ranker.score}/{ranker.total}</p>
                            {ranker.percentage !== undefined && (
                              <p className="text-xs font-semibold text-green-600">{ranker.percentage}%</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-2">No data</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Department-wise Placement Leaderboard */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>🎯</span> Department-wise Placement Leaders (Top 5)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leaderboard && leaderboard.topFivePerDepartment && Object.entries(leaderboard.topFivePerDepartment).map(([dept, students]) => (
                <div key={dept} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span>📚</span> {dept}
                  </h3>
                  
                  {students.length > 0 ? (
                    <div className="space-y-2">
                      {students.map((student, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gradient-to-r from-green-50 to-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-600'}`}>
                              #{index + 1}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{student.userName}</p>
                              <p className="text-xs text-gray-500">{student.registerNo}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-green-600">{student.packageOffered}</p>
                            <p className="text-xs text-gray-500">{student.companyName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-2">No placements in this department</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Job Posts with Continuous Sliding Animation (Top to Bottom like Train) */}
        <div className="lg:w-80">
          <div 
            className="bg-white rounded-lg shadow-md p-4 sticky top-20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>💼</span> Latest Job Opportunities
            </h2>

            {jobPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No job posts available</p>
              </div>
            ) : (
              <div className="relative overflow-hidden h-80" ref={containerRef}>
                {/* Sliding animation - duplicate once for continuous effect */}
                <div 
                  className={`flex flex-col ${isHovered ? 'pause-animation' : 'animate-slide'}`}
                  style={{
                    animation: isHovered ? 'none' : `slideDown ${jobPosts.length * 6}s linear infinite`,
                  }}
                >
                  {/* First set of job posts */}
                  {jobPosts.map((job, index) => (
                    <div 
                      key={`${job._id || index}-${index}`}
                      onClick={() => handleJobClick(job)}
                      className="min-h-[80px] p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-4 border-l-4 border-blue-500 flex-shrink-0 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">→</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-sm truncate">{job.companyName}</h3>
                          <p className="text-xs text-gray-600">{job.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              <i className="fas fa-calendar-alt mr-1"></i>
                              {new Date(job.interviewDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Gap between rounds */}
                  <div className="h-8"></div>
                  {/* Second set for continuous loop effect */}
                  {jobPosts.map((job, index) => (
                    <div 
                      key={`${job._id || index}-dup-${index}`}
                      onClick={() => handleJobClick(job)}
                      className="min-h-[80px] p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-4 border-l-4 border-blue-500 flex-shrink-0 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">→</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-sm truncate">{job.companyName}</h3>
                          <p className="text-xs text-gray-600">{job.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              <i className="fas fa-calendar-alt mr-1"></i>
                              {new Date(job.interviewDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gradient overlays for smooth fade effect */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style>{`
        @keyframes slideDown {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%); // Slide exactly half (2 sets)
          }
        }
        
        .animate-slide {
          animation: slideDown ${30} linear infinite;
        }
        
        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default HomePage;

import React, { useEffect, useState } from 'react';
import { authService } from '../../service/auth.service';
import { studentApi } from '../../api/studentApi';
import VerifyingUserLoading from '../../components/loadingComponent/loginPageLoading/VerifyingUserLoading';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

interface FacultyDetails {
  userId: string;
  userName: string;
  role: string;
  email: string;
  mobileNo: string;
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
}

interface LeaderboardData {
  topThreePerDepartment?: { [key: string]: PackageStudent[] };
  topFivePerDepartment?: { [key: string]: PackageStudent[] };
  topThreeHighPackage?: PackageStudent[];
  topFiveQuizRankers?: QuizRanker[];
  topFiveQuizPerDepartment?: { [key: string]: QuizRanker[] };
}

const FacultyHomePage: React.FC = () => {
  const [facultyDetails, setFacultyDetails] = useState<FacultyDetails | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState<{ [key: string]: string | null }>({
    highPackage: null,
    quizOverall: null,
    quizPerDept: null,
    placementPerDept: null
  });

  useEffect(() => {
    const details = authService.getUserDetails();
    
    if (details.userId) {
      setFacultyDetails(details as FacultyDetails);
    }
    fetchLeaderboard();
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

  const openModal = (chartKey: string, department?: string) => {
    setSelectedDept(prev => ({ ...prev, [chartKey]: department || null }));
  };

  const handlePieClick = (chartKey: string, data: { name?: string }) => {
    if (data.name) {
      openModal(chartKey, data.name);
    }
  };

  const handleBarClick = (chartKey: string, data: { department?: string }) => {
    if (data.department) {
      openModal(chartKey, data.department);
    }
  };

  if (loading) {
    return <VerifyingUserLoading />;
  }

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-lg p-6 mb-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, Professor{facultyDetails?.userName ? ` ${facultyDetails.userName}` : ''}!
        </h1>
        <p className="text-green-100">Track student placements and achievements</p>
      </div>

{/* First Row - Two Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Top 3 High Package - Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>🏆</span> Placements by Department (Top 3 Packages)
          </h2>
          
          {(() => {
            const deptData = leaderboard?.topThreeHighPackage?.reduce((acc, s) => {
              acc[s.department] = (acc[s.department] || 0) + 1;
              return acc;
            }, {} as Record<string, number>) || {};
            const chartData = Object.entries(deptData).map(([department, count]) => ({ department, count }));
            
            if (chartData.length === 0) {
              return <p className="text-gray-500 text-center py-4">No placement data available</p>;
            }
            
            return (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="department"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({department, count}) => `${department}: ${count}`}
                      onClick={(data) => handlePieClick('highPackage', data)}
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="cursor-pointer" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-blue-600 text-sm mt-2">Click on a section to view department details</p>
              </>
            );
          })()}
        </div>

        {/* Top 5 Quiz Rankers - Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>📝</span> Quiz Participants by Department
          </h2>
          
          {(() => {
            const deptData = leaderboard?.topFiveQuizRankers?.reduce((acc, r) => {
              acc[r.department] = (acc[r.department] || 0) + 1;
              return acc;
            }, {} as Record<string, number>) || {};
            const chartData = Object.entries(deptData).map(([department, count]) => ({ department, count }));
            
            if (chartData.length === 0) {
              return <p className="text-gray-500 text-center py-4">No quiz data available</p>;
            }
            
            return (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="department"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({department, count}) => `${department}: ${count}`}
                      onClick={(data) => handlePieClick('quizOverall', data)}
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="cursor-pointer" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-blue-600 text-sm mt-2">Click on a section to view department details</p>
              </>
            );
          })()}
        </div>
      </div>

      {/* Second Row - Two Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Top 5 Quiz Rankers Per Department - Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>⭐</span> Quiz Rankings by Department
          </h2>
          
          {(() => {
            const chartData = Object.entries(leaderboard?.topFiveQuizPerDepartment || {}).map(([department, rankers]) => ({ department, count: rankers.length }));
            
            if (chartData.length === 0) {
              return <p className="text-gray-500 text-center py-4">No quiz data available</p>;
            }
            
            return (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="department"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({department, count}) => `${department}: ${count}`}
                      onClick={(data) => handlePieClick('quizPerDept', data)}
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="cursor-pointer" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-blue-600 text-sm mt-2">Click on a section to view department details</p>
              </>
            );
          })()}
        </div>

        {/* Department-wise Placement Leaderboard - Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎯</span> Placements by Department
          </h2>
          
          {(() => {
            const chartData = Object.entries(leaderboard?.topFivePerDepartment || {}).map(([department, students]) => ({ department, count: students.length }));
            
            if (chartData.length === 0) {
              return <p className="text-gray-500 text-center py-4">No placement data available</p>;
            }
            
            return (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="department" />
                    <YAxis allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Legend />
                    <Bar dataKey="count" fill="#F59E0B" onClick={(data) => handleBarClick('placementPerDept', data)} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-center text-blue-600 text-sm mt-2">Click on a bar to view department details</p>
              </>
            );
          })()}
        </div>
      </div>

      {/* Modals for detailed views */}
      <Modal
        isOpen={selectedDept.highPackage !== null}
        onClose={() => openModal('highPackage')}
        title={`${selectedDept.highPackage} - Top 3 Packages`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leaderboard?.topThreeHighPackage
            ?.filter(s => selectedDept.highPackage === null || s.department === selectedDept.highPackage)
            .map((student, index) => (
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
      </Modal>

      <Modal
        isOpen={selectedDept.quizOverall !== null}
        onClose={() => openModal('quizOverall')}
        title={`${selectedDept.quizOverall} - Quiz Participants`}
      >
        <div className="space-y-2">
          {leaderboard?.topFiveQuizRankers
            ?.filter(r => selectedDept.quizOverall === null || r.department === selectedDept.quizOverall)
            .map((ranker, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-lg ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-600'}`}>
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{ranker.studentName}</p>
                    <p className="text-sm text-gray-500">{ranker.department} - Year {ranker.year}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-blue-600">{ranker.score}/{ranker.total}</p>
              </div>
            ))}
        </div>
      </Modal>

      <Modal
        isOpen={selectedDept.quizPerDept !== null}
        onClose={() => openModal('quizPerDept')}
        title={`${selectedDept.quizPerDept} - Quiz Rankings`}
      >
        <div className="space-y-2">
          {(leaderboard?.topFiveQuizPerDepartment?.[selectedDept.quizPerDept || ''] || [])
            .map((ranker, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-lg ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-600'}`}>
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{ranker.studentName}</p>
                    <p className="text-sm text-gray-500">Year {ranker.year}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-blue-600">{ranker.score}/{ranker.total}</p>
              </div>
            ))}
        </div>
      </Modal>

      <Modal
        isOpen={selectedDept.placementPerDept !== null}
        onClose={() => openModal('placementPerDept')}
        title={`${selectedDept.placementPerDept} - Placements`}
      >
        <div className="space-y-2">
          {(leaderboard?.topFivePerDepartment?.[selectedDept.placementPerDept || ''] || [])
            .map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded">
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-lg ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-600'}`}>
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{student.userName}</p>
                    <p className="text-sm text-gray-500">{student.registerNo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{student.packageOffered}</p>
                  <p className="text-xs text-gray-500">{student.companyName}</p>
                </div>
              </div>
            ))}
        </div>
      </Modal>
    </div>
  );
};

export default FacultyHomePage;
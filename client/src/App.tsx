import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import ThemeProvider from "./context/ThemeContext";

import MainLayout from "./layouts/MainLayout";
import FacultyMainLayout from "./layouts/FacultyMainLayout";

import HomePage from "./pages/homePage/HomePage";
import FacultyHomePage from "./pages/homePage/FacultyHomePage";

import LoginPage from "./pages/loginPage/LoginPage";
import PasswordResetPage from "./pages/loginPage/PasswordResetPage";

import NotFoundPage from "./pages/otherpages/NotFoundPage";

import TopicPage from "./pages/mcqPage/TopicPage";
import McqPage from "./pages/mcqPage/McqPage";
import ExamPage from "./pages/mcqPage/ExamPage";
import ResultPage from "./pages/mcqPage/ResultPage";
import FacultymcqPage from "./pages/mcqPage/FacultymcqPage";

import Roadmap from "./pages/Roadmap";
import FacultyRoadmap from "./pages/FacultyRoadmap";
import CompanyRoadmapPage from "./pages/CompanyRoadmapPage";
import FacultyNotesUpload from "./pages/FacultyNotesUpload";
import StudentDetails from "./pages/StudentDetails";
import StudentResources from "./pages/StudentResources";
import PlacementPage from "./pages/PlacementPage";
import JobPostPage from "./pages/JobPostPage";
import InterviewCalendarPage from "./pages/InterviewCalendarPage";

import Settings from "./pages/profilePage/Settings";
import Header from "./layouts/Header";
import Sidebar from "./layouts/Sidebar";
import FacultyHeader from "./layouts/FacultyHeader";
import FacultySidebar from "./layouts/FacultySidebar";


const SettingsWithLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const role = localStorage.getItem("role");
  const isFaculty = role === "FACULTY";

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (isFaculty) {
    return (
      <div className="flex min-h-screen bg-white">
        <FacultySidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col md:ml-56">
          <FacultyHeader onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 p-4 bg-gray-50 overflow-y-auto">
            <Settings />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex flex-col min-h-screen md:ml-56">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 p-4 bg-gray-50 overflow-y-auto">
          <Settings />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>

          {/* Student Routes - Protected */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<HomePage />} />
            <Route path="topics" element={<TopicPage />} />
            <Route path="mcq" element={<McqPage />} />

            {/* Exam Routes */}
            <Route path="exam/:id" element={<ExamPage />} />
            <Route path="test/:id" element={<ExamPage />} />

            <Route path="result" element={<ResultPage />} />
            <Route path="resources" element={<StudentResources />} />
            <Route path="roadmap" element={<CompanyRoadmapPage />} />
            <Route path="calendar" element={<InterviewCalendarPage />} />
            <Route path="job-post" element={<InterviewCalendarPage />} />
            <Route path="settings" element={<Settings />} />
            
          </Route>

          {/* Faculty Routes - Protected */}
          <Route path="/faculty" element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyMainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<FacultyHomePage />} />
            <Route path="mcqpage" element={<FacultymcqPage />} />
            <Route path="upload-notes" element={<FacultyNotesUpload />} />
            <Route path="details" element={<StudentDetails />} />
            <Route path="placements" element={<PlacementPage />} />
            <Route path="Job Post" element={<JobPostPage />} />
            <Route path="job-post" element={<JobPostPage />} />
            <Route path="calendar" element={<InterviewCalendarPage />} />
            <Route path="roadmap" element={<FacultyRoadmap />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Auth */}
          <Route path="/" element={<PublicRoute element={<LoginPage />} />} />
          <Route path="/auth" element={<PublicRoute element={<LoginPage />} />} />
          <Route path="/auth/reset-password" element={<PublicRoute element={<PasswordResetPage />} />} />

          {/* Root */}
          

          {/* Settings - Standalone route for direct access */}
          <Route path="/settings" element={<SettingsWithLayout />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

import ThemeProvider from './context/ThemeContext';

import MainLayout from './layouts/MainLayout';

import HomePage from './pages/homePage/HomePage';
import LoginPage from './pages/loginPage/LoginPage';
import PasswordResetPage from './pages/loginPage/PasswordResetPage';
import NotFoundPage from './pages/otherpages/NotFoundPage';

import TopicPage from './pages/mcqPage/TopicPage';
import McqPage from './pages/mcqPage/McqPage';
import ExamPage from './pages/mcqPage/ExamPage';

function App() {

    return (
        <ThemeProvider>
            <Router>
                <Routes>

                    <Route element={<ProtectedRoute />}>
                        
                    </Route>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path='/mcq' element={<McqPage />} />
                        <Route path='/topics' element={<TopicPage />} />
                    </Route>
                    <Route path='/test' element={<ExamPage />} />

                    <Route path="/auth" element={<PublicRoute element={<LoginPage />} />} />
                    <Route path="/auth/reset-password" element={<PublicRoute element={<PasswordResetPage />} />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    )
}

export default App
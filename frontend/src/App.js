import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Navbar from './components/Common/Navbar';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage'; // Although it redirects, keep it for route definition
import AboutPage from './pages/AboutPage';
import GoogleAuthCallback from './components/Auth/GoogleAuthCallback';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminSessionDetailPage from './pages/AdminSessionDetailPage';
import Spinner from './components/Common/Spinner';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Spinner />;
    }

    return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Spinner />;
    }

    return user && user.role === 'admin' ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <ChatProvider>
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/auth/google/success" element={<GoogleAuthCallback />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignUpPage />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <PrivateRoute>
                                        <DashboardPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/history"
                                element={
                                    <PrivateRoute>
                                        <HistoryPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route path="/about" element={<AboutPage />} />
                            <Route
                                path="/admin/sessions"
                                element={
                                    <AdminRoute>
                                        <AdminDashboardPage />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/admin/sessions/:sessionId"
                                element={
                                    <AdminRoute>
                                        <AdminSessionDetailPage />
                                    </AdminRoute>
                                }
                            />
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </main>
                </ChatProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;

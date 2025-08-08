import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PlannerPage from './pages/PlannerPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen bg-gray-50">
                    <Header />
                    <main className="flex-grow">
                        <Routes>
                            {/* Public Route */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />

                            {/* Protected Routes */}
                            <Route path="/planner" element={
                                <ProtectedRoute>
                                    <PlannerPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/planner/:id" element={
                                <ProtectedRoute>
                                    <PlannerPage />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
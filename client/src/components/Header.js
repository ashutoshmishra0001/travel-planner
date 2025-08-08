import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const activeLinkStyle = {
        color: '#4f46e5',
        fontWeight: '600',
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="text-3xl font-bold text-indigo-600" onClick={() => setIsMenuOpen(false)}>
                        TravelPlanner
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-indigo-600 font-medium">Home</NavLink>
                        {user && <NavLink to="/planner" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-indigo-600 font-medium">Planner</NavLink>}
                        {user ? (
                            <>
                                <span className="text-gray-700">Hello, {user.username}</span>
                                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">Login</Link>
                                <Link to="/signup" className="text-gray-600 hover:text-indigo-600 font-medium">Sign Up</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        <NavLink to="/" onClick={() => setIsMenuOpen(false)} style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="block py-2 px-4 text-sm hover:bg-gray-100">Home</NavLink>
                        {user && <NavLink to="/planner" onClick={() => setIsMenuOpen(false)} style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="block py-2 px-4 text-sm hover:bg-gray-100">Planner</NavLink>}
                        {user ? (
                            <>
                                <span className="block py-2 px-4 text-sm text-gray-700">Hello, {user.username}</span>
                                <button onClick={handleLogout} className="w-full text-left block py-2 px-4 text-sm text-red-600 hover:bg-gray-100">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block py-2 px-4 text-sm hover:bg-gray-100">Login</Link>
                                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block py-2 px-4 text-sm hover:bg-gray-100">Sign Up</Link>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
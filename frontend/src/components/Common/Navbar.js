import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">AI Chatbot</Link>
                <div>
                    {user ? (
                        <>
                            <span className="mr-4">Welcome, {user.username}!</span>
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="mr-4 hover:text-gray-300">Login</Link>
                            <Link to="/signup" className="hover:text-gray-300">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

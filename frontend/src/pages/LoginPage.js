import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                <LoginForm />
                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

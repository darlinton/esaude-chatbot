import React from 'react';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;

import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                <LoginForm />
                <p className="text-center text-sm text-gray-600">
                    {t('loginForm.signupPrompt')}{' '}
                    <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                        {t('loginForm.signupLink')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

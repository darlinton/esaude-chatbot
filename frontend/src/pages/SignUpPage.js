import React from 'react';
import SignUpForm from '../components/Auth/SignUpForm';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SignUpPage = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                <SignUpForm />
                <p className="text-center text-sm text-gray-600">
                    {t('signupForm.loginPrompt')}{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        {t('signupForm.loginLink')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;

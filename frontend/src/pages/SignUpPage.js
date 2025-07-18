import React from 'react';
import SignUpForm from '../components/Auth/SignUpForm';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SignUpPage = () => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-center bg-gray-100 p-4 py-8"> {/* Removed min-h-screen, added py-8 */}
            <div className="max-w-md w-full space-y-8 p-6 sm:p-10 bg-white rounded-xl shadow-lg">
                <SignUpForm />
                <p className="text-center text-xs sm:text-sm text-gray-600">
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

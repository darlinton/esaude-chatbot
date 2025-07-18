import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold" title={t('navbar.titleTooltip')}>{t('navbar.title')}</Link>
                <div className="block lg:hidden">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                        </svg>
                    </button>
                </div>
                <div className={`w-full lg:flex lg:items-center lg:w-auto ${isOpen ? 'block' : 'hidden'}`}>
                    <div className="text-sm lg:flex-grow">
                        {user ? (
                            <>
                                <span className="block mt-4 lg:inline-block lg:mt-0 mr-4">{t('navbar.welcome', { displayName: user.displayName })}</span>
                                <Link to="/dashboard" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 ml-4 mr-4">
                                    {t('navbar.dashboardLink')}
                                </Link>
                                <Link to="/about" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 ml-4 mr-4">
                                    {t('navbar.aboutLink')}
                                </Link>
                                <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4 mt-4">
                                    {t('navbar.logoutButton')}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    {t('navbar.loginButton')}
                                </Link>
                                <Link to="/about" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 ml-4 mr-4">
                                    {t('navbar.aboutLink')}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

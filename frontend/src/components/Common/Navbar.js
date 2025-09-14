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
            <div className="container mx-auto flex items-center relative">
                {/* Hamburger button - always on the left on mobile */}
                <div className="block lg:hidden mr-4"> {/* Added mr-4 for spacing */}
                    <button onClick={toggleMenu} className="text-white focus:outline-none p-2"> {/* Added p-2 for larger touch target */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                        </svg>
                    </button>
                </div>

                {/* App name - centered on mobile, left on desktop */}
                <Link to="/" className="text-2xl font-bold flex-grow lg:flex-grow-0 text-center lg:text-left" title={t('navbar.titleTooltip')}>{t('navbar.title')}</Link>

                {/* Mobile menu content - positioned absolutely, full height */}
                <div className={`fixed inset-y-0 left-0 w-64 bg-gray-700 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50 lg:relative lg:flex lg:w-auto lg:translate-x-0 lg:bg-transparent lg:items-center lg:ml-auto`}>
                    <div className="p-4 flex flex-col h-full lg:flex-row lg:h-auto lg:p-0"> {/* Adjusted for horizontal on large screens */}
                        {/* Close button for mobile menu - top left */}
                        <div className="flex justify-start mb-4 lg:hidden">
                            <button onClick={toggleMenu} className="text-white focus:outline-none p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="flex-grow lg:flex-grow-0 lg:flex lg:items-center"> {/* Adjusted flex-grow and added flex for horizontal */}
                            {user ? (
                                <>
                                    <span className="block py-2 px-4 text-white lg:inline-block lg:py-0 lg:px-0 lg:mr-4">{t('navbar.welcome', { displayName: user.displayName })}</span>
                                    <Link to="/dashboard" onClick={toggleMenu} className="block py-2 px-4 text-white hover:text-gray-400 lg:inline-block lg:py-0 lg:px-0 lg:ml-4 lg:mr-4">
                                        {t('navbar.dashboardLink')}
                                    </Link>
                                    <Link to="/about" onClick={toggleMenu} className="block py-2 px-4 text-white hover:text-gray-400 lg:inline-block lg:py-0 lg:px-0 lg:ml-4 lg:mr-4">
                                        {t('navbar.aboutLink')}
                                    </Link>
                                    {user.role === 'admin' && (
                                        <>
                                            <Link to="/admin/prompts" onClick={toggleMenu} className="block py-2 px-4 text-white hover:text-gray-400 lg:inline-block lg:py-0 lg:px-0 lg:ml-4 lg:mr-4">
                                                Prompt Management
                                            </Link>
                                            <Link to="/admin/api-keys" onClick={toggleMenu} className="block py-2 px-4 text-white hover:text-gray-400 lg:inline-block lg:py-0 lg:px-0 lg:ml-4 lg:mr-4">
                                                API Key Management
                                            </Link>
                                        </>
                                    )}
                                    <button onClick={() => { logout(); toggleMenu(); }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 w-full lg:mt-0 lg:w-auto lg:ml-4">
                                        {t('navbar.logoutButton')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={toggleMenu} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full block lg:w-auto lg:inline-block">
                                        {t('navbar.loginButton')}
                                    </Link>
                                    <Link to="/about" onClick={toggleMenu} className="block py-2 px-4 text-white hover:text-gray-400 mt-2 lg:mt-0 lg:inline-block lg:ml-4 lg:mr-4">
                                        {t('navbar.aboutLink')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

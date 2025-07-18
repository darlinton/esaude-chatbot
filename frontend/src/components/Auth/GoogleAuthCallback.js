import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GoogleAuthCallback = () => {
    const { handleGoogleLogin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const id = params.get('id');
        const displayName = params.get('displayName');
        const email = params.get('email');

        if (token && id && displayName && email) {
            const userData = {
                _id: id,
                displayName,
                email,
                token,
            };
            handleGoogleLogin(userData);
            navigate('/dashboard');
        } else {
            // Handle error or redirect to login
            navigate('/login');
        }
    }, [handleGoogleLogin, location.search, navigate]);

    return <div>Loading...</div>;
};

export default GoogleAuthCallback;

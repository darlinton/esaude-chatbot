import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';

const GoogleAuthCallback = () => {
    const { handleGoogleLogin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { data } = await API.get('/auth/session');
                if (data) {
                    handleGoogleLogin(data);
                    navigate('/dashboard');
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error fetching session:', error);
                navigate('/login');
            }
        };

        fetchSession();
    }, [handleGoogleLogin, navigate]);

    return <div>Loading...</div>;
};

export default GoogleAuthCallback;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to dashboard as chat history is managed there
        navigate('/dashboard');
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-lg text-gray-600">Redirecting to Dashboard for chat history...</p>
        </div>
    );
};

export default HistoryPage;

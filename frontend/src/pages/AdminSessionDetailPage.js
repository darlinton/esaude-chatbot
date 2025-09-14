import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Spinner from '../components/Common/Spinner';

const AdminSessionDetailPage = () => {
    const { sessionId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [sessionDetails, setSessionDetails] = useState(null);
    const [messages, setMessages] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                navigate('/login'); // Redirect non-admins
            } else {
                fetchSessionDetails();
            }
        }
    }, [user, authLoading, navigate, sessionId]);

    const fetchSessionDetails = async () => {
        try {
            setLoading(true);
            const sessionResponse = await api.get(`/admin/sessions/${sessionId}`);
            setSessionDetails(sessionResponse.data);
            setMessages(sessionResponse.data.messages);
            setEvaluations(sessionResponse.data.evaluations);

            setLoading(false);
        } catch (err) {
            console.error('Error fetching session details:', err);
            setError('Failed to load session details.');
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-8">{error}</div>;
    }

    if (!sessionDetails) {
        return <div className="text-center mt-8 text-gray-600">Session not found.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Session Details for {sessionDetails._id}</h1>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Session Information</h2>
                <p><strong>User Email:</strong> {sessionDetails.user ? sessionDetails.user.email : 'N/A'}</p>
                <p><strong>User Name:</strong> {sessionDetails.user ? sessionDetails.user.displayName : 'N/A'}</p>
                <p><strong>Created At:</strong> {new Date(sessionDetails.createdAt).toLocaleString()}</p>
                <p><strong>Bot Type:</strong> {sessionDetails.botType}</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Chat Messages</h2>
                {messages.length === 0 ? (
                    <p className="text-gray-600">No messages in this session.</p>
                ) : (
                    <div className="space-y-4">
                        {messages.map(message => (
                            <div key={message._id} className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
                                <p className="font-semibold">{message.sender === 'user' ? 'You' : 'Bot'}:</p>
                                <p>{message.content}</p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(message.timestamp).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Evaluations</h2>
                {evaluations.length === 0 ? (
                    <p className="text-gray-600">No evaluations for this session.</p>
                ) : (
                    <div className="space-y-4">
                        {evaluations.map(evaluation => (
                            <div key={evaluation._id} className="p-3 rounded-lg bg-yellow-50">
                                <p><strong>Rating:</strong> {evaluation.rating}</p>
                                <p><strong>Feedback:</strong> {evaluation.feedback}</p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(evaluation.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSessionDetailPage;

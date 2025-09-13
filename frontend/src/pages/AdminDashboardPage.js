import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Spinner from '../components/Common/Spinner';

const AdminDashboardPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                navigate('/login'); // Redirect non-admins
            } else {
                fetchSessions();
            }
        }
    }, [user, authLoading, navigate]);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/sessions');
            setSessions(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching sessions:', err);
            setError('Failed to load sessions.');
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-8">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard - User Sessions</h1>
            {sessions.length === 0 ? (
                <p className="text-center text-gray-600">No user sessions found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Session ID</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">User Email</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">User Name</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Created At</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map(session => (
                                <tr key={session._id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm text-gray-800">{session._id}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{session.user ? session.user.email : 'N/A'}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{session.user ? session.user.displayName : 'N/A'}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{new Date(session.createdAt).toLocaleString()}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">
                                        <button
                                            onClick={() => navigate(`/admin/sessions/${session._id}`)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;

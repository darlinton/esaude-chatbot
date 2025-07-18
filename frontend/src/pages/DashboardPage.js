import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../context/ChatContext';
import ChatWindow from '../components/Chat/ChatWindow';
import Spinner from '../components/Common/Spinner';
import API from '../api';
import EvaluationForm from '../components/Evaluation/EvaluationForm';

const DashboardPage = () => {
    const { user, loading: authLoading } = useAuth();
    const { currentSession, setCurrentSession, startNewChat, loading: chatLoading, error: chatError, fetchEvaluation } = useChat();
    const [chatSessions, setChatSessions] = useState([]);
    const [showEvaluationForm, setShowEvaluationForm] = useState(false);
    const [selectedSessionForEval, setSelectedSessionForEval] = useState(null);
    const [sessionEvaluation, setSessionEvaluation] = useState(null); // New state for evaluation
    const [isNewSession, setIsNewSession] = useState(false);

    useEffect(() => {
        if (user) {
            fetchChatSessions();
        }
    }, [user]);

    useEffect(() => {
        const getEvaluation = async () => {
            if (currentSession?.evaluation) { // Only fetch if an evaluation is associated
                const result = await fetchEvaluation(currentSession._id);
                if (result.success) {
                    setSessionEvaluation(result.evaluation);
                } else {
                    setSessionEvaluation(null);
                }
            } else {
                setSessionEvaluation(null);
            }
        };

        getEvaluation();
    }, [currentSession, fetchEvaluation, isNewSession]);

    const fetchChatSessions = async () => {
        try {
            const { data } = await API.get('/chats');
            setChatSessions(data);
        } catch (error) {
            console.error('Failed to fetch chat sessions:', error);
        }
    };

    const handleStartNewChat = async () => {
        setIsNewSession(true); // Mark session as new to prevent premature evaluation fetch
        const result = await startNewChat();
        if (result.success) {
            fetchChatSessions(); // Refresh list to show new session
        }
    };

    const handleSelectSession = (session) => {
        setIsNewSession(false); // Existing sessions are not new
        setCurrentSession(session);
    };

    const handleEndChat = () => {
        if (currentSession) {
            setSelectedSessionForEval(currentSession._id);
            setShowEvaluationForm(true);
        }
    };

    const handleCloseEvaluationForm = () => {
        setShowEvaluationForm(false);
        setSelectedSessionForEval(null);
        setCurrentSession(null); // Clear current session after evaluation
        fetchChatSessions(); // Re-fetch sessions to update any new evaluations
    };

    const { t } = useTranslation();

    if (authLoading) return <Spinner />;
    if (!user) return <div className="text-center p-4">{t('dashboardPage.loginPrompt')}</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar for chat sessions */}
            <div className="w-1/4 bg-white p-4 border-r border-gray-200 flex flex-col">
                <h3 className="text-xl font-bold mb-4">{t('dashboardPage.yourChatSessions')}</h3>
                <button
                    onClick={handleStartNewChat}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4 w-full"
                >
                    {t('dashboardPage.startNewChat')}
                </button>
                <div className="flex-grow overflow-y-auto">
                    {chatLoading ? (
                        <Spinner />
                    ) : chatError ? (
                        <div className="text-red-500">{chatError}</div>
                    ) : (
                        chatSessions.map((session) => (
                            <div
                                key={session._id}
                                onClick={() => handleSelectSession(session)}
                                className={`p-3 mb-2 rounded-lg cursor-pointer ${currentSession?._id === session._id ? 'bg-blue-100 border-blue-500 border' : 'bg-gray-50 hover:bg-gray-100'}`}
                            >
                                <p className="font-semibold">{session.title}</p>
                                <p className="text-sm text-gray-500">{new Date(session.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main chat window area */}
            <div className="flex-grow flex flex-col">
                <div className="flex-grow p-4">
                    {currentSession ? (
                        <div className="flex flex-col h-full"> {/* Make this a flex column */}
                            <ChatWindow key={currentSession._id} sessionId={currentSession._id} /> {/* Add key prop */}
                            {sessionEvaluation && (
                                <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
                                    <h4 className="font-bold text-lg mb-2">{t('dashboardPage.chatEvaluation')}</h4>
                                    <p>{t('dashboardPage.rating')} {'★'.repeat(sessionEvaluation.rating)}{'☆'.repeat(5 - sessionEvaluation.rating)}</p>
                                    {sessionEvaluation.comment && <p>{t('dashboardPage.comment')} {sessionEvaluation.comment}</p>}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                            {t('dashboardPage.selectSessionPrompt')}
                        </div>
                    )}
                </div>
                {currentSession && (
                    <div className="p-4 bg-gray-100 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={handleEndChat}
                            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                        >
                            {t('dashboardPage.endChatEvaluate')}
                        </button>
                    </div>
                )}
            </div>

            {showEvaluationForm && selectedSessionForEval && (
                <EvaluationForm sessionId={selectedSessionForEval} onClose={handleCloseEvaluationForm} />
            )}
        </div>
    );
};

export default DashboardPage;

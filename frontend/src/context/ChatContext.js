import React, { createContext, useState, useContext, useCallback } from 'react';
import API from '../api';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const [currentSession, setCurrentSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const startNewChat = useCallback(async (title = 'New Chat') => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await API.post('/chats', { title });
            setCurrentSession(data);
            setMessages([]); // Clear messages for new session
            setLoading(false);
            return { success: true, session: data };
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to start new chat');
            setLoading(false);
            return { success: false, message: error };
        }
    }, []);

    const fetchMessages = useCallback(async (sessionId) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await API.get(`/messages/${sessionId}`);
            setMessages(data);
            setLoading(false);
            return { success: true, messages: data };
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch messages');
            setLoading(false);
            return { success: false, message: error };
        }
    }, []);

    const sendMessage = useCallback(async (sessionId, content) => {
        setError(null);
        try {
            const { data } = await API.post('/messages', { sessionId, content });
            setMessages((prevMessages) => [...prevMessages, data.userMessage, data.botMessage]);
            return { success: true, response: data };
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message');
            return { success: false, message: error };
        }
    }, []);

    const submitEvaluation = useCallback(async (sessionId, rating, comment) => {
        setError(null);
        try {
            const { data } = await API.post('/evaluations', { sessionId, rating, comment });
            return { success: true, evaluation: data };
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit evaluation');
            return { success: false, message: error };
        }
    }, []);

    const fetchEvaluation = useCallback(async (sessionId) => {
        setError(null);
        try {
            const { data } = await API.get(`/evaluations/${sessionId}`);
            return { success: true, evaluation: data };
        } catch (err) {
            // If no evaluation is found, the backend returns 404, which is not an error in this context
            if (err.response && err.response.status === 404) {
                return { success: true, evaluation: null };
            }
            setError(err.response?.data?.message || 'Failed to fetch evaluation');
            return { success: false, message: error };
        }
    }, []);

    const value = {
        currentSession,
        setCurrentSession,
        messages,
        setMessages,
        loading,
        error,
        startNewChat,
        fetchMessages,
        sendMessage,
        submitEvaluation,
        fetchEvaluation, // Add fetchEvaluation to the context value
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    return useContext(ChatContext);
};

import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as api from '../api';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [chatSessions, setChatSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchChatSessions = useCallback(async () => {
        if (!user) {
            setChatSessions([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.getChatSessions();
            setChatSessions(data);
        } catch (err) {
            console.error('Error fetching chat sessions:', err);
            setError('Failed to load chat sessions.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const fetchMessages = useCallback(async (sessionId) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.getChatSessionById(sessionId);
            setCurrentSession(data);
            setMessages(data.messages || []);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to load messages.');
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const sendMessage = useCallback(async (sessionId, content, botType) => {
        setError(null);
        try {
            const { data } = await api.sendMessage(sessionId, content, botType);
            setMessages((prevMessages) => [...prevMessages, data.userMessage, data.botMessage]);
            fetchChatSessions(); // Refresh sessions to update last message/timestamp
            return { success: true, response: data };
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.response?.data?.message || 'Failed to send message.');
            return { success: false, message: error };
        }
    }, [fetchChatSessions, error]);

    const startNewChat = useCallback(async (title = 'New Chat') => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.createChatSession(title);
            setChatSessions((prevSessions) => [data, ...prevSessions]);
            setCurrentSession(data);
            setMessages([]);
            return { success: true, session: data };
        } catch (err) {
            console.error('Error creating new chat session:', err);
            setError(err.response?.data?.message || 'Failed to create new chat session.');
            return { success: false, message: error };
        } finally {
            setLoading(false);
        }
    }, [error]);

    // Placeholder for evaluation functions, if they were in the original context
    const submitEvaluation = useCallback(async (sessionId, rating, comment) => {
        setError(null);
        try {
            // Assuming an API call for evaluation exists
            const { data } = await api.submitEvaluation(sessionId, rating, comment);
            return { success: true, evaluation: data };
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit evaluation');
            return { success: false, message: error };
        }
    }, [error]);

    const fetchEvaluation = useCallback(async (sessionId) => {
        if (!sessionId) {
            return { success: true, evaluation: null };
        }
        try {
            const { data } = await api.fetchEvaluation(sessionId);
            // If data is null or undefined, it means no evaluation was found.
            return { success: true, evaluation: data };
        } catch (err) {
            // A 404 error is expected if no evaluation exists, so we treat it as a success case.
            if (err.response && err.response.status === 404) {
                return { success: true, evaluation: null };
            }
            // For other errors, we log them and return a failure state.
            console.error('Failed to fetch evaluation:', err);
            return { success: false, message: err.response?.data?.message || 'Failed to fetch evaluation' };
        }
    }, []);

    const value = {
        chatSessions,
        fetchChatSessions,
        currentSession,
        setCurrentSession,
        messages,
        setMessages,
        loading,
        error,
        fetchMessages,
        sendMessage,
        startNewChat,
        submitEvaluation,
        fetchEvaluation,
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

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as api from '../api';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth(); // Get authLoading to prevent premature actions

    const [chatSessions, setChatSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSendingMessage, setIsSendingMessage] = useState(false); // New state for message sending
    const [sessionBotType, setSessionBotType] = useState(null);
    const [error, setError] = useState(null);

    // Effect to reset chat state when user changes (login/logout)
    useEffect(() => {
        if (!authLoading) { // Only run after auth context has finished loading
            setChatSessions([]);
            setCurrentSession(null);
            setMessages([]);
            setSessionBotType(null);
            setError(null);
            // If a user is logged in, fetch their sessions
            if (user) {
                fetchChatSessions();
            }
        }
    }, [user, authLoading]); // Depend on user and authLoading

    const fetchChatSessions = useCallback(async () => {
        if (!user) {
            setChatSessions([]);
            return;
        }
        // Prevent fetching if auth is still loading or no user is present
        if (authLoading || !user) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.getChatSessions();
            console.log("[ChatContext] Fetched chat sessions:", data); // Add logging
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
            console.log("[ChatContext] fetchMessages - Fetched session data:", data);
            setCurrentSession(data);
            setMessages(data.messages || []);
            const botTypeFromSession = data.botType || 'openai'; // Default to 'openai' if not present
            setSessionBotType(botTypeFromSession);
            console.log("[ChatContext] fetchMessages - Setting sessionBotType to:", botTypeFromSession);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to load messages.');
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const sendMessage = useCallback(async (sessionId, content, botType) => {
        setIsSendingMessage(true); // Set loading to true when sending message
        setError(null);
        try {
            const { data } = await api.sendMessage(sessionId, content, botType);
            setMessages((prevMessages) => [...prevMessages, data.userMessage, data.botMessage]);
            
            // After sending a message, update sessions to move the current session to the top and update its details
            setChatSessions(prevSessions => {
                const updatedSessions = prevSessions.map(session => 
                    session._id === sessionId ? { ...session, title: data.sessionTitle || session.title, updatedAt: new Date().toISOString() } : session
                );
                // Move the current session to the top
                const current = updatedSessions.find(session => session._id === sessionId);
                const others = updatedSessions.filter(session => session._id !== sessionId);
                return current ? [current, ...others] : others;
            });

            // Update the currentSession state with the new title if it changed
            if (currentSession && currentSession._id === sessionId) {
                setCurrentSession(prev => ({ ...prev, title: data.sessionTitle || prev.title }));
            }

            return { success: true, response: data };
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.response?.data?.message || 'Failed to send message.');
            return { success: false, message: error };
        } finally {
            setIsSendingMessage(false); // Set loading to false after message is sent or fails
        }
    }, [currentSession, error]); // Removed fetchChatSessions

    const startNewChat = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.createChatSession();
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
        isSendingMessage, // Include new state in context value
        error,
        fetchMessages,
        sendMessage,
        startNewChat,
        submitEvaluation,
        fetchEvaluation,
        sessionBotType,
        setSessionBotType, // Expose setSessionBotType
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

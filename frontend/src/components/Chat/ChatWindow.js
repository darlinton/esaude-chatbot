import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Message from './Message';
import MessageInput from './MessageInput';
import Spinner from '../Common/Spinner';
import { useChat } from '../../context/ChatContext';

const ChatWindow = ({ sessionId }) => {
    const { messages, loading, error, fetchMessages, sendMessage, isSendingMessage, sessionBotType, setSessionBotType } = useChat();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (sessionId) {
            fetchMessages(sessionId);
        }
    }, [sessionId, fetchMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (content) => {
        await sendMessage(sessionId, content, sessionBotType); // Use sessionBotType from context
    };

    const { t } = useTranslation();

    if (loading) return <Spinner />;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="flex flex-col flex-1 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">{t('chatWindow.chatWith')}</h2>
                <select
                    className="p-2 border border-gray-300 rounded-md w-full sm:w-auto text-base"
                    value={sessionBotType || 'openai'} // Use sessionBotType from context, default to openai
                    onChange={(e) => setSessionBotType(e.target.value)} // Update sessionBotType in context
                    disabled={messages.length > 0} // Disable if messages exist
                >
                    <option value="openai">ImunoAjudaMG (gpt-4o-mini)</option>
                    <option value="gemini">ImunoAjudaMG (gemini-1.5-flash)</option>
                    <option value="replay">Replay</option>
                </select>
            </div>
            <div className="flex-grow p-3 sm:p-4 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">{t('chatWindow.startTyping')}</div>
                ) : (
                    messages.map((msg) => (
                        <Message key={msg._id} message={msg} botType={sessionBotType} />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            {isSendingMessage && ( // Conditionally render spinner when message is being sent
                <div className="flex justify-center p-2">
                    <Spinner />
                </div>
            )}
            <MessageInput onSendMessage={handleSendMessage} disabled={!sessionId || isSendingMessage} />
        </div>
    );
};

export default ChatWindow;

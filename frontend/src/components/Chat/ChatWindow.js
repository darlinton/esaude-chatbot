import React, { useEffect, useRef, useState } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import Spinner from '../Common/Spinner';
import { useChat } from '../../context/ChatContext';

const ChatWindow = ({ sessionId }) => {
    const { messages, loading, error, fetchMessages, sendMessage, isSendingMessage } = useChat(); // Destructure isSendingMessage
    const messagesEndRef = useRef(null);
    const [selectedBot, setSelectedBot] = useState('openai'); // Default bot

    useEffect(() => {
        if (sessionId) {
            fetchMessages(sessionId);
        }
    }, [sessionId, fetchMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (content) => {
        await sendMessage(sessionId, content, selectedBot);
    };

    if (loading) return <Spinner />;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="flex flex-col flex-1 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Chat with:</h2>
                <select
                    className="p-2 border border-gray-300 rounded-md"
                    value={selectedBot}
                    onChange={(e) => setSelectedBot(e.target.value)}
                >
                    <option value="openai">OpenAI</option>
                    <option value="gemini">Gemini</option>
                    <option value="replay">Replay</option>
                </select>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">Start typing to begin your chat!</div>
                ) : (
                    messages.map((msg) => (
                        <Message key={msg._id} message={msg} />
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

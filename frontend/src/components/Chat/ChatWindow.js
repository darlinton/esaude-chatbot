import React, { useEffect, useRef } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import Spinner from '../Common/Spinner';
import { useChat } from '../../context/ChatContext';

const ChatWindow = ({ sessionId }) => {
    const { messages, loading, error, fetchMessages, sendMessage } = useChat();
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
        await sendMessage(sessionId, content);
    };

    if (loading) return <Spinner />;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="flex flex-col flex-1 bg-white rounded-lg shadow-md overflow-hidden">
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
            <MessageInput onSendMessage={handleSendMessage} disabled={!sessionId} />
        </div>
    );
};

export default ChatWindow;

import React from 'react';

const Message = ({ message }) => {
    const isUser = message.sender === 'user';
    const messageClass = isUser ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-gray-800 self-start';
    const alignmentClass = isUser ? 'items-end' : 'items-start';

    return (
        <div className={`flex flex-col ${alignmentClass} mb-3 sm:mb-4`}> {/* Adjusted margin-bottom */}
            <div className={`rounded-lg p-3 sm:p-4 max-w-[80%] sm:max-w-2xl ${messageClass}`}> {/* Adjusted padding and max-width for responsiveness */}
                <p className="text-sm sm:text-base">{message.content}</p> {/* Adjusted font size */}
            </div>
            <span className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()} - {message.sender}
            </span>
        </div>
    );
};

export default Message;

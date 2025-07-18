import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MessageInput = ({ onSendMessage, disabled }) => {
    const { t } = useTranslation();
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim() && !disabled) {
            onSendMessage(content);
            setContent('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex p-4 bg-gray-100 border-t border-gray-200">
            <input
                type="text"
                className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('messageInput.placeholder')}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={disabled}
            />
            <button
                type="submit"
                className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:opacity-50"
                disabled={disabled}
            >
                {t('messageInput.sendButton')}
            </button>
        </form>
    );
};

export default MessageInput;

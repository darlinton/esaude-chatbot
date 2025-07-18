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
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row p-3 sm:p-4 bg-gray-100 border-t border-gray-200">
            <textarea
                rows="1"
                className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden text-base mb-2 sm:mb-0"
                placeholder={t('messageInput.placeholder')}
                value={content}
                onChange={(e) => {
                    setContent(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                }}
                disabled={disabled}
                style={{ maxHeight: '100px' }}
            />
            <button
                type="submit"
                className="w-full sm:w-auto ml-0 sm:ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:opacity-50"
                disabled={disabled}
            >
                {t('messageInput.sendButton')}
            </button>
        </form>
    );
};

export default MessageInput;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '../../context/ChatContext';

const EvaluationForm = ({ sessionId, onClose }) => {
    const { t } = useTranslation();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const { submitEvaluation } = useChat();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (rating === 0) {
            setMessage(t('evaluationForm.selectRating'));
            return;
        }

        const result = await submitEvaluation(sessionId, rating, comment);
        if (result.success) {
            setMessage(t('evaluationForm.evaluationSuccess'));
            setTimeout(onClose, 1500); // Close form after a short delay
        } else {
            setMessage(result.message || t('evaluationForm.evaluationFailed'));
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">{t('evaluationForm.rateChatSession')}</h2>
                {message && <p className={`text-center mb-4 text-sm sm:text-base ${message.includes(t('evaluationForm.evaluationSuccess')) ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        {t('evaluationForm.ratingLabel')}
                    </label>
                    <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                className={`text-4xl sm:text-3xl ${rating >= star ? 'text-yellow-500' : 'text-gray-400'} focus:outline-none p-2`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
                        {t('evaluationForm.commentLabel')}
                    </label>
                    <textarea
                        id="comment"
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-base"
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength="500"
                    ></textarea>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto text-base"
                    >
                        {t('evaluationForm.submitEvaluation')}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto text-base sm:ml-4"
                    >
                        {t('evaluationForm.cancelButton')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EvaluationForm;

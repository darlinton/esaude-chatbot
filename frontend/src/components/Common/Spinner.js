import React from 'react';

const Spinner = () => {
    return (
        <div className="flex justify-center items-center text-gray-600">
            <div
                className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-gray-300"
                role="status"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Spinner;

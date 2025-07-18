import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto p-4 sm:p-6"> {/* Adjusted padding */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">{t('aboutPage.title')}</h1> {/* Adjusted font size */}
            <p className="text-base sm:text-lg mb-2">{t('aboutPage.description1')}</p> {/* Adjusted font size */}
            <p className="text-base sm:text-lg mb-2">{t('aboutPage.description2')}</p> {/* Adjusted font size */}
            <p className="text-base sm:text-lg">{t('aboutPage.version', { version: '1.0.0' })}</p> {/* Adjusted font size */}
        </div>
    );
};

export default AboutPage;

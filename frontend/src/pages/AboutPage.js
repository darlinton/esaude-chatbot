import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{t('aboutPage.title')}</h1>
            <p className="text-lg mb-2">{t('aboutPage.description1')}</p>
            <p className="text-lg mb-2">{t('aboutPage.description2')}</p>
            <p className="text-lg">{t('aboutPage.version', { version: '1.0.0' })}</p>
        </div>
    );
};

export default AboutPage;

"use client"
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSelector() {
    const { locale, changeLocale } = useLanguage();

    const languages = [
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'en', name: 'English', flag: '🇺🇸' }
    ];

    return (
        <div className="relative inline-block">
            <select
                value={locale}
                onChange={(e) => changeLocale(e.target.value)}
                className="appearance-none bg-gray-800 text-white px-3 py-2 pr-8 rounded-md border border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Seleccionar idioma"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}

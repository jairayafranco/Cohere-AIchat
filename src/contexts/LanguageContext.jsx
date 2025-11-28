"use client"
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [locale, setLocale] = useState('es');
    const [messages, setMessages] = useState(null);

    // Cargar idioma guardado al iniciar
    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') || 'es';
        setLocale(savedLocale);
        loadMessages(savedLocale);
    }, []);

    // Cargar mensajes del idioma
    const loadMessages = async (newLocale) => {
        try {
            const msgs = await import(`../../messages/${newLocale}.json`);
            setMessages(msgs.default);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    // Cambiar idioma
    const changeLocale = async (newLocale) => {
        setLocale(newLocale);
        localStorage.setItem('locale', newLocale);
        await loadMessages(newLocale);
    };

    return (
        <LanguageContext.Provider value={{ locale, messages, changeLocale }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

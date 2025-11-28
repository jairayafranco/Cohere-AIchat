"use client"
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Componente que actualiza el atributo lang del elemento html
 * basado en el idioma actual del contexto
 */
export default function LanguageUpdater() {
    const { locale } = useLanguage();

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = locale;
        }
    }, [locale]);

    return null;
}


"use client"
import { useLanguage } from '@/contexts/LanguageContext';

export function useTranslations(namespace) {
    const { messages } = useLanguage();

    const t = (key, params = {}) => {
        if (!messages) return key;

        const keys = namespace ? `${namespace}.${key}` : key;
        const path = keys.split('.');
        let value = messages;

        for (const k of path) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key;
            }
        }

        if (typeof value !== 'string') return key;

        // Reemplazar parámetros simples {param}
        let result = value;
        Object.keys(params).forEach(param => {
            result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
        });

        // Manejar plurales simples {count, plural, one {...} other {...}}
        const pluralMatch = result.match(/\{(\w+),\s*plural,\s*one\s*\{([^}]+)\}\s*other\s*\{([^}]+)\}\}/);
        if (pluralMatch) {
            const [, countKey, one, other] = pluralMatch;
            const count = params[countKey];
            result = result.replace(pluralMatch[0], count === 1 ? one : other);
        }

        return result;
    };

    return t;
}

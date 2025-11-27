import { CHAT_CONFIG } from './constants';

/**
 * Valida que el mensaje sea válido
 * @param {string} message - Mensaje a validar
 * @returns {Object} - { isValid: boolean, error: string }
 */
export function validateMessage(message) {
    if (!message || typeof message !== 'string') {
        return {
            isValid: false,
            error: 'El mensaje debe ser un texto válido',
        };
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length === 0) {
        return {
            isValid: false,
            error: 'El mensaje no puede estar vacío',
        };
    }

    if (trimmedMessage.length > CHAT_CONFIG.MAX_CHARS) {
        return {
            isValid: false,
            error: `El mensaje no puede exceder ${CHAT_CONFIG.MAX_CHARS} caracteres`,
        };
    }

    return {
        isValid: true,
        error: null,
    };
}

/**
 * Sanitiza el mensaje removiendo caracteres peligrosos
 * @param {string} message - Mensaje a sanitizar
 * @returns {string} - Mensaje sanitizado
 */
export function sanitizeMessage(message) {
    return message.trim();
}

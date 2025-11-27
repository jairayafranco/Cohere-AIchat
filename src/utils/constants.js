// Constantes de configuración
export const CHAT_CONFIG = {
    MAX_CHARS: 2000,
    SCROLL_BEHAVIOR: 'smooth',
    STORAGE_KEY: 'cohere-chat-history',
};

export const MESSAGE_ROLES = {
    USER: 'user',
    ASSISTANT: 'assistant',
    SYSTEM: 'system',
};

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Error de conexión. Por favor, intenta de nuevo.',
    INVALID_INPUT: 'Por favor, escribe un mensaje válido.',
    SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
    EMPTY_MESSAGE: 'El mensaje no puede estar vacío.',
};

export const KEYBOARD_SHORTCUTS = {
    SEND_MESSAGE: 'ctrl+enter',
    CLEAR_CHAT: 'ctrl+shift+delete',
    FOCUS_INPUT: 'ctrl+/',
};

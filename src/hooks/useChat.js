import { useState, useCallback, useEffect } from 'react';
import { MESSAGE_ROLES, CHAT_CONFIG, ERROR_MESSAGES } from '@/utils/constants';
import { validateMessage, sanitizeMessage } from '@/utils/validators';

/**
 * Hook personalizado para manejar la lógica del chat
 */
export function useChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar historial del localStorage al montar
    useEffect(() => {
        try {
            const savedMessages = localStorage.getItem(CHAT_CONFIG.STORAGE_KEY);
            if (savedMessages) {
                setMessages(JSON.parse(savedMessages));
            }
        } catch (err) {
            console.error('Error al cargar historial:', err);
        }
    }, []);

    // Guardar mensajes en localStorage cuando cambien
    useEffect(() => {
        if (messages.length > 0) {
            try {
                localStorage.setItem(CHAT_CONFIG.STORAGE_KEY, JSON.stringify(messages));
            } catch (err) {
                console.error('Error al guardar historial:', err);
            }
        }
    }, [messages]);

    const handleInputChange = useCallback((e) => {
        setInput(e.target.value);
        if (error) setError(null);
    }, [error]);

    const sendMessage = useCallback(async (e) => {
        e?.preventDefault();

        // Validar mensaje
        const validation = validateMessage(input);
        if (!validation.isValid) {
            setError(validation.error);
            return;
        }

        const sanitizedInput = sanitizeMessage(input);
        const userMessage = {
            role: MESSAGE_ROLES.USER,
            content: sanitizedInput,
            timestamp: new Date().toISOString(),
        };

        // Agregar mensaje del usuario
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: sanitizedInput }),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            // Crear mensaje del asistente
            const assistantMessageObj = {
                role: MESSAGE_ROLES.ASSISTANT,
                content: '',
                timestamp: new Date().toISOString(),
            };

            setMessages(prev => [...prev, assistantMessageObj]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                assistantMessage += chunk;

                // Actualizar el último mensaje (del asistente)
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                        ...assistantMessageObj,
                        content: assistantMessage,
                    };
                    return newMessages;
                });
            }
        } catch (err) {
            console.error('Error al enviar mensaje:', err);
            setError(err.message || ERROR_MESSAGES.NETWORK_ERROR);

            // Remover el mensaje del asistente vacío si hay error
            setMessages(prev => prev.filter(msg => msg.content !== ''));
        } finally {
            setIsLoading(false);
        }
    }, [input]);

    const clearChat = useCallback(() => {
        setMessages([]);
        setInput('');
        setError(null);
        localStorage.removeItem(CHAT_CONFIG.STORAGE_KEY);
    }, []);

    const copyMessage = useCallback((content) => {
        navigator.clipboard.writeText(content).then(() => {
            // Podrías agregar un toast aquí
            console.log('Mensaje copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar:', err);
        });
    }, []);

    return {
        messages,
        input,
        isLoading,
        error,
        handleInputChange,
        sendMessage,
        clearChat,
        copyMessage,
    };
}

import { useState, useCallback, useEffect } from 'react';
import { MESSAGE_ROLES, CHAT_CONFIG, ERROR_MESSAGES } from '@/utils/constants';
import { validateMessage, sanitizeMessage } from '@/utils/validators';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook personalizado para manejar la lógica del chat y múltiples sesiones
 */
export function useChat() {
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar sesiones del localStorage al montar
    useEffect(() => {
        try {
            const savedSessions = localStorage.getItem(CHAT_CONFIG.STORAGE_KEY_SESSIONS);
            if (savedSessions) {
                const parsedSessions = JSON.parse(savedSessions);
                setSessions(parsedSessions);

                // Cargar la última sesión o crear una nueva si no hay
                if (parsedSessions.length > 0) {
                    const lastSession = parsedSessions[0];
                    setCurrentSessionId(lastSession.id);
                    setMessages(lastSession.messages);
                } else {
                    createNewChat();
                }
            } else {
                createNewChat();
            }
        } catch (err) {
            console.error('Error al cargar historial:', err);
            createNewChat();
        }
    }, []);

    // Guardar sesiones en localStorage cuando cambien
    useEffect(() => {
        if (sessions.length > 0) {
            try {
                localStorage.setItem(CHAT_CONFIG.STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
            } catch (err) {
                console.error('Error al guardar historial:', err);
            }
        }
    }, [sessions]);

    // Actualizar la sesión actual cuando cambian los mensajes
    useEffect(() => {
        if (currentSessionId && messages.length > 0) {
            setSessions(prevSessions => {
                return prevSessions.map(session => {
                    if (session.id === currentSessionId) {
                        // Actualizar título si es el primer mensaje del usuario
                        let title = session.title;
                        if (session.messages.length === 0 && messages.length > 0) {
                            const firstUserMsg = messages.find(m => m.role === MESSAGE_ROLES.USER);
                            if (firstUserMsg) {
                                title = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
                            }
                        }

                        return {
                            ...session,
                            messages: messages,
                            title: title,
                            lastModified: new Date().toISOString()
                        };
                    }
                    return session;
                });
            });
        }
    }, [messages, currentSessionId]);

    const createNewChat = useCallback(() => {
        const newSession = {
            id: uuidv4(),
            title: 'Nuevo Chat',
            messages: [],
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };

        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        setMessages([]);
        setInput('');
        setError(null);
    }, []);

    const loadChat = useCallback((sessionId) => {
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
            setCurrentSessionId(sessionId);
            setMessages(session.messages);
            setInput('');
            setError(null);
        }
    }, [sessions]);

    const deleteChat = useCallback((sessionId) => {
        setSessions(prev => {
            const newSessions = prev.filter(s => s.id !== sessionId);

            // Si borramos la sesión actual, cambiar a otra o crear nueva
            if (sessionId === currentSessionId) {
                if (newSessions.length > 0) {
                    setCurrentSessionId(newSessions[0].id);
                    setMessages(newSessions[0].messages);
                } else {
                    // Si no quedan sesiones, crear una nueva en el próximo render/effect
                    // Pero para UX inmediata, reseteamos aquí
                    const newSession = {
                        id: uuidv4(),
                        title: 'Nuevo Chat',
                        messages: [],
                        createdAt: new Date().toISOString(),
                        lastModified: new Date().toISOString()
                    };
                    newSessions.push(newSession);
                    setCurrentSessionId(newSession.id);
                    setMessages([]);
                }
            }
            return newSessions;
        });
    }, [currentSessionId]);

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
        // Actualizar la sesión actual para que esté vacía
        setSessions(prev => prev.map(s => {
            if (s.id === currentSessionId) {
                return { ...s, messages: [], title: 'Nuevo Chat' };
            }
            return s;
        }));
    }, [currentSessionId]);

    const copyMessage = useCallback((content) => {
        navigator.clipboard.writeText(content).then(() => {
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
        sessions,
        currentSessionId,
        handleInputChange,
        sendMessage,
        clearChat,
        copyMessage,
        createNewChat,
        loadChat,
        deleteChat
    };
}

import { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ChatMessages({ messages, isLoading, onCopyMessage }) {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);

    // Auto-scroll al final cuando hay nuevos mensajes
    useEffect(() => {
        if (messagesEndRef.current) {
            requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }, [messages, isLoading]);

    return (
        <div
            ref={containerRef}
            className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-slate-700 p-4"
            role="log"
            aria-live="polite"
            aria-label="Mensajes del chat"
        >
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center py-12">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mb-4 opacity-50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                    <p className="text-lg font-medium">¡Comienza una conversación!</p>
                    <p className="text-sm mt-2">Escribe un mensaje abajo para empezar</p>
                </div>
            ) : (
                <>
                    {messages.map((message, index) => (
                        <ChatMessage
                            key={`${message.timestamp}-${index}`}
                            message={message}
                            onCopy={onCopyMessage}
                        />
                    ))}

                    {isLoading && (
                        <div className="flex items-center gap-3 text-gray-400 mb-4">
                            <LoadingSpinner size="sm" />
                            <span className="text-sm">El asistente está escribiendo...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </>
            )}
        </div>
    );
}

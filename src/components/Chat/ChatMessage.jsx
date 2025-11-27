import { useState } from 'react';
import { MESSAGE_ROLES } from '@/utils/constants';

export default function ChatMessage({ message, onCopy }) {
    const [showCopyButton, setShowCopyButton] = useState(false);
    const [copied, setCopied] = useState(false);

    const isUser = message.role === MESSAGE_ROLES.USER;

    const handleCopy = () => {
        onCopy(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-slideIn`}
            onMouseEnter={() => setShowCopyButton(true)}
            onMouseLeave={() => setShowCopyButton(false)}
        >
            <div
                className={`max-w-[80%] rounded-lg px-4 py-3 relative group ${isUser
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
            >
                {/* Indicador de rol */}
                <div className="text-xs opacity-70 mb-1 font-semibold">
                    {isUser ? 'Tú' : 'Asistente'}
                </div>

                {/* Contenido del mensaje */}
                <div className="whitespace-pre-wrap break-words">
                    {message.content}
                </div>

                {/* Timestamp */}
                {message.timestamp && (
                    <div className="text-xs opacity-50 mt-2">
                        {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </div>
                )}

                {/* Botón de copiar */}
                {(showCopyButton || copied) && (
                    <button
                        onClick={handleCopy}
                        className="absolute -top-2 -right-2 bg-gray-800 hover:bg-gray-700 text-white p-1.5 rounded-full shadow-lg transition-all"
                        aria-label="Copiar mensaje"
                        title="Copiar mensaje"
                    >
                        {copied ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-green-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

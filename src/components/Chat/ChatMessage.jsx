import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import { MESSAGE_ROLES } from '@/utils/constants';
import 'highlight.js/styles/github-dark.css'; // Estilo para bloques de código
import 'katex/dist/katex.min.css'; // Estilo para ecuaciones

export default function ChatMessage({ message, onCopy }) {
    const [showCopyButton, setShowCopyButton] = useState(false);
    const [copied, setCopied] = useState(false);

    const isUser = message.role === MESSAGE_ROLES.USER;

    const handleCopy = () => {
        onCopy(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Procesar el contenido para normalizar delimitadores de LaTeX
    const processedContent = useMemo(() => {
        if (!message.content) return '';

        let content = message.content;

        // Reemplazar \[ ... \] con $$ ... $$
        content = content.replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$');

        // Reemplazar \( ... \) con $ ... $
        content = content.replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');

        return content;
    }, [message.content]);

    return (
        <div
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-slideIn`}
            onMouseEnter={() => setShowCopyButton(true)}
            onMouseLeave={() => setShowCopyButton(false)}
        >
            <div
                className={`max-w-[85%] rounded-lg px-4 py-3 relative group ${isUser
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-white'
                    }`}
            >
                {/* Indicador de rol */}
                <div className="text-xs opacity-70 mb-1 font-semibold">
                    {isUser ? 'Tú' : 'Asistente'}
                </div>

                {/* Contenido del mensaje */}
                <div className={`markdown-content ${isUser ? 'text-white' : 'text-gray-100'}`}>
                    {isUser ? (
                        <div className="whitespace-pre-wrap break-words">{message.content}</div>
                    ) : (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeHighlight, rehypeKatex]}
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <div className="relative my-4 rounded-md overflow-hidden">
                                            <div className="bg-gray-800 px-4 py-1 text-xs text-gray-400 flex justify-between items-center border-b border-gray-700">
                                                <span>{match[1]}</span>
                                            </div>
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        </div>
                                    ) : (
                                        <code className={`${className} bg-black/20 px-1 py-0.5 rounded text-sm font-mono`} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-300 hover:underline"
                                    >
                                        {children}
                                    </a>
                                ),
                                h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-4 border-b border-gray-600 pb-1">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-md font-bold mb-1 mt-2">{children}</h3>,
                                blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-500 pl-4 italic my-2 bg-black/10 py-1 pr-2 rounded-r">{children}</blockquote>,
                                table: ({ children }) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-gray-600 border border-gray-600">{children}</table></div>,
                                th: ({ children }) => <th className="px-3 py-2 bg-gray-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">{children}</th>,
                                td: ({ children }) => <td className="px-3 py-2 whitespace-nowrap text-sm border-b border-gray-600/50">{children}</td>,
                            }}
                        >
                            {processedContent}
                        </ReactMarkdown>
                    )}
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
                        className="absolute -top-2 -right-2 bg-gray-800 hover:bg-gray-700 text-white p-1.5 rounded-full shadow-lg transition-all z-10"
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

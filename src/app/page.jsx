"use client"
import { useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatHeader from '@/components/Chat/ChatHeader';
import ChatMessages from '@/components/Chat/ChatMessages';
import ChatInput from '@/components/Chat/ChatInput';

export default function HomePage() {
  const {
    messages,
    input,
    isLoading,
    error,
    handleInputChange,
    sendMessage,
    clearChat,
    copyMessage,
  } = useChat();

  // Atajos de teclado globales
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Shift+Delete para limpiar chat
      if (e.ctrlKey && e.shiftKey && e.key === 'Delete') {
        e.preventDefault();
        if (messages.length > 0 && confirm('¿Estás seguro de que quieres limpiar el chat?')) {
          clearChat();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [messages.length, clearChat]);

  const handleClearChat = () => {
    if (confirm('¿Estás seguro de que quieres limpiar el chat? Esta acción no se puede deshacer.')) {
      clearChat();
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen py-8 px-4">
      <div className="w-full max-w-4xl">
        <ChatHeader
          onClearChat={handleClearChat}
          messageCount={messages.length}
        />

        {/* Mensajes de error */}
        {error && (
          <div
            className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-md mb-4 flex items-start gap-3"
            role="alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Contenedor de mensajes */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-4 backdrop-blur-sm border border-gray-700">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            onCopyMessage={copyMessage}
          />
        </div>

        {/* Input de chat */}
        <form onSubmit={sendMessage}>
          <ChatInput
            value={input}
            onChange={handleInputChange}
            onSubmit={sendMessage}
            isLoading={isLoading}
            disabled={false}
          />
        </form>
      </div>
    </section>
  );
}

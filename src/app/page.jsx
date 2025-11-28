"use client"
import { useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatHeader from '@/components/Chat/ChatHeader';
import ChatMessages from '@/components/Chat/ChatMessages';
import ChatInput from '@/components/Chat/ChatInput';
import ChatSidebar from '@/components/Chat/ChatSidebar';
import { useTranslations } from '@/hooks/useTranslations';

export default function HomePage() {
  const {
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
  } = useChat();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const t = useTranslations('chat');
  const tCommon = useTranslations('common');

  // Atajos de teclado globales
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Shift+Delete para limpiar chat
      if (e.ctrlKey && e.shiftKey && e.key === 'Delete') {
        e.preventDefault();
        if (messages.length > 0 && confirm(t('confirmClearShortcut'))) {
          clearChat();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [messages.length, clearChat, t]);

  const handleClearChat = () => {
    if (confirm(t('confirmClear'))) {
      clearChat();
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <ChatSidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onLoadChat={loadChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full relative w-full">
        {/* Botón para abrir sidebar en móvil */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden absolute top-4 left-4 z-30 p-2 bg-gray-800 rounded-md text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <section className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 pb-4 pt-16 md:p-4 h-full">
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
                <p className="font-semibold">{tCommon('error')}</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Contenedor de mensajes */}
          <div className="flex-1 overflow-hidden bg-gray-800/50 rounded-lg mb-4 backdrop-blur-sm border border-gray-700 relative flex flex-col">
            <div className="flex-1 overflow-hidden">
              <ChatMessages
                messages={messages}
                isLoading={isLoading}
                onCopyMessage={copyMessage}
              />
            </div>
          </div>

          {/* Input de chat */}
          <div className="flex-shrink-0">
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
      </main>
    </div>
  );
}

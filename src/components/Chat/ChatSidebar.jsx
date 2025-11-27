import { useState } from 'react';

export default function ChatSidebar({
    sessions,
    currentSessionId,
    onLoadChat,
    onNewChat,
    onDeleteChat,
    isOpen,
    onClose
}) {
    return (
        <>
            {/* Overlay para móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed md:static inset-y-0 left-0 z-50
                    w-64 bg-gray-900 border-r border-gray-800 
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    flex flex-col
                `}
            >
                {/* Header del Sidebar */}
                <div className="p-4 border-b border-gray-800">
                    <button
                        onClick={() => {
                            onNewChat();
                            if (window.innerWidth < 768) onClose();
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Nuevo Chat
                    </button>
                </div>

                {/* Lista de Chats */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`
                                group flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors
                                ${session.id === currentSessionId
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'}
                            `}
                            onClick={() => {
                                onLoadChat(session.id);
                                if (window.innerWidth < 768) onClose();
                            }}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <span className="truncate text-sm">
                                    {session.title || 'Nuevo Chat'}
                                </span>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('¿Eliminar este chat?')) {
                                        onDeleteChat(session.id);
                                    }
                                }}
                                className={`
                                    p-1 rounded hover:bg-red-500/20 hover:text-red-400
                                    opacity-0 group-hover:opacity-100 transition-opacity
                                    ${session.id === currentSessionId ? 'opacity-100' : ''}
                                `}
                                title="Eliminar chat"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}

                    {sessions.length === 0 && (
                        <div className="text-center text-gray-500 text-sm py-4">
                            No hay chats guardados
                        </div>
                    )}
                </div>

                {/* Footer del Sidebar */}
                <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
                    Cohere AI Chat
                </div>
            </aside>
        </>
    );
}

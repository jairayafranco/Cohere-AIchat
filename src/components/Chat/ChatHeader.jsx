"use client"
import { MESSAGE_ROLES } from '@/utils/constants';
import { useTranslations } from '@/hooks/useTranslations';
import LanguageSelector from '@/components/LanguageSelector';

export default function ChatHeader({ onClearChat, messageCount }) {
    const t = useTranslations('chat.header');

    return (
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-white text-4xl font-bold">{t('title')}</h1>
                {messageCount > 0 && (
                    <p className="text-gray-400 text-sm mt-1">
                        {t('messageCount', { count: messageCount })}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-3">
                <LanguageSelector />
                {messageCount > 0 && (
                    <button
                        onClick={onClearChat}
                        className="text-gray-400 hover:text-red-500 transition-colors px-3 py-2 rounded-md hover:bg-gray-800"
                        aria-label={t('clearChat')}
                        title={t('clearChatShortcut')}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

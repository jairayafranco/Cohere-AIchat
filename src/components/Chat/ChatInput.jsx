"use client"
import { useRef, useEffect } from 'react';
import Button from '../ui/Button';
import { CHAT_CONFIG } from '@/utils/constants';
import { useTranslations } from '@/hooks/useTranslations';

export default function ChatInput({
    value,
    onChange,
    onSubmit,
    isLoading,
    disabled,
}) {
    const textareaRef = useRef(null);
    const t = useTranslations('input');

    // Auto-focus en el textarea al montar
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    // Re-focus cuando la IA termine de responder
    useEffect(() => {
        if (!isLoading) {
            textareaRef.current?.focus();
        }
    }, [isLoading]);

    // Manejar Ctrl+Enter para enviar
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.ctrlKey && !isLoading && value.trim()) {
            e.preventDefault();
            onSubmit(e);
        }
    };

    const charsRemaining = CHAT_CONFIG.MAX_CHARS - value.length;
    const isNearLimit = charsRemaining < 100;

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label
                    htmlFor="chat-input"
                    className="text-white font-bold block"
                >
                    {t('label')}
                </label>
                <Button
                    type="submit"
                    disabled={isLoading || !value.trim() || disabled}
                    onClick={onSubmit}
                    ariaLabel={isLoading ? t('sendingMessage') : t('sendMessage')}
                    className="min-w-[100px]"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {t('sending')}
                        </span>
                    ) : (
                        t('send')
                    )}
                </Button>
            </div>

            <div className="relative">
                <textarea
                    ref={textareaRef}
                    id="chat-input"
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    className="text-black bg-slate-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    placeholder={t('placeholder')}
                    rows="4"
                    maxLength={CHAT_CONFIG.MAX_CHARS}
                    disabled={isLoading || disabled}
                    aria-label="Campo de mensaje"
                    aria-describedby="char-count"
                />

                {/* Contador de caracteres */}
                <div
                    id="char-count"
                    className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded ${isNearLimit
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                        }`}
                >
                    {t('charactersRemaining', { count: charsRemaining })}
                </div>
            </div>

            {/* Ayuda de atajos de teclado */}
            <div className="flex gap-4 text-xs text-gray-400">
                <span>💡 <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Ctrl+Enter</kbd> {t('shortcuts.send')}</span>
                <span>🗑️ <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Ctrl+Shift+Del</kbd> {t('shortcuts.clear')}</span>
            </div>
        </div>
    );
}

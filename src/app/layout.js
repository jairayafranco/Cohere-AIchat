import './globals.css'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/contexts/LanguageContext'
import LanguageUpdater from '@/components/LanguageUpdater'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Cohe-Chat - AI Chat',
  description: 'Intelligent chat application powered by Cohere AI. Converse naturally with an artificial intelligence assistant.',
  keywords: ['chat', 'AI', 'artificial intelligence', 'Cohere', 'virtual assistant'],
  authors: [{ name: 'Tu Nombre' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#16a34a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <LanguageProvider>
          <LanguageUpdater />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}

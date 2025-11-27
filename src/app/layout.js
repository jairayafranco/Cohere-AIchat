import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Cohe-Chat - Chat con IA',
  description: 'Aplicación de chat inteligente potenciada por Cohere AI. Conversa de forma natural con un asistente de inteligencia artificial.',
  keywords: ['chat', 'IA', 'inteligencia artificial', 'Cohere', 'asistente virtual'],
  authors: [{ name: 'Tu Nombre' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#16a34a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

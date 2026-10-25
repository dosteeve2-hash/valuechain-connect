import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })

export const metadata: Metadata = {
  title: 'ValueChain Connect',
  description: 'Projet de place de marché B2B en conception pour rapprocher producteurs et transformateurs.',
  keywords: ['marketplace', 'B2B', 'agriculture', 'coton', 'sésame', 'karité', 'maïs'],
  icons: {
    apple: '/brand/mark.svg',
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} ${sora.variable}`} style={{ backgroundColor: '#0A1628' }}>
        {children}
      </body>
    </html>
  )
}

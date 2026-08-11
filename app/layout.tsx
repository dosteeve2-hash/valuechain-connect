import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ScrollToTop from '@/components/ScrollToTop'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ValueChain Connect — Marketplace B2B CEDEAO',
  description: "Connectez votre production aux marchés de la CEDEAO. Marketplace B2B pour producteurs et transformateurs en Afrique de l'Ouest.",
  keywords: ['marketplace', 'CEDEAO', 'B2B', 'agriculture', "Afrique de l'Ouest", 'coton', 'sésame', 'karité'],
  icons: {
    apple: '/apple-touch-icon.png',
    icon: '/android-chrome-192x192.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className={inter.className} style={{ backgroundColor: '#0A1628' }}>
        {children}
        <ScrollToTop />
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'NE Transport | Instant Goods Transport in Assam',
  description: 'Book Tata Yodha, Bolero Pickup and more for instant goods transport across Assam. Fast, reliable, affordable.',
  keywords: 'transport Assam, Guwahati pickup, goods transport, Tata Yodha booking, Bolero pickup',
  openGraph: {
    title: 'NE Transport - Instant Goods Transport in Assam',
    description: 'Book pickup vehicles instantly across Assam',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="font-body bg-dark-900 text-white antialiased">
        {children}
      </body>
    </html>
  )
}

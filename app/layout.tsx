import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NE Transport | Instant Goods Transport in Assam',
  description: 'Book Tata Yodha, Bolero Pickup and more for instant goods transport across Assam.',
  keywords: 'transport Assam, Guwahati pickup, goods transport, Tata Yodha booking',
  openGraph: { title: 'NE Transport - Instant Goods Transport in Assam', description: 'Book pickup vehicles instantly across Assam', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-dark-900 text-white antialiased">
        {children}
      </body>
    </html>
  )
}

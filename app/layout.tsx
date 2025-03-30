import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ProfitFlip',
  description: 'Prediction',
  generator: 'Model Orchestra, Conducted by Ariel Ferdman',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

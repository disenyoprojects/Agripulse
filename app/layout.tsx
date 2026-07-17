import type { Metadata } from 'next'
import { Archivo_Black, Nunito, DM_Sans } from 'next/font/google'
import './globals.css'

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'AgriPulse System',
  description: 'The Pulse of Predictive Farming — Real-Time Agricultural Intelligence for BLISTT',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="tl"
      className={`${archivoBlack.variable} ${nunito.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}

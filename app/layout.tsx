import type { Metadata } from 'next'
import { Archivo_Black, Nunito, DM_Sans, Baloo_2 } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/providers/SmoothScroll'
import GrainOverlay from '@/components/ui/GrainOverlay'
import SiteNav from '@/components/shared/SiteNav'

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

const baloo2 = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo2',
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
      className={`${archivoBlack.variable} ${nunito.variable} ${dmSans.variable} ${baloo2.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GrainOverlay />
        <SiteNav />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}

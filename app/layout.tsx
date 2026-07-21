import type { Metadata } from 'next'
import { Archivo } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/providers/SmoothScroll'
import GrainOverlay from '@/components/ui/GrainOverlay'
import SiteNav from '@/components/shared/SiteNav'

/**
 * One family, two axes. Archivo's width axis (62–125) supplies the
 * display/body contrast that would otherwise need a second family,
 * which keeps this to a single font download — it matters, farmers
 * load this over paid mobile data.
 */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AgriPulse — Predictive Farming for BLISTT',
  description:
    'Community-powered crop intelligence for Benguet. Farmers report what they plant; LGUs see oversupply before it crashes the price.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="tl"
      data-surface="dark"
      className={`${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GrainOverlay />
        <SiteNav />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}

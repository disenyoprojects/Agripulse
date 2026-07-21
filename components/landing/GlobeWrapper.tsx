'use client'

import dynamic from 'next/dynamic'

const ThreeGlobe = dynamic(() => import('./ThreeGlobe'), { ssr: false })

export default function GlobeWrapper() {
  return <ThreeGlobe />
}

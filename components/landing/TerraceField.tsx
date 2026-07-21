'use client'

import { useEffect, useRef } from 'react'

/**
 * Animated topographic contour field — the Benguet terraces read as
 * survey contour lines, with ember markers for plots reporting in.
 *
 * Replaces the decorative floating-emoji background. It is specific to
 * the place (terraced highland) and to the product (plots submitting
 * data), rather than generic ambient motion.
 *
 * Cost control, because this ships to low-end Android on mobile data:
 *   - DPR capped (1.5 on small screens, 2 otherwise)
 *   - line count scales with viewport width
 *   - rAF paused when offscreen or when the tab is hidden
 *   - reduced-motion renders one static frame and stops
 */

// Resolved from the pine/ember tokens in globals.css. Hard-coded rather
// than read from CSS because canvas 2D colour parsing of oklch() is not
// universally supported on the Android WebViews this needs to run on.
const LINE_NEAR = [105, 168, 132] as const // pine-400
const LINE_FAR = [28, 97, 66] as const // pine-600
const MARKER = '233, 99, 38' // ember-500

type Marker = { line: number; x: number; phase: number }

export default function TerraceField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let lineCount = 0
    let markers: Marker[] = []
    let raf = 0
    let running = true
    let start = performance.now()

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, width < 640 ? 1.5 : 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      lineCount = width < 640 ? 16 : width < 1100 ? 24 : 32

      // Deterministic marker placement — same composition every load,
      // so the hero doesn't reshuffle on refresh.
      markers = [
        { line: 0.32, x: 0.22, phase: 0 },
        { line: 0.44, x: 0.61, phase: 1.7 },
        { line: 0.55, x: 0.38, phase: 3.1 },
        { line: 0.63, x: 0.78, phase: 0.9 },
        { line: 0.74, x: 0.52, phase: 2.4 },
        { line: 0.85, x: 0.86, phase: 4.2 },
      ].map((m) => ({ ...m, line: Math.round(m.line * lineCount) }))
    }

    /**
     * Ridge profile. Layered sines at incommensurable frequencies read
     * as terrain; a centre-weighted envelope gives it a summit so the
     * field looks like a ridgeline rather than a wave pattern.
     */
    const ridge = (nx: number, depth: number, time: number) => {
      const envelope = Math.pow(Math.sin(Math.PI * Math.min(Math.max(nx, 0), 1)), 0.85)
      const drift = time * 0.045
      const a = Math.sin(nx * 5.2 + drift + depth * 1.9) * 0.55
      const b = Math.sin(nx * 9.7 - drift * 0.7 + depth * 3.4) * 0.26
      const c = Math.sin(nx * 17.3 + drift * 1.3 + depth * 5.1) * 0.11
      return (a + b + c) * envelope
    }

    const draw = (now: number) => {
      const time = reduced ? 0 : (now - start) / 1000
      ctx.clearRect(0, 0, width, height)

      const topPad = height * 0.16
      const usable = height * 0.92
      const step = usable / lineCount
      const amp = Math.min(height * 0.17, 150)

      for (let i = 0; i <= lineCount; i++) {
        const depth = i / lineCount // 0 = far/back, 1 = near/front
        const baseY = topPad + i * step

        ctx.beginPath()
        const segments = width < 640 ? 48 : 96
        for (let s = 0; s <= segments; s++) {
          const nx = s / segments
          const x = nx * width
          const y = baseY + ridge(nx, depth, time) * amp * (0.45 + depth * 0.75)
          if (s === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }

        // Nearer contours are brighter and heavier — aerial perspective.
        const r = Math.round(LINE_FAR[0] + (LINE_NEAR[0] - LINE_FAR[0]) * depth)
        const g = Math.round(LINE_FAR[1] + (LINE_NEAR[1] - LINE_FAR[1]) * depth)
        const b = Math.round(LINE_FAR[2] + (LINE_NEAR[2] - LINE_FAR[2]) * depth)
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.14 + depth * 0.42})`
        ctx.lineWidth = 0.6 + depth * 1.1
        ctx.stroke()
      }

      // Plot markers: a slow breathing pulse, staggered so they never
      // blink in unison.
      for (const m of markers) {
        const depth = m.line / lineCount
        const baseY = topPad + m.line * step
        const y = baseY + ridge(m.x, depth, time) * amp * (0.45 + depth * 0.75)
        const x = m.x * width

        const pulse = reduced ? 0.5 : (Math.sin(time * 1.15 + m.phase) + 1) / 2
        const radius = 2.4 + depth * 1.6

        ctx.beginPath()
        ctx.arc(x, y, radius + pulse * 7, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${MARKER}, ${0.16 * (1 - pulse)})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${MARKER}, ${0.65 + depth * 0.35})`
        ctx.fill()
      }

      if (running && !reduced) raf = requestAnimationFrame(draw)
    }

    resize()
    raf = requestAnimationFrame(draw)

    const onResize = () => {
      resize()
      if (reduced) requestAnimationFrame(draw)
    }
    window.addEventListener('resize', onResize)

    // Pause when the hero scrolls away or the tab is backgrounded.
    const setRunning = (next: boolean) => {
      if (next === running) return
      running = next
      if (running && !reduced) {
        start = performance.now() - (performance.now() - start)
        raf = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(raf)
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { threshold: 0 },
    )
    io.observe(canvas)

    const onVisibility = () => setRunning(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      io.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{
        // Fades the field out behind the headline so type contrast is
        // never compromised by the artwork.
        maskImage:
          'radial-gradient(ellipse 105% 78% at 72% 62%, black 32%, transparent 78%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 105% 78% at 72% 62%, black 32%, transparent 78%)',
      }}
    />
  )
}

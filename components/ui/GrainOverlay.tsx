export default function GrainOverlay() {
  return (
    <svg
      aria-hidden
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999] mix-blend-overlay"
      style={{ opacity: 0.05 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  )
}

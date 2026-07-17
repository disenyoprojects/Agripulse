'use client'

import { useEffect, useRef } from 'react'

export default function ThreeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let animFrameId: number
    let THREE: typeof import('three')

    async function init() {
      THREE = await import('three')
      const canvas = canvasRef.current
      if (!canvas) return

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
      camera.position.set(0, 0, 3)

      // Earth sphere
      const geo = new THREE.SphereGeometry(1, 48, 48)
      const mat = new THREE.MeshStandardMaterial({ color: 0x2d5016, roughness: 0.8, metalness: 0.1 })
      const globe = new THREE.Mesh(geo, mat)
      scene.add(globe)

      // Wireframe overlay
      const wireMat = new THREE.MeshBasicMaterial({ color: 0x4a8a28, wireframe: true, opacity: 0.15, transparent: true })
      const wire = new THREE.Mesh(geo, wireMat)
      wire.scale.setScalar(1.01)
      scene.add(wire)

      // Dots representing data points (farms)
      const dotGeo = new THREE.BufferGeometry()
      const positions: number[] = []
      for (let i = 0; i < 120; i++) {
        const phi = Math.acos(-1 + (2 * i) / 120)
        const theta = Math.sqrt(120 * Math.PI) * phi
        const x = 1.05 * Math.sin(phi) * Math.cos(theta)
        const y = 1.05 * Math.sin(phi) * Math.sin(theta)
        const z = 1.05 * Math.cos(phi)
        positions.push(x, y, z)
      }
      dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      const dotMat = new THREE.PointsMaterial({ color: 0xf4a300, size: 0.04 })
      scene.add(new THREE.Points(dotGeo, dotMat))

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.6))
      const dirLight = new THREE.DirectionalLight(0xfbf2c0, 1.2)
      dirLight.position.set(3, 2, 5)
      scene.add(dirLight)

      function animate() {
        animFrameId = requestAnimationFrame(animate)
        globe.rotation.y += 0.003
        wire.rotation.y += 0.003
        renderer.render(scene, camera)
      }
      animate()
    }

    init()
    return () => cancelAnimationFrame(animFrameId)
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

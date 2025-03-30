"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  type: "bitcoin" | "dollar" | "chart"
  rotation: number
  rotationSpeed: number
}

const CryptoParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const animationFrameId = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles.current = []
      const particleCount = Math.min(Math.floor(window.innerWidth / 20), 40)

      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 15 + 10,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          type: ["bitcoin", "dollar", "chart"][Math.floor(Math.random() * 3)] as any,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
        })
      }
    }

    const drawParticle = (particle: Particle) => {
      if (!ctx) return

      ctx.save()
      ctx.translate(particle.x, particle.y)
      ctx.rotate(particle.rotation)
      ctx.globalAlpha = particle.opacity

      // Draw crypto symbols
      ctx.fillStyle = particle.type === "bitcoin" ? "#f7931a" : particle.type === "dollar" ? "#10b981" : "#ff6b00"

      ctx.beginPath()

      if (particle.type === "bitcoin") {
        // Bitcoin symbol
        ctx.font = `${particle.size}px Arial`
        ctx.fillText("₿", -particle.size / 2, particle.size / 2)
      } else if (particle.type === "dollar") {
        // Dollar symbol
        ctx.font = `${particle.size}px Arial`
        ctx.fillText("$", -particle.size / 3, particle.size / 2)
      } else {
        // Chart symbol
        ctx.font = `${particle.size}px Arial`
        ctx.fillText("📈", -particle.size / 2, particle.size / 2)
      }

      ctx.fill()
      ctx.restore()
    }

    const updateParticle = (particle: Particle) => {
      particle.x += particle.speedX
      particle.y += particle.speedY
      particle.rotation += particle.rotationSpeed

      // Wrap around screen
      if (particle.x < -50) particle.x = canvas.width + 50
      if (particle.x > canvas.width + 50) particle.x = -50
      if (particle.y < -50) particle.y = canvas.height + 50
      if (particle.y > canvas.height + 50) particle.y = -50
    }

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current.forEach((particle) => {
        updateParticle(particle)
        drawParticle(particle)
      })

      animationFrameId.current = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

export default CryptoParticles


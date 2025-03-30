import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { cn } from "@/utils/cn"

interface CandleData {
  open: number
  close: number
  high: number
  low: number
  id: number
}

export const AnimatedCandleChart = () => {
  const [candles, setCandles] = useState<CandleData[]>([])
  const [counter, setCounter] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate random candle data
  const generateCandles = (count: number, lastPrice?: number): CandleData[] => {
    const candles: CandleData[] = []
    let lastClose = lastPrice || 100

    for (let i = 0; i < count; i++) {
      const change = (Math.random() - 0.5) * 3
      const open = lastClose
      const close = open + change
      const high = Math.max(open, close) + Math.random() * 1.5
      const low = Math.min(open, close) - Math.random() * 1.5
      
      candles.push({ 
        open, 
        close, 
        high, 
        low,
        id: counter + i
      })
      lastClose = close
    }

    return candles
  }

  // Initialize candles
  useEffect(() => {
    const initialCandles = generateCandles(25)
    setCandles(initialCandles)
    setCounter(25)
  }, [])

  // Update candles periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prev => {
        const lastCandle = prev[prev.length - 1]
        const newCandle = generateCandles(1, lastCandle.close)[0]
        newCandle.id = counter + 1
        setCounter(c => c + 1)
        return [...prev.slice(1), newCandle]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [counter])

  const maxPrice = Math.max(...candles.map(c => c.high))
  const minPrice = Math.min(...candles.map(c => c.low))
  const priceRange = maxPrice - minPrice

  return (
    <div className="absolute inset-0 opacity-[0.07]" ref={containerRef}>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <motion.g
          animate={{
            x: [0, -100],
          }}
          transition={{
            duration: 3,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          {/* First set of candles */}
          {candles.map((candle, i) => {
            const candleWidth = 100 / (candles.length - 1)
            const x = i * candleWidth
            const isGreen = candle.close >= candle.open

            // Normalize values to chart height
            const normalizeY = (price: number) => 
              100 - ((price - minPrice) / priceRange) * 100

            const openY = normalizeY(candle.open)
            const closeY = normalizeY(candle.close)
            const highY = normalizeY(candle.high)
            const lowY = normalizeY(candle.low)

            return (
              <g key={`first-${candle.id}`}>
                {/* Wick */}
                <line
                  x1={`${x + candleWidth / 4}%`}
                  y1={`${highY}%`}
                  x2={`${x + candleWidth / 4}%`}
                  y2={`${lowY}%`}
                  stroke={isGreen ? "#22c55e" : "#ef4444"}
                  strokeWidth="1.5"
                />
                {/* Body */}
                <rect
                  x={`${x}%`}
                  y={`${Math.min(openY, closeY)}%`}
                  width={`${candleWidth / 2}%`}
                  height={`${Math.abs(closeY - openY)}%`}
                  fill={isGreen ? "#22c55e" : "#ef4444"}
                />
              </g>
            )
          })}

          {/* Second set of candles (for seamless loop) */}
          {candles.map((candle, i) => {
            const candleWidth = 100 / (candles.length - 1)
            const x = i * candleWidth + 100 // Offset by 100%
            const isGreen = candle.close >= candle.open

            // Normalize values to chart height
            const normalizeY = (price: number) => 
              100 - ((price - minPrice) / priceRange) * 100

            const openY = normalizeY(candle.open)
            const closeY = normalizeY(candle.close)
            const highY = normalizeY(candle.high)
            const lowY = normalizeY(candle.low)

            return (
              <g key={`second-${candle.id}`}>
                {/* Wick */}
                <line
                  x1={`${x + candleWidth / 4}%`}
                  y1={`${highY}%`}
                  x2={`${x + candleWidth / 4}%`}
                  y2={`${lowY}%`}
                  stroke={isGreen ? "#22c55e" : "#ef4444"}
                  strokeWidth="1.5"
                />
                {/* Body */}
                <rect
                  x={`${x}%`}
                  y={`${Math.min(openY, closeY)}%`}
                  width={`${candleWidth / 2}%`}
                  height={`${Math.abs(closeY - openY)}%`}
                  fill={isGreen ? "#22c55e" : "#ef4444"}
                />
              </g>
            )
          })}
        </motion.g>
      </svg>
    </div>
  )
} 
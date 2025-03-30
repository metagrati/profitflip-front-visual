"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PredictionCard } from "./PredictionCard"
import { motion } from "framer-motion"

interface CarouselItem {
  id: string | number
  epoch: number | null
  title: string
  amount: string
  currentPrice: string
  players: string
  timeLeft: string
  isConnected: boolean
  isLive: boolean
  onConnect: () => void
  onPredictUp: () => Promise<void>
  onPredictDown: () => Promise<void>
}

interface CarouselProps {
  items: CarouselItem[]
  itemWidth?: number
  gap?: number
}

const Carousel: React.FC<CarouselProps> = ({ items, itemWidth = 358, gap = 24 }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const cardsToShow = 3

  // Find the index of the live round and set it as initial index
  useEffect(() => {
    const liveIndex = items.findIndex(item => item.isLive)
    if (liveIndex !== -1) {
      setCurrentIndex(Math.max(0, Math.min(liveIndex - 1, items.length - cardsToShow)))
    }
  }, [items])

  const scroll = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentIndex(prev => Math.max(0, prev - 1))
    } else {
      setCurrentIndex(prev => Math.min(items.length - cardsToShow, prev + 1))
    }
  }

  // Calculate total width needed for container
  const containerWidth = (itemWidth * cardsToShow) + (gap * (cardsToShow - 1))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
      style={{ width: containerWidth, margin: '0 auto' }}
    >
      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-10 h-10 rounded-full bg-slate-800/80 text-white flex items-center justify-center hover:bg-slate-700/80 transition-colors backdrop-blur-sm border border-slate-700/50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {currentIndex < items.length - cardsToShow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-10 h-10 rounded-full bg-slate-800/80 text-white flex items-center justify-center hover:bg-slate-700/80 transition-colors backdrop-blur-sm border border-slate-700/50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Carousel Container */}
      <div 
        className="overflow-hidden py-8"
      >
        <motion.div 
          className="flex"
          style={{ 
            gap,
            transform: `translateX(-${currentIndex * (itemWidth + gap)}px)`,
            transition: 'transform 0.5s ease-out',
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              style={{ 
                width: itemWidth,
                flexShrink: 0,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <PredictionCard {...item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Carousel


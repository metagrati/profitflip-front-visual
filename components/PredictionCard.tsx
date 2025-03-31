"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, Clock, Users, Wallet, Bitcoin } from "lucide-react"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"
import { AnimatedCandleChart } from "./AnimatedCandleChart"

interface PredictionCardProps {
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

export const PredictionCard: React.FC<PredictionCardProps> = ({
  epoch,
  title,
  amount,
  currentPrice,
  players,
  timeLeft,
  isConnected,
  isLive,
  onConnect,
  onPredictUp,
  onPredictDown,
}) => {
  const [flipped, setFlipped] = useState(false)
  const [result, setResult] = useState<"up" | "down" | null>(null)
  const [remainingTime, setRemainingTime] = useState(convertTimeToSeconds(timeLeft))

  // Parse the time string (e.g., "3m") to seconds
  function convertTimeToSeconds(timeStr: string): number {
    const minutes = Number.parseInt(timeStr.replace("m", ""))
    return minutes * 60
  }

  // Format seconds to mm:ss
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Timer effect
  useEffect(() => {
    if (!isLive || remainingTime <= 0) return

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setResult(Math.random() > 0.5 ? "up" : "down")
          setTimeout(() => setFlipped(true), 500)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isLive, remainingTime])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      className="w-[358px] min-h-[520px] relative perspective-1000 mx-auto"
    >
      <motion.div
        className={cn(
          "w-full h-full transition-all duration-1000 transform-gpu preserve-3d",
          "relative",
          flipped ? "rotate-y-180" : ""
        )}
        style={{
          transformStyle: "preserve-3d",
          minHeight: "520px"
        }}
      >
        {/* Front of card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "w-full h-full absolute backface-hidden",
            "flex flex-col rounded-3xl p-5",
            "bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80",
            "border border-white/10",
            "shadow-[0_8px_16px_rgba(0,0,0,0.2)] backdrop-blur-md",
            "overflow-visible",
            isLive && "ring-1 ring-orange-500/30"
          )}
          style={{
            backfaceVisibility: "hidden",
            minHeight: "520px"
          }}
        >
          {/* Background chart */}
          <AnimatedCandleChart />

          {/* Floating animation for decorative elements */}
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              x: [0, 5, 0],
              rotate: [0, 2, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.15, 0.2, 0.15]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-0 left-1/4 w-48 h-48 bg-orange-500/20 rounded-full blur-[64px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.25, 0.15]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-[64px]" 
            />
          </motion.div>

          {/* Status badge with pulse animation */}
          {isLive && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 z-10"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.01, 1],
                  opacity: [1, 0.98, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className="relative px-8 py-[2px] w-[90px] bg-[#FF7A00] text-white rounded-full text-[11px] font-medium tracking-wider shadow-sm text-center">
                  <span className="relative flex items-center justify-center gap-[7px]">
                    <span className="flex h-1 w-1">
                      <span className="animate-ping absolute inline-flex h-1 w-1 rounded-full bg-white opacity-60"></span>
                      <span className="relative inline-flex rounded-full h-1 w-1 bg-white"></span>
                    </span>
                    LIVE
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}

          <div className="text-center mb-3 relative">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
            >
              {title}
            </motion.h2>
            {epoch !== null && (
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-400/80 mt-0.5"
              >
                Round #{epoch}
              </motion.h3>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 rounded-2xl p-3 mb-2 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400/80">Current Price</span>
              <Bitcoin className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-white/90">${currentPrice}</div>
          </motion.div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 rounded-2xl p-3 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400/80">Minimal Bet</span>
                <Wallet className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
              </div>
              <div className="text-sm font-bold text-white/90">{amount} POL</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 rounded-2xl p-3 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400/80">Players</span>
                <Users className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
              </div>
              <div className="text-sm font-bold text-white/90">{players}</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 rounded-2xl p-3 mb-auto backdrop-blur-md border border-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400/80">Time Left</span>
              <Clock className="w-4 h-4 text-green-400 group-hover:text-green-300 transition-colors" />
            </div>
            <div className="text-xl font-bold text-green-400/90 group-hover:text-green-300/90 transition-colors">
              {isLive ? formatTime(remainingTime) : timeLeft}
            </div>
            {isLive && remainingTime > 0 && (
              <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: `${(remainingTime / (3 * 60)) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-3"
          >
            {!isConnected ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConnect}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg backdrop-blur-sm"
              >
                <Wallet className="w-5 h-5" />
                <span className="font-medium">Connect Wallet</span>
              </motion.button>
            ) : isLive && !flipped ? (
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onPredictDown}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                    <ArrowDown className="w-5 h-5" />
                    DOWN
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onPredictUp}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                    <ArrowUp className="w-5 h-5" />
                    UP
                  </div>
                </motion.button>
              </div>
            ) : (
              <div className="text-center bg-white/5 py-3.5 px-4 rounded-xl border border-white/10 backdrop-blur-md">
                <span className="flex items-center justify-center gap-2 text-gray-300/90">
                  <Clock className="w-4 h-4 text-gray-400/90" />
                  {epoch && epoch < (isLive ? Number.POSITIVE_INFINITY : 0)
                    ? "Round Closed"
                    : "Round Not Started"}
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Back of card with enhanced animations */}
        {flipped && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "w-full h-full absolute backface-hidden rotate-y-180",
              "flex flex-col items-center justify-center rounded-3xl p-6",
              "bg-gradient-to-br",
              result === "up"
                ? "from-green-900/95 via-green-800/90 to-green-900/95"
                : "from-red-900/95 via-red-800/90 to-red-900/95",
              "border border-white/10",
              "shadow-2xl backdrop-blur-lg",
              "transform-gpu"
            )}
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            {/* Animated background effects */}
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                  rotate: [0, 45, 0]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-0 left-1/4 w-48 h-48 bg-gradient-radial from-white/10 to-transparent rounded-full blur-[100px]" 
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.1, 0.15, 0.1],
                  rotate: [0, -45, 0]
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-radial from-white/10 to-transparent rounded-full blur-[100px]" 
              />
            </motion.div>

            {/* Result content with enhanced animations */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.3,
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
              className="flex flex-col items-center relative w-full"
            >
              {/* Enhanced result icon animation */}
              <motion.div
                initial={{ scale: 0.8, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.5,
                  duration: 1.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                className="relative mb-8"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={cn(
                    "absolute inset-0 rounded-full blur-[32px]",
                    result === "up" ? "bg-green-500/30" : "bg-red-500/30"
                  )} 
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "w-32 h-32 rounded-full flex items-center justify-center relative",
                    "border-2 backdrop-blur-sm",
                    result === "up" 
                      ? "bg-green-500/10 border-green-400/50" 
                      : "bg-red-500/10 border-red-400/50"
                  )}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -3, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {result === "up" ? (
                      <ArrowUp className="w-16 h-16 text-white/90" />
                    ) : (
                      <ArrowDown className="w-16 h-16 text-white/90" />
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Enhanced price animation */}
              <motion.p 
                className="text-3xl font-bold text-white/90 mb-8"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: [0, -2, 0]
                }}
                transition={{ 
                  delay: 0.9,
                  y: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                ${(Number.parseFloat(currentPrice) * (result === "up" ? 1.02 : 0.98)).toFixed(2)}
              </motion.p>

              {/* Enhanced back button */}
              <motion.button
                whileHover={{ 
                  scale: 1.02, 
                  backgroundColor: "rgba(255,255,255,0.15)",
                  y: -2
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 1,
                  duration: 0.3
                }}
                onClick={() => setFlipped(false)}
                className="px-8 py-3 bg-white/10 text-white/90 rounded-xl transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/10 font-medium"
              >
                Back to Card
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}


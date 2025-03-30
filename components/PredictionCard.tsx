"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, Clock, Users, Wallet, Bitcoin } from "lucide-react"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"

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
    <div className="w-[358px] h-[500px] relative">
      <motion.div
        className={cn(
          "w-full h-full transition-all duration-700 transform-gpu",
          flipped ? "rotate-y-180" : ""
        )}
      >
        {/* Front of card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "w-full h-full absolute",
            "flex flex-col rounded-3xl p-6",
            "bg-gradient-to-br from-slate-800 to-slate-900",
            "border border-slate-700/50",
            "shadow-xl",
            isLive && "ring-2 ring-orange-500"
          )}
        >
          {/* Status badge */}
          {isLive && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
              LIVE
            </div>
          )}

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white">
              {title}
            </h2>
            {epoch !== null && (
              <h3 className="text-sm text-gray-400 mt-1">Round #{epoch}</h3>
            )}
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Current Price</span>
              <Bitcoin className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-white">${currentPrice}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Minimal Bet</span>
                <Wallet className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-sm font-bold text-white">{amount} POL</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Players</span>
                <Users className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-sm font-bold text-white">{players}</div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Time Left</span>
              <Clock className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-xl font-bold text-green-400">
              {isLive ? formatTime(remainingTime) : timeLeft}
            </div>
            {isLive && remainingTime > 0 && (
              <div className="w-full h-1 bg-slate-700 rounded-full mt-2">
                <motion.div
                  className="h-full bg-green-500 rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: `${(remainingTime / (3 * 60)) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            )}
          </div>

          {!isConnected ? (
            <button
              onClick={onConnect}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Wallet className="w-5 h-5" />
              <span className="font-semibold">Connect Wallet</span>
            </button>
          ) : isLive ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onPredictDown}
                className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowDown className="w-5 h-5" />
                DOWN
              </button>
              <button
                onClick={onPredictUp}
                className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowUp className="w-5 h-5" />
                UP
              </button>
            </div>
          ) : (
            <div className="text-center bg-slate-800/50 py-3 rounded-xl text-gray-400">
              {epoch && epoch < (isLive ? Number.POSITIVE_INFINITY : 0)
                ? "Round Closed"
                : "Round Not Started"}
            </div>
          )}
        </motion.div>

        {/* Back of card (Result) */}
        {flipped && (
          <div
            className={cn(
              "w-full h-full absolute rotate-y-180",
              "flex flex-col items-center justify-center rounded-3xl p-6",
              "bg-gradient-to-br",
              result === "up"
                ? "from-green-900 to-green-800"
                : "from-red-900 to-red-800",
              "border border-slate-700/50 shadow-xl"
            )}
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white">Round #{epoch} Result</h2>
            </div>

            <div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mb-6",
                result === "up" ? "bg-green-500" : "bg-red-500"
              )}
            >
              {result === "up" ? (
                <ArrowUp className="w-10 h-10 text-white" />
              ) : (
                <ArrowDown className="w-10 h-10 text-white" />
              )}
            </div>

            <h3 className={cn(
              "text-3xl font-bold mb-2",
              result === "up" ? "text-green-300" : "text-red-300"
            )}>
              {result === "up" ? "UP" : "DOWN"}
            </h3>

            <p className="text-gray-300 text-sm mb-1">
              Price {result === "up" ? "increased" : "decreased"} to
            </p>

            <p className="text-xl font-bold text-white mb-6">
              ${(Number.parseFloat(currentPrice) * (result === "up" ? 1.02 : 0.98)).toFixed(2)}
            </p>

            <button
              onClick={() => setFlipped(false)}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
              Back to Card
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}


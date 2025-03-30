"use client"

import type React from "react"
import { useMemo } from "react"
import { ArrowDown, ArrowUp, Clock, CheckCircle, XCircle, Award, Wallet } from "lucide-react"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"

interface UserBet {
  epoch: number
  position: "Bull" | "Bear"
  amount: string
  claimed: boolean
  result: "Win" | "Lose" | "Pending"
}

interface UserBetHistoryProps {
  bets: UserBet[]
  loading?: boolean
  onClaimRewards?: (epochs: number[]) => Promise<void>
}

export const UserBetHistory: React.FC<UserBetHistoryProps> = ({ bets, loading = false, onClaimRewards }) => {
  // Sort bets by epoch number in descending order (most recent first)
  const sortedBets = [...bets].sort((a, b) => b.epoch - a.epoch)
  const unclaimedWins = sortedBets.filter(bet => bet.result === "Win" && !bet.claimed)

  const handleClaimAll = async () => {
    if (onClaimRewards && unclaimedWins.length > 0) {
      const epochs = unclaimedWins.map((bet) => bet.epoch)
      await onClaimRewards(epochs)
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-[#1a2b4b]/80 backdrop-blur-sm rounded-3xl shadow-2xl max-w-3xl mx-auto animate-pulse border border-[rgba(255,255,255,0.1)]"
      >
        <div className="h-8 bg-[rgba(255,255,255,0.1)] rounded-full w-48 mb-8"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-[rgba(255,255,255,0.05)] rounded-2xl mb-4"></div>
        ))}
      </motion.div>
    )
  }

  if (bets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-[#1a2b4b]/80 backdrop-blur-sm rounded-3xl shadow-2xl max-w-3xl mx-auto text-center border border-[rgba(255,255,255,0.1)]"
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent mb-6">
          Your Bet History
        </h3>
        <div className="py-12 flex flex-col items-center">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <Wallet className="w-16 h-16 text-amber-400 mb-4" />
          </motion.div>
          <p className="text-gray-300 text-lg">You haven't placed any bets yet.</p>
          <p className="mt-2 text-gray-400">Connect your wallet and place a prediction to get started!</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-5 bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-2xl max-w-3xl mx-auto border border-white/5 mt-16 overflow-hidden"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-orange-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-base font-medium bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
          >
            Your Bet History
          </motion.h3>

          {unclaimedWins.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div
                onClick={handleClaimAll}
                className="relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-medium rounded-xl transition-all shadow-lg border border-orange-400/20 backdrop-blur-sm"
              >
                <Award className="w-3.5 h-3.5" />
                Claim {unclaimedWins.length > 1 ? `(${unclaimedWins.length})` : ""}
              </div>
            </motion.button>
          )}
        </div>

        <motion.div
          className="space-y-2"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {sortedBets.map((bet, index) => (
            <BetHistoryItem 
              key={bet.epoch} 
              bet={bet} 
              index={index}
              totalBets={sortedBets.length}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

const BetHistoryItem: React.FC<{
  bet: UserBet
  index: number
  totalBets: number
}> = ({ bet, index, totalBets }) => {
  const resultColors = {
    Win: "border-green-400/10 bg-green-500/5 hover:bg-green-500/10 hover:border-green-400/20",
    Lose: "border-red-400/10 bg-red-500/5 hover:bg-red-500/10 hover:border-red-400/20",
    Pending: "border-orange-400/10 bg-orange-500/5 hover:bg-orange-500/10 hover:border-orange-400/20",
  }

  // A bet is live only if it's the most recent (highest epoch number)
  const isLive = index === 0 && bet.result === "Pending"
  const displayResult = isLive ? "Pending" : bet.result

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 5 },
        show: { opacity: 1, y: 0 }
      }}
      className={cn(
        "py-2.5 px-4 rounded-2xl border backdrop-blur-sm flex items-center justify-between gap-3",
        "transition-all duration-200",
        resultColors[displayResult],
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center",
            "bg-slate-900/50 shadow-sm backdrop-blur-sm border",
            bet.position === "Bull" 
              ? "border-green-400/20 bg-green-500/5" 
              : "border-red-400/20 bg-red-500/5",
          )}
        >
          {bet.position === "Bull" ? (
            <ArrowUp className="w-4 h-4 text-green-400" />
          ) : (
            <ArrowDown className="w-4 h-4 text-red-400" />
          )}
        </div>
        <div className="flex gap-3 items-center">
          <div className="font-medium text-sm text-white/90">#{bet.epoch}</div>
          <div className="text-xs text-gray-400/90 flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg backdrop-blur-sm">
            <Wallet className="w-3.5 h-3.5" /> {bet.amount}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className={cn(
          "px-3 py-1 rounded-xl text-xs font-medium",
          "shadow-sm backdrop-blur-sm border",
          displayResult === "Win"
            ? "border-green-400/20 text-green-400 bg-green-500/5"
            : displayResult === "Lose"
              ? "border-red-400/20 text-red-400 bg-red-500/5"
              : "border-orange-400/20 text-orange-400 bg-orange-500/5",
        )}>
          {displayResult === "Pending" ? (
            <span className="flex items-center gap-1.5">
              <span className="flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-orange-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-400"></span>
              </span>
              Live
            </span>
          ) : (
            displayResult
          )}
        </div>

        {displayResult === "Win" && (
          <div className="text-[10px] font-medium">
            {bet.claimed ? (
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/5 border border-green-400/20 text-green-400/90 backdrop-blur-sm">
                <CheckCircle className="w-3 h-3" /> Claimed
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/5 border border-amber-400/20 text-amber-400/90 backdrop-blur-sm">
                <Award className="w-3 h-3" /> Unclaimed
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default UserBetHistory


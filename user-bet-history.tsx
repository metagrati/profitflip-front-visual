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

const UserBetHistory: React.FC<UserBetHistoryProps> = ({ bets, loading = false, onClaimRewards }) => {
  // Calculate unclaimed wins
  const unclaimedWins = useMemo(() => {
    return bets.filter((bet) => bet.result === "Win" && !bet.claimed)
  }, [bets])

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
      className="p-8 bg-[#1a2b4b]/80 backdrop-blur-sm rounded-3xl shadow-2xl max-w-3xl mx-auto border border-[rgba(255,255,255,0.1)]"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
          Your Bet History
        </h3>

        {unclaimedWins.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClaimAll}
            className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-md"
          >
            <Award className="w-4 h-4" />
            Claim {unclaimedWins.length > 1 ? `(${unclaimedWins.length})` : ""}
          </motion.button>
        )}
      </div>

      <motion.div
        className="space-y-4"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {bets.map((bet, index) => (
          <BetHistoryItem key={bet.epoch} bet={bet} index={index} />
        ))}
      </motion.div>
    </motion.div>
  )
}

const BetHistoryItem: React.FC<{
  bet: UserBet
  index: number
}> = ({ bet, index }) => {
  const resultColors = {
    Win: "bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.2)] text-green-300",
    Lose: "bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)] text-red-300",
    Pending: "bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.2)] text-amber-300",
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "p-5 rounded-2xl border backdrop-blur-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
        "transition-all duration-300 hover:shadow-md",
        resultColors[bet.result],
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
            "bg-[rgba(255,255,255,0.05)] shadow-md border-2",
            bet.position === "Bull" ? "border-green-500" : "border-orange-500",
          )}
        >
          {bet.position === "Bull" ? (
            <ArrowUp className={cn("w-6 h-6 text-green-500")} />
          ) : (
            <ArrowDown className={cn("w-6 h-6 text-orange-500")} />
          )}
        </div>
        <div>
          <div className="font-bold text-lg text-white">Round #{bet.epoch}</div>
          <div className="text-sm text-gray-300 flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5" /> {bet.amount} POL
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium",
            "shadow-md backdrop-blur-sm",
            bet.result === "Win"
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : bet.result === "Lose"
                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30",
          )}
        >
          {bet.result === "Pending" ? (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Pending
            </span>
          ) : (
            bet.result
          )}
        </motion.div>

        {bet.result === "Win" && (
          <div className="flex items-center gap-1 text-sm">
            {bet.claimed ? (
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 text-green-300 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20"
              >
                <CheckCircle className="w-4 h-4" /> Claimed
              </motion.span>
            ) : (
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20"
              >
                <Award className="w-4 h-4" /> Unclaimed
              </motion.span>
            )}
          </div>
        )}

        {bet.result === "Lose" && (
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 text-sm text-red-300 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20"
          >
            <XCircle className="w-4 h-4" /> No Reward
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}

export default UserBetHistory


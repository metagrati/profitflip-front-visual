"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import UserBetHistory from "./user-bet-history"
import { ethers } from "ethers"
import Carousel from "./components/Carousel"
import Image from "next/image"
import { motion } from "framer-motion"
import CryptoParticles from "./components/CryptoParticles"

// Mock implementation of usePredictionGame hook for preview purposes
const usePredictionGame = () => {
  const [userRounds, setUserRounds] = useState([
    {
      epoch: 123,
      position: "Bull" as const,
      amount: "0.1",
      claimed: false,
      result: "Win" as const,
    },
    {
      epoch: 122,
      position: "Bear" as const,
      amount: "0.2",
      claimed: true,
      result: "Win" as const,
    },
    {
      epoch: 121,
      position: "Bull" as const,
      amount: "0.15",
      claimed: false,
      result: "Win" as const,
    },
    {
      epoch: 120,
      position: "Bear" as const,
      amount: "0.05",
      claimed: false,
      result: "Pending" as const,
    },
  ])

  return {
    epoch: 124,
    price: "30000.00",
    minBet: "0.01",
    paused: false,
    placeBet: async ({ direction, amountEth }: { direction: "bull" | "bear"; amountEth: string }) => {
      console.log(`Placing bet: ${direction}, amount: ${amountEth}`)
      // Mock implementation
    },
    refreshGameState: async () => {
      console.log("Refreshing game state")
      // Mock implementation
    },
    roundsData: {
      122: { lockPrice: ethers.parseUnits("30000", 8) },
      123: { lockPrice: ethers.parseUnits("31000", 8) },
      124: { lockPrice: ethers.parseUnits("32000", 8) },
      125: { lockPrice: ethers.parseUnits("33000", 8) },
    },
    userRounds,
    refreshUserRounds: async () => {
      console.log("Refreshing user rounds")
      // Mock implementation
    },
    userRoundsLoading: false,
    claimRewards: async (epochs: number[]) => {
      console.log(`Claiming rewards for epochs: ${epochs.join(", ")}`)
      // Mock implementation - update the claimed status
      setUserRounds((prev) => prev.map((round) => (epochs.includes(round.epoch) ? { ...round, claimed: true } : round)))
    },
  }
}

const App: React.FC = () => {
  // Mock the isConnected state instead of using useAccount
  const [isConnected, setIsConnected] = useState(true)
  const [claimingRewards, setClaimingRewards] = useState(false)

  const {
    epoch,
    price,
    minBet,
    paused,
    placeBet,
    refreshGameState,
    roundsData,
    userRounds,
    refreshUserRounds,
    userRoundsLoading,
    claimRewards,
  } = usePredictionGame()

  useEffect(() => {
    refreshGameState()
    refreshUserRounds()

    const interval = setInterval(() => {
      refreshGameState()
      refreshUserRounds()
    }, 15000)

    return () => clearInterval(interval)
  }, [refreshGameState, refreshUserRounds])

  const handlePredict = async (direction: "bull" | "bear") => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    try {
      await placeBet({ direction, amountEth: minBet })
      toast.success(`Bet placed on ${direction.toUpperCase()}`)
      refreshGameState()
      refreshUserRounds()
    } catch (error) {
      toast.error("Failed to place bet")
      console.error(error)
    }
  }

  const handleClaimRewards = async (epochs: number[]) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    try {
      setClaimingRewards(true)
      // Call the contract's claim function with all epochs
      await claimRewards(epochs)

      toast.success(`Claimed rewards for ${epochs.length} round${epochs.length > 1 ? "s" : ""}`)
      refreshUserRounds()
    } catch (error) {
      toast.error("Failed to claim rewards")
      console.error(error)
    } finally {
      setClaimingRewards(false)
    }
  }

  const handleConnect = () => {
    setIsConnected(true)
    toast.success("Wallet connected successfully!")
  }

  const carouselItems = useMemo(() => {
    if (!epoch) return []

    const epochs = [epoch - 2, epoch - 1, epoch, epoch + 1]

    return epochs
      .filter((ep) => roundsData[ep])
      .map((ep) => ({
        id: ep,
        epoch: ep,
        title: "BTC/USD",
        amount: minBet,
        currentPrice: roundsData[ep]?.lockPrice
          ? Number(ethers.formatUnits(roundsData[ep]?.lockPrice, 8)).toFixed(2)
          : "0.00",
        players: "128", // dynamically fetch if you have it
        timeLeft: "3m", // dynamically calculate if you have it
        isConnected,
        isLive: ep === epoch, // Add this line to identify the live card
        onConnect: handleConnect,
        onPredictUp: () => handlePredict("bull"),
        onPredictDown: () => handlePredict("bear"),
      }))
  }, [epoch, roundsData, minBet, isConnected])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1a2b4b] to-[#0f172a] flex flex-col items-center justify-center p-6 gap-10">
      {/* Background animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/80 via-[#1a2b4b]/80 to-[#0f172a]/80 z-0"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <CryptoParticles />
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center mb-12"
        >
          <motion.div
            className="relative w-72 h-72"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 rounded-full filter blur-3xl opacity-30 bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 animate-pulse-slow"></div>

            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled_design__2_-removebg-preview-Y9DvPNFlOTJNwPXJQ7aTOMTOn9KBHC.png"
              alt="ProfitFlip Logo"
              width={300}
              height={300}
              className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        <Carousel items={carouselItems} />

        <div className="mt-16">
          <UserBetHistory bets={userRounds} loading={userRoundsLoading} onClaimRewards={handleClaimRewards} />
        </div>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1a2b4b",
            color: "#fff",
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#FFFFFF",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FFFFFF",
            },
          },
        }}
      />
    </div>
  )
}

export default App


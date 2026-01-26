"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800">
      {/* Navbar */}
      <nav className="border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-500">
                Trade Signal
              </h1>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Decentralized Trading Signals
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Buy and sell trading signals on Ethereum. Build your reputation as a
            trader and earn from your market insights.
          </p>

          {!isConnected && (
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          )}
        </div>

        {/* Feature Cards */}
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {/* Create Signal Card */}
            <Link href="/create">
              <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 hover:border-primary-500 transition-colors cursor-pointer">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Create Signal
                </h3>
                <p className="text-gray-400">
                  Share your market insights and earn from successful
                  predictions
                </p>
              </div>
            </Link>

            {/* Browse Signals Card */}
            <Link href="/browse">
              <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 hover:border-primary-500 transition-colors cursor-pointer">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Browse Signals
                </h3>
                <p className="text-gray-400">
                  Discover trading signals from verified traders
                </p>
              </div>
            </Link>

            {/* My Signals Card */}
            <Link href="/my-signals">
              <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 hover:border-primary-500 transition-colors cursor-pointer">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  My Signals
                </h3>
                <p className="text-gray-400">
                  View your created signals and track performance
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* How it Works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Create Signal
              </h3>
              <p className="text-gray-400">
                Predict price movements and set your analysis fee
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Users Buy Access
              </h3>
              <p className="text-gray-400">
                Traders purchase your signal to view full analysis
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Build Reputation
              </h3>
              <p className="text-gray-400">
                Accurate predictions increase your trader reputation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

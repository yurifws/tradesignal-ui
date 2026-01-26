"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navbar */}
      <nav className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold text-white">
            Trade Signal
          </Link>
          <ConnectButton />
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Trade Signal</h1>
        <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
          Decentralized marketplace for trading signals on Ethereum
        </p>

        {!isConnected ? (
          <ConnectButton />
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Connected</span>
          </div>
        )}
      </div>

      {/* Cards */}
      {isConnected && (
        <div className="max-w-4xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/create">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                <h3 className="text-base font-semibold text-white mb-2">
                  Create Signal
                </h3>
                <p className="text-sm text-gray-400">Share market insights</p>
              </div>
            </Link>

            <Link href="/browse">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                <h3 className="text-base font-semibold text-white mb-2">
                  Browse Signals
                </h3>
                <p className="text-sm text-gray-400">Discover signals</p>
              </div>
            </Link>

            <Link href="/my-signals">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                <h3 className="text-base font-semibold text-white mb-2">
                  My Signals
                </h3>
                <p className="text-sm text-gray-400">View created signals</p>
              </div>
            </Link>

            <Link href="/purchased">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                <h3 className="text-base font-semibold text-white mb-2">
                  Purchased
                </h3>
                <p className="text-sm text-gray-400">View purchased signals</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 py-12 border-t border-gray-800">
        <div className="grid md:grid-cols-3 gap-8 text-center text-sm">
          <div>
            <div className="text-2xl font-bold text-white mb-1">100%</div>
            <div className="text-gray-400">Decentralized</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">5%</div>
            <div className="text-gray-400">Protocol Fee</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">∞</div>
            <div className="text-gray-400">Earning Potential</div>
          </div>
        </div>
      </div>
    </div>
  );
}

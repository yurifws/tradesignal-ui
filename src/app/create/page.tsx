"use client";

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import Link from "next/link";

export default function CreateSignal() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Form state
  const [asset, setAsset] = useState("ETH");
  const [targetPrice, setTargetPrice] = useState("");
  const [deadline, setDeadline] = useState("");
  const [direction, setDirection] = useState(0); // 0 = Bullish, 1 = Bearish
  const [fee, setFee] = useState("");
  const [analysis, setAnalysis] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      // Convert deadline to Unix timestamp
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);

      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "createSignal",
        args: [
          asset,
          BigInt(targetPrice),
          BigInt(deadlineTimestamp),
          direction,
          parseEther(fee),
          analysis,
        ],
        value: parseEther("0.001"), // Listing fee
      });
    } catch (error) {
      console.error("Error creating signal:", error);
      alert("Error creating signal. Check console for details.");
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Please connect your wallet to create signals
          </h2>
          <Link href="/" className="text-primary-500 hover:text-primary-400">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Signal Created Successfully!
          </h2>
          <p className="text-gray-400 mb-6">
            Transaction hash: {hash?.slice(0, 10)}...{hash?.slice(-8)}
          </p>
          <div className="space-x-4">
            <Link
              href="/browse"
              className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600"
            >
              Browse Signals
            </Link>
            <Link
              href="/my-signals"
              className="inline-block bg-dark-700 text-white px-6 py-3 rounded-lg hover:bg-dark-600"
            >
              My Signals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navbar */}
      <nav className="border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-500">
              Trade Signal
            </Link>
            <div className="text-gray-400">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
          </div>
        </div>
      </nav>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">
          Create Trading Signal
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Asset
            </label>
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="ETH">ETH</option>
            </select>
          </div>

          {/* Target Price */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Price (USD)
            </label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="e.g., 3500"
              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deadline
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Direction */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Direction
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDirection(0)}
                className={`py-3 rounded-lg font-semibold transition-colors ${
                  direction === 0
                    ? "bg-green-600 text-white"
                    : "bg-dark-800 text-gray-400 hover:bg-dark-700"
                }`}
              >
                📈 Bullish
              </button>
              <button
                type="button"
                onClick={() => setDirection(1)}
                className={`py-3 rounded-lg font-semibold transition-colors ${
                  direction === 1
                    ? "bg-red-600 text-white"
                    : "bg-dark-800 text-gray-400 hover:bg-dark-700"
                }`}
              >
                📉 Bearish
              </button>
            </div>
          </div>

          {/* Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Signal Fee (ETH)
            </label>
            <input
              type="number"
              step="0.001"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="e.g., 0.05"
              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              How much users pay to see your analysis
            </p>
          </div>

          {/* Analysis */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Analysis (Private)
            </label>
            <textarea
              value={analysis}
              onChange={(e) => setAnalysis(e.target.value)}
              placeholder="Your detailed market analysis... (only visible to buyers)"
              rows={6}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Info Box */}
          <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
            <p className="text-sm text-primary-300">
              💡 <strong>Listing Fee:</strong> 0.001 ETH will be charged to
              create this signal
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending || isConfirming}
            className="w-full bg-primary-500 text-white py-4 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending && "Waiting for approval..."}
            {isConfirming && "Creating signal..."}
            {!isPending && !isConfirming && "Create Signal"}
          </button>
        </form>
      </div>
    </div>
  );
}

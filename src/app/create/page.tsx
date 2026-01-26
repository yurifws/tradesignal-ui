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

  const [asset, setAsset] = useState("ETH");
  const [targetPrice, setTargetPrice] = useState("");
  const [deadline, setDeadline] = useState("");
  const [direction, setDirection] = useState(0);
  const [fee, setFee] = useState("");
  const [analysis, setAnalysis] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
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
        value: parseEther("0.001"),
      });
    } catch (error) {
      console.error("Error creating signal:", error);
      alert("Error creating signal. Check console for details.");
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">
            Wallet Required
          </h2>
          <p className="text-gray-400 mb-6">
            Connect your wallet to create signals
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-white mb-4">Signal Created</h2>
          <p className="text-gray-400 mb-2">Transaction successful</p>
          <p className="text-sm text-gray-500 mb-8 font-mono">
            {hash?.slice(0, 10)}...{hash?.slice(-8)}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/browse"
              className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
            >
              Browse Signals
            </Link>
            <Link
              href="/my-signals"
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
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
      <nav className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold text-white">
            Trade Signal
          </Link>
          <div className="text-sm text-gray-400">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Create Signal</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Asset
            </label>
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white"
              required
            >
              <option value="ETH">ETH</option>
            </select>
          </div>

          {/* Target Price & Deadline */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Price (USD)
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="3500"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deadline
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white"
                required
              />
            </div>
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
                className={`py-3 rounded-lg font-semibold ${
                  direction === 0
                    ? "bg-green-600 text-white"
                    : "bg-gray-900 border border-gray-800 text-gray-400"
                }`}
              >
                Bullish
              </button>
              <button
                type="button"
                onClick={() => setDirection(1)}
                className={`py-3 rounded-lg font-semibold ${
                  direction === 1
                    ? "bg-red-600 text-white"
                    : "bg-gray-900 border border-gray-800 text-gray-400"
                }`}
              >
                Bearish
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
              placeholder="0.05"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Users pay this to access your analysis
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
              placeholder="Your detailed analysis..."
              rows={6}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white resize-none"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Only visible to buyers</p>
          </div>

          {/* Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400">
              Listing fee:{" "}
              <span className="text-white font-semibold">0.001 ETH</span>
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending || isConfirming}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

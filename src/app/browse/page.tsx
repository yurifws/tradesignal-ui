"use client";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import Link from "next/link";

export default function BrowseSignals() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Get total number of signals
  const { data: nextSignalId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "nextSignalId",
  });

  const handleBuySignal = async (signalId: number, fee: bigint) => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "purchaseSignal",
        args: [BigInt(signalId)],
        value: fee,
      });
    } catch (error) {
      console.error("Error buying signal:", error);
      alert("Error buying signal. Check console for details.");
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Please connect your wallet to browse signals
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
            Signal Purchased Successfully!
          </h2>
          <p className="text-gray-400 mb-6">
            You can now view the full analysis
          </p>
          <Link
            href="/my-signals"
            className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600"
          >
            View My Signals
          </Link>
        </div>
      </div>
    );
  }

  const totalSignals = nextSignalId ? Number(nextSignalId) : 0;

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

      {/* Signals List */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">
          Browse Trading Signals
        </h1>

        {totalSignals === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No signals created yet</p>
            <Link
              href="/create"
              className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600"
            >
              Create First Signal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: totalSignals }, (_, i) => (
              <SignalCard
                key={i}
                signalId={i}
                onBuy={handleBuySignal}
                isPending={isPending || isConfirming}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SignalCard({
  signalId,
  onBuy,
  isPending,
}: {
  signalId: number;
  onBuy: (id: number, fee: bigint) => void;
  isPending: boolean;
}) {
  const { data: signal } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "signals",
    args: [BigInt(signalId)],
  });

  if (!signal || signal[2] !== 0) return null; // Skip if not active (status !== 0)

  const [
    trader,
    direction,
    status,
    isCorrect,
    id,
    targetPrice,
    deadline,
    fee,
    asset,
  ] = signal;

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 hover:border-primary-500 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{asset}</h3>
          <p className="text-sm text-gray-400">Signal #{signalId}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            direction === 0
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {direction === 0 ? "📈 Bullish" : "📉 Bearish"}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Target Price:</span>
          <span className="text-white font-semibold">
            ${targetPrice.toString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Deadline:</span>
          <span className="text-white">
            {new Date(Number(deadline) * 1000).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Fee:</span>
          <span className="text-white font-semibold">
            {formatEther(fee)} ETH
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Trader:</span>
          <span className="text-white text-sm">
            {trader.slice(0, 6)}...{trader.slice(-4)}
          </span>
        </div>
      </div>

      <button
        onClick={() => onBuy(signalId, fee)}
        disabled={isPending}
        className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Processing..." : "Buy Signal"}
      </button>
    </div>
  );
}

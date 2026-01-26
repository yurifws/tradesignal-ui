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
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">
            Wallet Required
          </h2>
          <p className="text-gray-400 mb-6">
            Connect your wallet to browse signals
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
          <h2 className="text-3xl font-bold text-white mb-4">
            Signal Purchased
          </h2>
          <p className="text-gray-400 mb-8">
            You now have access to the analysis
          </p>
          <Link
            href="/my-signals"
            className="inline-block px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
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

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Browse Signals</h1>

        {totalSignals === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-6">No signals available</p>
            <Link
              href="/create"
              className="inline-block px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
            >
              Create First Signal
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
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
  const { data: signal, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "signals",
    args: [BigInt(signalId)],
  });

  if (isLoading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-800 rounded w-3/4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2"></div>
          <div className="h-4 bg-gray-800 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!signal || signal[2] !== 0) return null;

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
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{asset}</h3>
          <p className="text-sm text-gray-500">#{signalId}</p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            direction === 0
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {direction === 0 ? "Bullish" : "Bearish"}
        </span>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Target</span>
          <span className="text-white">${targetPrice.toString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Deadline</span>
          <span className="text-white">
            {new Date(Number(deadline) * 1000).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Fee</span>
          <span className="text-white">{formatEther(fee)} ETH</span>
        </div>
      </div>

      <button
        onClick={() => onBuy(signalId, fee)}
        disabled={isPending}
        className="w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50 text-sm"
      >
        {isPending ? "Processing..." : "Buy Signal"}
      </button>
    </div>
  );
}

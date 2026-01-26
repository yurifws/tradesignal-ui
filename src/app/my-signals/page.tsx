"use client";

import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import Link from "next/link";

export default function MySignals() {
  const { address, isConnected } = useAccount();

  // Get trader stats
  const { data: stats } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "traderStats",
    args: address ? [address] : undefined,
  });

  // Get total signals
  const { data: nextSignalId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "nextSignalId",
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Please connect your wallet
          </h2>
          <Link href="/" className="text-primary-500 hover:text-primary-400">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const totalSignals = stats ? Number(stats[0]) : 0;
  const correctSignals = stats ? Number(stats[1]) : 0;
  const accuracy =
    totalSignals > 0 ? ((correctSignals / totalSignals) * 100).toFixed(1) : "0";
  const totalCount = nextSignalId ? Number(nextSignalId) : 0;

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

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">My Signals</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Signals</p>
            <p className="text-4xl font-bold text-white">{totalSignals}</p>
          </div>
          <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Correct Predictions</p>
            <p className="text-4xl font-bold text-green-500">
              {correctSignals}
            </p>
          </div>
          <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Accuracy</p>
            <p className="text-4xl font-bold text-primary-500">{accuracy}%</p>
          </div>
        </div>

        {/* My Created Signals */}
        <h2 className="text-2xl font-bold text-white mb-6">
          My Created Signals
        </h2>

        {totalSignals === 0 ? (
          <div className="text-center py-12 bg-dark-800 border border-dark-700 rounded-lg mb-12">
            <p className="text-gray-400 text-lg mb-4">
              You haven't created any signals yet
            </p>
            <Link
              href="/create"
              className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600"
            >
              Create Your First Signal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Array.from({ length: totalCount }, (_, i) => (
              <MySignalCard key={i} signalId={i} myAddress={address!} />
            ))}
          </div>
        )}

        {/* Purchased Signals */}
        <h2 className="text-2xl font-bold text-white mb-6">
          Purchased Signals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: totalCount }, (_, i) => (
            <PurchasedSignalCard key={i} signalId={i} myAddress={address!} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Component for signals created by the user
function MySignalCard({
  signalId,
  myAddress,
}: {
  signalId: number;
  myAddress: string;
}) {
  const { data: signal } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "signals",
    args: [BigInt(signalId)],
  });

  if (!signal || signal[0].toLowerCase() !== myAddress.toLowerCase())
    return null;

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

  const statusText = ["Active", "Resolved", "Expired", "Cancelled"][
    status as number
  ];
  const statusColor =
    status === 0
      ? "text-green-500"
      : status === 1
        ? "text-blue-500"
        : "text-gray-500";

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{asset}</h3>
          <p className="text-sm text-gray-400">Signal #{signalId}</p>
        </div>
        <span className={`text-sm font-semibold ${statusColor}`}>
          {statusText}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Direction:</span>
          <span className={direction === 0 ? "text-green-500" : "text-red-500"}>
            {direction === 0 ? "📈 Bullish" : "📉 Bearish"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Target:</span>
          <span className="text-white">${targetPrice.toString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Fee:</span>
          <span className="text-white">{formatEther(fee)} ETH</span>
        </div>
        {status === 1 && (
          <div className="flex justify-between">
            <span className="text-gray-400">Result:</span>
            <span className={isCorrect ? "text-green-500" : "text-red-500"}>
              {isCorrect ? "✅ Correct" : "❌ Incorrect"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Component for signals purchased by the user
function PurchasedSignalCard({
  signalId,
  myAddress,
}: {
  signalId: number;
  myAddress: string;
}) {
  const { data: hasAccess } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "signalAccess",
    args: [BigInt(signalId), myAddress],
  });

  const { data: signal } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "signals",
    args: [BigInt(signalId)],
  });

  const { data: analysis } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getSignalAnalysis",
    args: [BigInt(signalId)],
    query: {
      enabled: hasAccess === true,
    },
  });

  if (!hasAccess || !signal) return null;

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
    <div className="bg-dark-800 border border-primary-500/50 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{asset}</h3>
          <p className="text-sm text-gray-400">Signal #{signalId}</p>
        </div>
        <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded">
          PURCHASED
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Direction:</span>
          <span className={direction === 0 ? "text-green-500" : "text-red-500"}>
            {direction === 0 ? "📈 Bullish" : "📉 Bearish"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Target:</span>
          <span className="text-white">${targetPrice.toString()}</span>
        </div>
      </div>

      {analysis && (
        <div className="mt-4 p-4 bg-dark-900 rounded border border-primary-500/30">
          <p className="text-sm text-gray-400 mb-2">📄 Analysis:</p>
          <p className="text-white text-sm">{analysis as string}</p>
        </div>
      )}
    </div>
  );
}

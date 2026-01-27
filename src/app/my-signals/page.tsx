"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import Link from "next/link";

export default function MySignals() {
  const { address, isConnected } = useAccount();

  const { data: stats } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "traderStats",
    args: address ? [address] : undefined,
  });

  const { data: nextSignalId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "nextSignalId",
  });

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">
            Wallet Required
          </h2>
          <p className="text-gray-400 mb-6">
            Connect your wallet to view your signals
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

  const totalSignals = stats ? Number(stats[0]) : 0;
  const correctSignals = stats ? Number(stats[1]) : 0;
  const accuracy =
    totalSignals > 0 ? ((correctSignals / totalSignals) * 100).toFixed(1) : "0";
  const totalCount = nextSignalId ? Number(nextSignalId) : 0;

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navbar */}
      <nav className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold text-white">
            Trade Signal
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/purchased"
              className="text-sm text-gray-400 hover:text-white"
            >
              Purchased
            </Link>
            <div className="text-sm text-gray-400">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">My Signals</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-1">Total Created</p>
            <p className="text-3xl font-bold text-white">{totalSignals}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-1">Correct</p>
            <p className="text-3xl font-bold text-green-500">
              {correctSignals}
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-1">Accuracy</p>
            <p className="text-3xl font-bold text-white">{accuracy}%</p>
          </div>
        </div>

        {/* Created Signals */}
        {totalSignals === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">
              You haven't created any signals yet
            </p>
            <Link
              href="/create"
              className="inline-block px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
            >
              Create Signal
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {Array.from({ length: totalCount }, (_, i) => (
              <MySignalCard key={i} signalId={i} myAddress={address} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MySignalCard({
  signalId,
  myAddress,
}: {
  signalId: number;
  myAddress: `0x${string}`;
}) {
  const { writeContract, isPending } = useWriteContract();

  const { data: signal } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "signals",
    args: [BigInt(signalId)],
  });

  if (!signal || String(signal[0]).toLowerCase() !== myAddress.toLowerCase())
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
      ? "bg-green-600"
      : status === 1
        ? "bg-blue-600"
        : "bg-gray-600";

  const isPastDeadline = Date.now() > Number(deadline) * 1000;
  const canResolve = status === 0 && isPastDeadline;

  const handleResolve = async () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "resolveSignal",
        args: [BigInt(signalId)],
      });
    } catch (error) {
      console.error("Error resolving signal:", error);
      alert("Error resolving signal");
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{asset}</h3>
          <p className="text-sm text-gray-500">#{signalId}</p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-semibold text-white ${statusColor}`}
        >
          {statusText}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Direction</span>
          <span
            className={
              direction === 0
                ? "text-green-500 font-semibold"
                : "text-red-500 font-semibold"
            }
          >
            {direction === 0 ? "Bullish" : "Bearish"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Target</span>
          <span className="text-white">${targetPrice.toString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Fee</span>
          <span className="text-white">{formatEther(fee)} ETH</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Deadline</span>
          <span
            className={`text-white text-xs ${isPastDeadline ? "text-yellow-500" : ""}`}
          >
            {new Date(Number(deadline) * 1000).toLocaleDateString()}
          </span>
        </div>

        {/* Result - só se resolvido */}
        {status === 1 && (
          <div className="flex justify-between pt-2 border-t border-gray-800">
            <span className="text-gray-400">Result</span>
            <span
              className={
                isCorrect
                  ? "text-green-500 font-semibold"
                  : "text-red-500 font-semibold"
              }
            >
              {isCorrect ? "✅ Correct" : "❌ Incorrect"}
            </span>
          </div>
        )}
      </div>

      {/* Resolve Button */}
      {canResolve && (
        <button
          onClick={handleResolve}
          disabled={isPending}
          className="w-full mt-4 bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50 text-sm"
        >
          {isPending ? "Resolving..." : "Resolve Signal"}
        </button>
      )}
    </div>
  );
}

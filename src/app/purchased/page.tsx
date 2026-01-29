"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import Link from "next/link";

export default function PurchasedSignals() {
  const { address, isConnected } = useAccount();

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
            Connect your wallet to view purchased signals
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
              href="/my-signals"
              className="text-sm text-gray-400 hover:text-white"
            >
              My Signals
            </Link>
            <div className="text-sm text-gray-400">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">
          Purchased Signals
        </h1>

        {/* Stats Cards */}
        <PurchasedStats myAddress={address} totalCount={totalCount} />

        {/* Signals Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: totalCount }, (_, i) => (
            <PurchasedSignalCard key={i} signalId={i} myAddress={address} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente de Stats
function PurchasedStats({
  myAddress,
  totalCount,
}: {
  myAddress: `0x${string}`;
  totalCount: number;
}) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-12">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <p className="text-sm text-gray-400 mb-1">Total Purchased</p>
        <p className="text-3xl font-bold text-white">
          <PurchasedCount
            myAddress={myAddress}
            totalCount={totalCount}
            type="total"
          />
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <p className="text-sm text-gray-400 mb-1">Bullish Signals</p>
        <p className="text-3xl font-bold text-green-500">
          <PurchasedCount
            myAddress={myAddress}
            totalCount={totalCount}
            type="bullish"
          />
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <p className="text-sm text-gray-400 mb-1">Bearish Signals</p>
        <p className="text-3xl font-bold text-red-500">
          <PurchasedCount
            myAddress={myAddress}
            totalCount={totalCount}
            type="bearish"
          />
        </p>
      </div>
    </div>
  );
}

// Helper para contar
function PurchasedCount({
  myAddress,
  totalCount,
  type,
}: {
  myAddress: `0x${string}`;
  totalCount: number;
  type: "total" | "bullish" | "bearish";
}) {
  let count = 0;

  // Renderiza todos os hooks
  const results = Array.from({ length: totalCount }, (_, i) => {
    const { data: hasAccess } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "signalAccess",
      args: [BigInt(i), myAddress],
    });

    const { data: signal } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "signals",
      args: [BigInt(i)],
    });

    return { hasAccess, signal };
  });

  // Conta os resultados
  results.forEach(({ hasAccess, signal }) => {
    if (hasAccess && signal) {
      if (type === "total") {
        count++;
      } else if (type === "bullish" && signal[1] === 0) {
        count++;
      } else if (type === "bearish" && signal[1] === 1) {
        count++;
      }
    }
  });

  return <>{count}</>;
}

function PurchasedSignalCard({
  signalId,
  myAddress,
}: {
  signalId: number;
  myAddress: `0x${string}`;
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

  const { data: analysisFromFunction } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getSignalAnalysis",
    args: [BigInt(signalId)],
    query: {
      enabled: Boolean(hasAccess),
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
    analysisFromStruct,
  ] = signal;
  const analysis =
    (analysisFromFunction as string) || (analysisFromStruct as string) || "";

  const statusText = ["Active", "Resolved", "Expired", "Cancelled"][
    status as number
  ];
  const statusColor =
    status === 0
      ? "bg-green-600"
      : status === 1
        ? "bg-blue-600"
        : status === 3
          ? "bg-gray-600"
          : "bg-yellow-600";

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{asset}</h3>
          <p className="text-sm text-gray-500">#{signalId}</p>
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`px-2 py-1 rounded text-xs font-semibold text-white ${statusColor}`}
          >
            {statusText}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 text-sm mb-4">
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
          <span className="text-gray-400">Deadline</span>
          <span className="text-white text-xs">
            {new Date(Number(deadline) * 1000).toLocaleDateString()}
          </span>
        </div>

        {/* Result */}
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

      {/* Analysis */}
      {analysis && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 mb-2 font-semibold">ANALYSIS</p>
          <p className="text-white text-sm leading-relaxed">{analysis}</p>
        </div>
      )}

      {/* Trader Info */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Trader</span>
          <span className="text-gray-400 font-mono">
            {String(trader).slice(0, 6)}...{String(trader).slice(-4)}
          </span>
        </div>
      </div>
    </div>
  );
}

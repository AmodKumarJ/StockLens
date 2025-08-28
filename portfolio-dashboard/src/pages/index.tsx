"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  PieChart,
  Wallet,
  Activity,
  Briefcase,
} from "lucide-react";
import PortfolioTable from "@/components/PortfolioTable";
import SectorPieChart from "@/components/SectorPieChart";
import SectorBarChart from "@/components/SectorBarChart";

// Define the types for better type safety
interface Stock {
  name: string;
  purchasePrice: number;
  qty: number;
  investment: number;
  portfolioPercentage: number;
  cmp: number;
  presentValue: number;
  gainLoss: number;
  peRatio: number | null;
  earnings: number | null;
  sector: string;
  exchange: string | number | null;
}

interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  weightPercentage: number;
}

interface PortfolioData {
  portfolio: Stock[];
  sectors: SectorSummary[];
}

export default function Home() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial portfolio load (Excel + base data)
  useEffect(() => {
    fetch("http://localhost:3001/api/portfolio")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((portfolioData: PortfolioData) => {
        console.log("Fetched portfolio:", portfolioData);
        setData(portfolioData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching portfolio:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

 
  useEffect(() => {
    if (!data?.portfolio) return;

    const interval = setInterval(() => {
      data.portfolio.forEach(async (stock) => {
        try {
          const res = await fetch(
            `http://localhost:3001/api/stocks/${stock.exchange || stock.name}`
          );
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const liveData = await res.json();

          setData((prev) =>
            prev
              ? {
                  ...prev,
                  portfolio: prev.portfolio.map((s) =>
                    s.name === stock.name
                      ? {
                          ...s,
                          cmp: liveData.cmp ?? s.cmp,
                          peRatio: liveData.peRatio ?? s.peRatio,
                          earnings: liveData.earnings ?? s.earnings,
                          presentValue: (liveData.cmp ?? s.cmp) * s.qty,
                          gainLoss:
                            (liveData.cmp ?? s.cmp) * s.qty - s.investment,
                        }
                      : s
                  ),
                }
              : prev
          );
        } catch (err) {
          console.error(`Error refreshing stock ${stock.name}:`, err);
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [data?.portfolio]);

  if (loading) {
    return (
      <main className="p-6">
        <div className="flex items-center space-x-4 mb-10">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Portfolio
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Track your investment performance
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          {/* Spinning Circle */}
          <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>

          {/* Loading Text */}
          <p className="text-gray-600 text-lg">Loading portfolio data...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="flex items-center space-x-4 mb-10">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Portfolio
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Track your investment performance
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8 text-red-600">
          Error: {error}
        </div>
      </main>
    );
  }

  if (!data || !data.portfolio) {
    return (
      <main className="p-6">
        <div className="flex items-center space-x-4 mb-10">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Portfolio
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Track your investment performance
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8 text-gray-600">
          No portfolio data available
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 ">
      <div className="flex items-center space-x-4 mb-10">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            My Portfolio
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Track your investment performance
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.sectors.map((sector) => (
          <div
            key={sector.sector}
            className={`relative overflow-hidden p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
              sector.totalGainLoss >= 0
                ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border border-emerald-200"
                : "bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 border border-red-200"
            }`}
          >
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-current animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-current animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2.5 rounded-xl shadow-sm ${
                      sector.totalGainLoss >= 0 ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <Activity
                      className={`w-5 h-5 ${
                        sector.totalGainLoss >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {sector.sector}
                  </h3>
                </div>

                <div
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                    sector.totalGainLoss >= 0
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {sector.totalGainLoss >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {(
                    (sector.totalGainLoss / sector.totalInvestment) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Wallet className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      Investment
                    </span>
                  </div>
                  <span className="font-semibold text-blue-700">
                    ₹{sector.totalInvestment.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <Target className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      Current Value
                    </span>
                  </div>
                  <span className="font-semibold text-purple-700">
                    ₹{sector.totalPresentValue.toLocaleString()}
                  </span>
                </div>

                <div
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    sector.totalGainLoss >= 0
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 shadow-green-100/50 shadow-lg"
                      : "bg-gradient-to-r from-red-100 to-rose-100 border-red-300 shadow-red-100/50 shadow-lg"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          sector.totalGainLoss >= 0
                            ? "bg-green-200"
                            : "bg-red-200"
                        }`}
                      >
                        <DollarSign
                          className={`w-4 h-4 ${
                            sector.totalGainLoss >= 0
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        P&L
                      </span>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold text-xl ${
                          sector.totalGainLoss >= 0
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {sector.totalGainLoss >= 0 ? "+" : ""}₹
                        {sector.totalGainLoss.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-indigo-100 rounded-lg">
                        <PieChart className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        Portfolio Weight
                      </span>
                    </div>
                    <span className="text-sm font-bold text-indigo-700">
                      {(sector.weightPercentage * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm relative overflow-hidden"
                        style={{ width: `${sector.weightPercentage * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PortfolioTable stocks={data.portfolio} />
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 md:mt-0">
        <SectorPieChart sectors={data.sectors} />
        <SectorBarChart sectors={data.sectors} />
      </div>
    </main>
  );
}

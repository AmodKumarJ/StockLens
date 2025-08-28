"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  
} from "recharts";
import { useState } from "react";
import { ChartPie } from 'lucide-react';

interface SectorSummary {
  sector: string;
  weightPercentage: number;
}

interface SectorPieChartProps {
  sectors: SectorSummary[];
}

const COLORS = [
  "#6366f1", 
  "#06b6d4", 
  "#10b981", 
  "#f59e0b", 
  "#ef4444", 
  "#8b5cf6", 
  "#ec4899", 
  "#84cc16", 
];


export default function SectorPieChart({ sectors }: SectorPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-gray-700 backdrop-blur-sm">
          <p className="font-medium text-sm">{data.name}</p>
          <p className="text-cyan-400 font-bold">
            {(data.value * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-gray-700">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderCustomizedLabel = (entry: any) => {
    const percentage = (entry.weightPercentage * 100).toFixed(1);
    // Only show labels for sectors with more than 5% allocation to avoid clutter
    if (entry.weightPercentage >= 0.05) {
      return `${percentage}%`;
    }
    return "";
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <ChartPie className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Portfolio Allocation</h3>
              <p className="text-blue-100 text-sm">How your portfolio is diversified</p>
            </div>
          </div>
        </div>
      </div>
      {/* Chart Container */}
      <div className="md:p-4">
        <div className="relative bg-white rounded-xl shadow-inner border border-gray-100 ">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={sectors}
              dataKey="weightPercentage"
              nameKey="sector"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={40}
              paddingAngle={2}
              label={renderCustomizedLabel}
              labelLine={false}
              animationBegin={0}
              animationDuration={800}
            >
              {sectors.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth={activeIndex === index ? 3 : 1}
                  style={{
                    filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div> 
      </div>   
    </div>
  );
}
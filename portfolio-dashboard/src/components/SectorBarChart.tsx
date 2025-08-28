"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, BarChart3, Target } from "lucide-react";

interface SectorSummary {
  sector: string;
  totalGainLoss: number;
}

interface SectorBarChartProps {
  sectors: SectorSummary[];
}


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const isPositive = value >= 0;
    
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <div className={`p-1.5 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </div>
          <span className="font-semibold text-gray-800">{label}</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Gain/Loss:</span>
            <span className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}₹{value.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};


const GradientBar = (props: any) => {
  const { payload } = props;
  const isPositive = payload?.totalGainLoss >= 0;
  
  return (
    <Bar
      {...props}
      fill={isPositive ? "url(#positiveGradient)" : "url(#negativeGradient)"}
      radius={[4, 4, 0, 0]}
    />
  );
};

export default function SectorBarChart({ sectors }: SectorBarChartProps) {
  
  const totalGainLoss = sectors.reduce((sum, sector) => sum + sector.totalGainLoss, 0);
  
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Sector Performance</h3>
              <p className="text-blue-100 text-sm">Gain/Loss analysis across sectors</p>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="text-right">
            <div className="text-2xl font-bold">
              {totalGainLoss >= 0 ? '+' : ''}₹{totalGainLoss.toLocaleString()}
            </div>
            
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6">
        
        

        {/* Chart Container */}
        <div className="bg-white rounded-xl p-4 shadow-inner border border-gray-100">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart 
              data={sectors} 
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <defs>
                {/* Gradient definitions */}
                <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                opacity={0.7}
              />
              
              <XAxis 
                dataKey="sector" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickLine={{ stroke: '#9CA3AF' }}
                axisLine={{ stroke: '#D1D5DB' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickLine={{ stroke: '#9CA3AF' }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Bar 
                dataKey="totalGainLoss" 
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              >
                {sectors.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.totalGainLoss >= 0 ? "url(#positiveGradient)" : "url(#negativeGradient)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-b from-green-500 to-green-600"></div>
            <span className="text-gray-600">Profitable Sectors</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-b from-red-500 to-red-600"></div>
            <span className="text-gray-600">Loss Making Sectors</span>
          </div>
        </div>
      </div>
    </div>
  );
}
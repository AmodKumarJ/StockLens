"use client";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useState } from "react";
import { 
  ChevronUp, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown, 
  ArrowLeft, 
  ArrowRight,
  Building,
  DollarSign,
  Target,
  PieChart,
  TrendingUp as Growth,
  BarChart3
} from "lucide-react";

interface Stock {
  name: string;
  qty: number;
  purchasePrice: number;
  cmp: number;
  investment: number;
  presentValue: number;
  gainLoss: number;
  portfolioPercentage: number;
  sector: string;
  peRatio: number | null;
  earnings: number | null;
}

interface PortfolioTableProps {
  stocks: Stock[];
}

export default function PortfolioTable({ stocks }: PortfolioTableProps) {
  const [sorting, setSorting] = useState([]);

  const columnHelper = createColumnHelper<Stock>();

  const columns = [
    columnHelper.accessor("name", { 
      header: () => (
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-blue-600" />
          <span>Stock Name</span>
        </div>
      ),
      cell: (info) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {info.getValue().charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-800">{info.getValue()}</div>
            <div className="text-xs text-gray-500">{info.row.original.sector}</div>
          </div>
        </div>
      )
    }),
    columnHelper.accessor("qty", { 
      header: () => (
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-green-600" />
          <span>Quantity</span>
        </div>
      ),
      cell: (info) => (
        <div className="text-center">
          <span className="px-2 py-1 bg-gray-100 rounded-lg font-medium">
            {info.getValue().toLocaleString()}
          </span>
        </div>
      )
    }),
    columnHelper.accessor("purchasePrice", { 
      header: () => (
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-orange-600" />
          <span>Buy Price</span>
        </div>
      ),
      cell: (info) => (
        <span className="font-medium text-orange-700">
          ₹{info.getValue().toLocaleString()}
        </span>
      )
    }),
    columnHelper.accessor("cmp", { 
      header: () => (
        <div className="flex items-center space-x-2">
          <Growth className="w-4 h-4 text-purple-600" />
          <span>CMP</span>
        </div>
      ),
      cell: (info) => {
        const cmp = info.getValue();
        const purchasePrice = info.row.original.purchasePrice;
        const change = ((cmp - purchasePrice) / purchasePrice) * 100;
        
        return (
          <div className="text-center">
            <div className="font-semibold text-purple-700">₹{cmp.toLocaleString()}</div>
            <div className={`text-xs flex items-center justify-center space-x-1 ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{change.toFixed(1)}%</span>
            </div>
          </div>
        );
      }
    }),
    columnHelper.accessor("investment", { 
      header: () => (
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-blue-600" />
          <span>Investment</span>
        </div>
      ),
      cell: (info) => (
        <span className="font-semibold text-blue-700">
          ₹{info.getValue().toLocaleString()}
        </span>
      )
    }),
    columnHelper.accessor("presentValue", { 
      header: () => (
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-indigo-600" />
          <span>Current Value</span>
        </div>
      ),
      cell: (info) => (
        <span className="font-semibold text-indigo-700">
          ₹{info.getValue().toLocaleString()}
        </span>
      )
    }),
    columnHelper.accessor("gainLoss", {
      header: () => (
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>P&L</span>
        </div>
      ),
      cell: (info) => {
        const value = info.getValue();
        const percentage = ((value / info.row.original.investment) * 100);
        
        return (
          <div className="text-center">
            <div className={`font-bold text-lg ${value >= 0 ? "text-green-600" : "text-red-600"}`}>
              {value >= 0 ? '+' : ''}₹{value.toLocaleString()}
            </div>
            <div className={`text-xs flex items-center justify-center space-x-1 ${
              value >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {value >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{percentage.toFixed(1)}%</span>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("portfolioPercentage", {
      header: () => (
        <div className="flex items-center space-x-2">
          <PieChart className="w-4 h-4 text-violet-600" />
          <span>Weight</span>
        </div>
      ),
      cell: (info) => {
        const percentage = info.getValue() * 100;
        return (
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(percentage * 2, 100)}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-semibold text-violet-700 min-w-[3rem]">
              {percentage.toFixed(1)}%
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("peRatio", {
      header: "P/E Ratio",
      cell: (info) => (
        <span className="px-2 py-1 bg-gray-50 rounded text-sm">
          {info.getValue() ?? "—"}
        </span>
      ),
    }),
    columnHelper.accessor("earnings", {
      header: "Earnings",
      cell: (info) => (
        <span className="px-2 py-1 bg-gray-50 rounded text-sm">
          {info.getValue() ?? "—"}
        </span>
      ),
    }),
  ];

  const table = useReactTable({
    data: stocks,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen md:p-6">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Portfolio Holdings</h1>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none hover:bg-gray-100 transition-colors duration-200"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center space-x-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <div className="flex flex-col">
                            {header.column.getIsSorted() === "asc" && (
                              <ChevronUp className="w-4 h-4 text-blue-600" />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <ChevronDown className="w-4 h-4 text-blue-600" />
                            )}
                            {!header.column.getIsSorted() && (
                              <div className="w-4 h-4 opacity-30">
                                <ChevronUp className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-100">
                {table.getRowModel().rows.map((row, index) => (
                  <tr 
                    key={row.id} 
                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="flex items-center flex-col md:flex-row justify-between">
              <div className="text-sm text-gray-600">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  stocks.length
                )}{" "}
                of {stocks.length} stocks
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Page</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                    {table.getState().pagination.pageIndex + 1}
                  </span>
                  <span className="text-sm text-gray-600">of {table.getPageCount()}</span>
                </div>
                
                <button
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
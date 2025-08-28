
export interface StockRow {
  Particulars: string;
  "Purchase Price": number;
  Qty: number;
  Investment?: number;
  "Portfolio (%)"?: number;
  "NSE/BSE"?: string;
  CMP?: number;
  "P/E"?: number;
  "Latest Earnings"?: number;
  Sector?: string;
}

export interface Stock {
  name: string;
  purchasePrice: number;
  qty: number;
  investment: number;
  portfolioPercentage: number;
  exchange: string | null;
  cmp: number | null;
  presentValue: number;
  gainLoss: number;
  peRatio: number | null;
  earnings: number | null;
  sector: string;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  weightPercentage: number;
}

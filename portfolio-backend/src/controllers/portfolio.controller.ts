import { Request, Response } from "express";
import path from "path";
import { loadPortfolio } from "../services/portfolio.service";
import { getYahooStock } from "../services/yahoo.service";
import { getGoogleFinanceData } from "../services/google.service";
import { Stock, SectorSummary } from "../models/stock.model";

const FILE_PATH = path.join(__dirname, "../../portfolio.xlsx");


// MAPPING FOR STOCK SYMBOLS

const STOCK_SYMBOL_MAPPING: { [key: string]: string } = {
  // Financial Sector changes added here
  "HDFC Bank": "HDFCBANK",
  "Bajaj Finance": "BAJFINANCE",
  "ICICI Bank": "ICICIBANK",
  "Bajaj Housing": "BAJAJHFL",
  "Savani Financials": "SAVANIFINANCIA",
  
  // Tech Sector
  "Affle India": "AFFLE",
  "LTI Mindtree": "LTIM",
  "KPIT Tech": "KPITTECH",
  "Tata Tech": "TATATECH",
  "BLS E-Services": "BLSE",
  "Tanla": "TANLA",
  "Tanla ": "TANLA", // Handle the space
  
  // Consumer Sector
  "Dmart": "DMART",
  "Tata Consumer": "TATACONSUM",
  "Pidilite": "PIDILITIND",
  
  // Power Sector
  "Tata Power": "TATAPOWER",
  "KPI Green": "KPIGREEN",
  "Suzlon": "SUZLON",
  "Gensol": "GENSOLENG",
  
  // Infrastructure/Pipes
  "Hariom Pipes": "HARIOMPIPE",
  "Astral": "ASTRAL",
  "Polycab": "POLYCAB",
  
  // Others
  "Clean Science": "CLEANSCIENCE",
  "Deepak Nitrite": "DEEPAKNTR",
  "Fine Organic": "FINEORG",
  "Gravita": "GRAVITA",
  "SBI Life": "SBILIFE",
  "Infy": "INFY",
  "Happeist Mind": "HAPPSTMNDS",
  "Easemytrip": "EASEMYTRIP",
};

// ADD THIS HELPER FUNCTION
function getStockSymbol(companyName: string): string {
  const cleanName = companyName.trim();
  
  if (STOCK_SYMBOL_MAPPING[cleanName]) {
    console.log(`Mapped: ${cleanName} -> ${STOCK_SYMBOL_MAPPING[cleanName]}`);
    return STOCK_SYMBOL_MAPPING[cleanName];
  }
  
  console.warn(`No symbol mapping found for: ${cleanName}, using original name`);
  return cleanName;
}

export const getPortfolio = async (req: Request, res: Response) => {
  try {
   
    const portfolio: Stock[] = loadPortfolio(FILE_PATH);

    
    const validStocks = portfolio.filter(stock => {
      const sectorHeaders = ['Financial Sector', 'Tech Sector', 'Consumer', 'Power', 'Others', 'Pipe Sector'];
      return stock.name && 
             stock.name.trim() !== '' && 
             !sectorHeaders.includes(stock.name.trim()) &&
             stock.qty > 0;
    });

    console.log(`Processing ${validStocks.length} valid stocks out of ${portfolio.length} total entries`);

   
    const enrichedPortfolio = [];
    
    for (const stock of validStocks) {
      try {
        console.log(`Processing: ${stock.name}`);
        
        
        const googleSymbol = getStockSymbol(stock.name);
        
       
        const [yahoo, google] = await Promise.all([
          getYahooStock(stock.exchange || `${googleSymbol}.NS`).catch(err => {
            console.log(`Yahoo failed for ${stock.name}:`, err.message);
            return { cmp: null, exchange: null };
          }),
          getGoogleFinanceData(googleSymbol).catch(err => {
            console.log(`Google failed for ${googleSymbol}:`, err.message);
            return { peRatio: null, earnings: null, currentPrice: null };
          }),
        ]);

        
        const cmp = yahoo.cmp ?? google.currentPrice ?? stock.cmp ?? stock.purchasePrice;

        const presentValue = cmp * stock.qty;
        const gainLoss = presentValue - stock.investment;

        const enrichedStock = {
          ...stock,
          cmp,
          presentValue,
          gainLoss,
          peRatio: google.peRatio,
          earnings: google.earnings,
          exchange: yahoo.exchange || googleSymbol,
        } as Stock;

        enrichedPortfolio.push(enrichedStock);
        
        console.log(`✓ ${stock.name}: P/E=${google.peRatio}, EPS=${google.earnings}, CMP=${cmp}`);
        
       
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error processing ${stock.name}:`, error);
        
        
        const fallbackStock = {
          ...stock,
          cmp: stock.cmp ?? stock.purchasePrice,
          presentValue: (stock.cmp ?? stock.purchasePrice) * stock.qty,
          gainLoss: ((stock.cmp ?? stock.purchasePrice) * stock.qty) - stock.investment,
          peRatio: null,
          earnings: null,
        } as Stock;
        
        enrichedPortfolio.push(fallbackStock);
      }
    }

    console.log(`Successfully processed ${enrichedPortfolio.length} stocks`);

    
    const sectorMap: Record<string, SectorSummary> = {};

    const totalInvestment = enrichedPortfolio.reduce(
      (sum, s) => sum + s.investment,
      0
    );

    enrichedPortfolio.forEach((stock) => {
      if (!sectorMap[stock.sector]) {
        sectorMap[stock.sector] = {
          sector: stock.sector,
          totalInvestment: 0,
          totalPresentValue: 0,
          totalGainLoss: 0,
          weightPercentage: 0,
        };
      }

      const summary = sectorMap[stock.sector];
      summary.totalInvestment += stock.investment;
      summary.totalPresentValue += stock.presentValue;
      summary.totalGainLoss += stock.gainLoss;
    });

   
    Object.values(sectorMap).forEach((summary) => {
      summary.weightPercentage =
        totalInvestment > 0 ? summary.totalInvestment / totalInvestment : 0;
    });

    
    const response = {
      portfolio: enrichedPortfolio,
      sectors: Object.values(sectorMap),
    };
    
    console.log(`Final response: ${enrichedPortfolio.length} stocks, ${Object.keys(sectorMap).length} sectors`);
    
    res.json(response);
  } catch (error) {
    console.error("Portfolio processing error:", error);
    res.status(500).json({ error: "Failed to load portfolio" });
  }
};
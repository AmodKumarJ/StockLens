import * as XLSX from "xlsx";
import { StockRow, Stock } from "../models/stock.model";

export function loadPortfolio(filePath: string): Stock[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  
  const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
  });

  
  const headerRowIndex = rawRows.findIndex((row) =>
    row.includes("Particulars")
  );
  if (headerRowIndex === -1) {
    throw new Error("Could not find header row with 'Particulars'");
  }


  const rows: StockRow[] = XLSX.utils.sheet_to_json(sheet, {
    range: headerRowIndex,
    defval: null,
  });

  // Step 4: Assign sectors based on "Sector" rows
  let currentSector = "Unknown";
  const validRows: StockRow[] = [];

  rows.forEach((row) => {
    if (row.Particulars && row.Particulars.toLowerCase().includes("sector")) {
      
      currentSector = row.Particulars.replace(/sector/i, "").trim();
    } else if (row.Particulars) {
      
      validRows.push({
        ...row,
        Sector: currentSector,
      });
    }
  });

  
  const totalInvestment = validRows.reduce(
    (sum, row) => sum + (row["Purchase Price"] || 0) * (row.Qty || 0),
    0
  );


  return validRows.map((row) => {
    const investment = (row["Purchase Price"] || 0) * (row.Qty || 0);
    const cmp = row.CMP ?? row["Purchase Price"] ?? 0;
    const presentValue = cmp * (row.Qty || 0);
    const gainLoss = presentValue - investment;
    const portfolioPercentage =
      totalInvestment > 0 ? investment / totalInvestment : 0;

    return {
      name: row.Particulars,
      purchasePrice: row["Purchase Price"] ?? 0,
      qty: row.Qty ?? 0,
      investment,
      portfolioPercentage,
      cmp,
      presentValue,
      gainLoss,
      peRatio: row["P/E"] ?? null,
      earnings: row["Latest Earnings"] ?? null,
      sector: row.Sector || "Unknown", // <-- now filled correctly
      exchange: row["NSE/BSE"] ?? null,
    } as Stock;
  });
}

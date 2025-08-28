import { Request, Response } from "express";
import { getYahooStock } from "../services/yahoo.service";
import { getGoogleFinanceData } from "../services/google.service";

export const getStockData = async (req: Request, res: Response) => {
  const { symbol } = req.params;

  if (!symbol) {
    return res.status(400).json({ error: "Stock symbol is required" });
  }

  try {
    const [yahoo, google] = await Promise.all([
      getYahooStock(symbol),       
      getGoogleFinanceData(symbol) 
    ]);

    res.json({
      ...yahoo,
      peRatio: google.peRatio,
      earnings: google.earnings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
};

import yahooFinance from "yahoo-finance2";

export async function getYahooStock(symbol: string) {
  try {
    const quote = await yahooFinance.quote(symbol);

    return {
      symbol,
      name: quote.shortName,
      exchange: quote.exchange,
      cmp: quote.regularMarketPrice,
    };
  } catch (error) {
    console.error(`Yahoo fetch failed for ${symbol}:`, error);
    return {
      symbol,
      name: null,
      exchange: null,
      cmp: null,
    };
  }
}

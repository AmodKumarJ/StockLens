// services/google.service.ts
import axios from "axios";
import * as cheerio from "cheerio";

export async function getGoogleFinanceData(symbol: string) {
  try {
    
    const cleanSymbol = symbol.replace(/\.NS|\.BO/gi, "");
    const url = `https://www.google.com/finance/quote/${cleanSymbol}:NSE`;

    console.log(`Fetching Google Finance data for: ${cleanSymbol} from ${url}`);

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    const $ = cheerio.load(data);

    let peRatio: number | null = null;
    let earnings: number | null = null;
    let currentPrice: number | null = null;
    let marketCap: string | null = null;

    
    const priceElement = $('[data-source="SPX"] .YMlKec, .YMlKec').first();
    if (priceElement.length) {
      const priceText = priceElement.text().replace(/[^\d.-]/g, '');
      currentPrice = parseFloat(priceText);
    }

    
    $('div[data-attrid], div.P6K39c, div.mfs7Fc').each((_, el) => {
      const $el = $(el);
      const parent = $el.parent();
      const prevSibling = $el.prev();
      
      let label = '';
      if (prevSibling.length) {
        label = prevSibling.text().trim().toLowerCase();
      } else if (parent.length) {
        const allText = parent.text().trim();
        label = allText.toLowerCase();
      }

      const value = $el.text().trim();

      
      if (label.includes('p/e') || label.includes('pe ratio') || label.includes('price/earnings')) {
        const peValue = parseFloat(value.replace(/[^\d.-]/g, ''));
        if (!isNaN(peValue) && peValue > 0) {
          peRatio = peValue;
        }
      }

      
      if (label.includes('market cap')) {
        marketCap = value;
      }
    });

    
    $('table tr, div[class*="financial"] div').each((_, el) => {
      const $el = $(el);
      const text = $el.text().toLowerCase();
      
      if (text.includes('earnings per share') || text.includes('eps')) {
        const valueElements = $el.find('td, div').filter((_, valEl) => {
          const valText = $(valEl).text().trim();
          return /^\d+\.?\d*$/.test(valText.replace(/,/g, ''));
        });
        
        if (valueElements.length) {
          const epsValue = parseFloat(valueElements.first().text().replace(/,/g, ''));
          if (!isNaN(epsValue) && epsValue > 0) {
            earnings = epsValue;
          }
        }
      }
    });

    
    const statsSelectors = [
      '[data-attrid*="price_earnings"] .P6K39c',
      '[data-attrid*="earnings_per_share"] .P6K39c',
      '.mfs7Fc:contains("P/E ratio") + .P6K39c',
      '.mfs7Fc:contains("Earnings per share") + .P6K39c',
    ];

    statsSelectors.forEach(selector => {
      try {
        const element = $(selector).first();
        if (element.length) {
          const value = parseFloat(element.text().replace(/[^\d.-]/g, ''));
          if (!isNaN(value) && value > 0) {
            if (selector.includes('price_earnings') || selector.includes('P/E')) {
              peRatio = peRatio || value;
            } else if (selector.includes('earnings_per_share') || selector.includes('Earnings')) {
              earnings = earnings || value;
            }
          }
        }
      } catch (e) {
        
      }
    });

    console.log(`Google Finance result for ${cleanSymbol}:`, {
      currentPrice,
      peRatio,
      earnings,
      marketCap
    });

    return {
      symbol: cleanSymbol,
      currentPrice: currentPrice && !isNaN(currentPrice) ? currentPrice : null,
      peRatio: peRatio && !isNaN(peRatio) ? peRatio : null,
      earnings: earnings && !isNaN(earnings) ? earnings : null,
      marketCap,
    };

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Google Finance fetch failed for ${symbol}:`, error.message);
    } else {
      console.error(`Google Finance fetch failed for ${symbol}:`, error);
    }
    return { 
      symbol,
      currentPrice: null,
      peRatio: null, 
      earnings: null,
      marketCap: null
    };
  }
}
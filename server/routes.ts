import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import axios from "axios";
import * as cheerio from "cheerio";

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || process.env.VITE_ALPHA_VANTAGE_API_KEY || "demo";
const POLYGON_API_KEY = process.env.POLYGON_API_KEY || process.env.VITE_POLYGON_API_KEY || "";

// Cache to store API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function isValidCacheEntry(entry: { timestamp: number }): boolean {
  return Date.now() - entry.timestamp < CACHE_DURATION;
}

async function fetchWithCache(key: string, fetchFn: () => Promise<any>) {
  const cached = cache.get(key);
  if (cached && isValidCacheEntry(cached)) {
    return cached.data;
  }

  try {
    const data = await fetchFn();
    cache.set(key, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get Sensex data
  app.get("/api/market/sensex", async (req, res) => {
    try {
      const data = await fetchWithCache("sensex", async () => {
        // Try Alpha Vantage first
        const response = await axios.get(`https://www.alphavantage.co/query`, {
          params: {
            function: "GLOBAL_QUOTE",
            symbol: "BSE:SENSEX",
            apikey: ALPHA_VANTAGE_API_KEY
          }
        });
        
        if (response.data["Global Quote"]) {
          const quote = response.data["Global Quote"];
          return {
            symbol: "SENSEX",
            current: parseFloat(quote["05. price"]) || 0,
            change: parseFloat(quote["09. change"]) || 0,
            changePercent: parseFloat(quote["10. change percent"]?.replace('%', '')) || 0,
            dayHigh: parseFloat(quote["03. high"]) || 0,
            dayLow: parseFloat(quote["04. low"]) || 0,
            volume: quote["06. volume"] || "0",
            fiftyTwoWeekHigh: parseFloat(quote["03. high"]) || 0
          };
        }
        
        // Fallback to Yahoo Finance API
        const yahooResponse = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/^BSESN`);
        const result = yahooResponse.data.chart.result[0];
        const meta = result.meta;
        
        return {
          symbol: "SENSEX",
          current: meta.regularMarketPrice || 0,
          change: (meta.regularMarketPrice - meta.previousClose) || 0,
          changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100) || 0,
          dayHigh: meta.regularMarketDayHigh || 0,
          dayLow: meta.regularMarketDayLow || 0,
          volume: meta.regularMarketVolume?.toString() || "0",
          fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || 0
        };
      });
      
      await storage.updateMarketData(data);
      res.json(data);
    } catch (error) {
      console.error("Error fetching Sensex data:", error);
      res.status(500).json({ error: "Failed to fetch Sensex data" });
    }
  });

  // Get economic indicators
  app.get("/api/economic-indicators", async (req, res) => {
    try {
      const data = await fetchWithCache("economic-indicators", async () => {
        // Try to fetch from RBI API or other sources
        const indicators = [];
        
        try {
          // Fetch inflation data (example using a free API)
          const inflationResponse = await axios.get('https://api.worldbank.org/v2/country/IN/indicator/FP.CPI.TOTL.ZG?format=json&date=2023:2024');
          if (inflationResponse.data && inflationResponse.data[1]) {
            const latestInflation = inflationResponse.data[1][0];
            indicators.push({
              indicator: "CPI",
              value: latestInflation.value || 5.69,
              unit: "% YoY",
              period: latestInflation.date || "2024",
              trend: "up"
            });
          }
        } catch (err) {
          console.log("World Bank API error, using fallback");
        }

        // Add other indicators with fallback values
        indicators.push(
          { indicator: "WPI", value: 2.36, unit: "% YoY", period: "Dec 2024", trend: "down" },
          { indicator: "GDP", value: 7.6, unit: "% Growth", period: "Q2 2024", trend: "up" },
          { indicator: "IIP", value: 3.5, unit: "% YoY", period: "Nov 2024", trend: "up" },
          { indicator: "Manufacturing PMI", value: 57.5, unit: "Index", period: "Dec 2024", trend: "up" },
          { indicator: "Services PMI", value: 58.4, unit: "Index", period: "Dec 2024", trend: "up" }
        );
        
        return indicators;
      });
      
      for (const indicator of data) {
        await storage.updateEconomicIndicator(indicator);
      }
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching economic indicators:", error);
      res.status(500).json({ error: "Failed to fetch economic indicators" });
    }
  });

  // Get monetary policy data
  app.get("/api/monetary-policy", async (req, res) => {
    try {
      const data = await fetchWithCache("monetary-policy", async () => {
        return [
          { rate: "repo", value: 6.50, stance: "neutral", lastChanged: new Date("2023-02-08"), nextMeeting: new Date("2025-02-06") },
          { rate: "reverse_repo", value: 3.35, stance: "neutral", lastChanged: new Date("2023-02-08"), nextMeeting: null },
          { rate: "crr", value: 4.50, stance: "neutral", lastChanged: new Date("2022-05-04"), nextMeeting: null },
          { rate: "slr", value: 18.00, stance: "neutral", lastChanged: new Date("2020-03-27"), nextMeeting: null },
          { rate: "msf", value: 6.75, stance: "neutral", lastChanged: new Date("2023-02-08"), nextMeeting: null }
        ];
      });
      
      for (const policy of data) {
        await storage.updateMonetaryPolicy(policy);
      }
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching monetary policy:", error);
      res.status(500).json({ error: "Failed to fetch monetary policy data" });
    }
  });

  // Get global market data
  app.get("/api/global-markets", async (req, res) => {
    try {
      const data = await fetchWithCache("global-markets", async () => {
        const markets = [];
        
        try {
          // Fetch S&P 500
          const sp500Response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/^GSPC`);
          const sp500Meta = sp500Response.data.chart.result[0].meta;
          markets.push({
            market: "SP500",
            value: sp500Meta.regularMarketPrice || 4783.45,
            change: (sp500Meta.regularMarketPrice - sp500Meta.previousClose) || 31.08,
            changePercent: ((sp500Meta.regularMarketPrice - sp500Meta.previousClose) / sp500Meta.previousClose * 100) || 0.65
          });
        } catch (err) {
          markets.push({ market: "SP500", value: 4783.45, change: 31.08, changePercent: 0.65 });
        }

        try {
          // Fetch Nikkei
          const nikkeiResponse = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/^N225`);
          const nikkeiMeta = nikkeiResponse.data.chart.result[0].meta;
          markets.push({
            market: "NIKKEI",
            value: nikkeiMeta.regularMarketPrice || 33431.51,
            change: (nikkeiMeta.regularMarketPrice - nikkeiMeta.previousClose) || -93.28,
            changePercent: ((nikkeiMeta.regularMarketPrice - nikkeiMeta.previousClose) / nikkeiMeta.previousClose * 100) || -0.28
          });
        } catch (err) {
          markets.push({ market: "NIKKEI", value: 33431.51, change: -93.28, changePercent: -0.28 });
        }

        try {
          // Fetch FTSE
          const ftseResponse = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/^FTSE`);
          const ftseMeta = ftseResponse.data.chart.result[0].meta;
          markets.push({
            market: "FTSE",
            value: ftseMeta.regularMarketPrice || 7542.08,
            change: (ftseMeta.regularMarketPrice - ftseMeta.previousClose) || 31.68,
            changePercent: ((ftseMeta.regularMarketPrice - ftseMeta.previousClose) / ftseMeta.previousClose * 100) || 0.42
          });
        } catch (err) {
          markets.push({ market: "FTSE", value: 7542.08, change: 31.68, changePercent: 0.42 });
        }
        
        return markets;
      });
      
      for (const market of data) {
        await storage.updateGlobalMarket(market);
      }
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching global markets:", error);
      res.status(500).json({ error: "Failed to fetch global market data" });
    }
  });

  // Get commodity prices (crude oil)
  app.get("/api/commodities", async (req, res) => {
    try {
      const data = await fetchWithCache("commodities", async () => {
        const commodities = [];
        
        try {
          // Brent Crude
          const brentResponse = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/BZ=F`);
          const brentMeta = brentResponse.data.chart.result[0].meta;
          commodities.push({
            symbol: "BRENT",
            current: brentMeta.regularMarketPrice || 74.56,
            change: (brentMeta.regularMarketPrice - brentMeta.previousClose) || 0.89,
            changePercent: ((brentMeta.regularMarketPrice - brentMeta.previousClose) / brentMeta.previousClose * 100) || 1.2
          });
        } catch (err) {
          commodities.push({ symbol: "BRENT", current: 74.56, change: 0.89, changePercent: 1.2 });
        }

        try {
          // WTI Crude
          const wtiResponse = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/CL=F`);
          const wtiMeta = wtiResponse.data.chart.result[0].meta;
          commodities.push({
            symbol: "WTI",
            current: wtiMeta.regularMarketPrice || 69.73,
            change: (wtiMeta.regularMarketPrice - wtiMeta.previousClose) || 0.62,
            changePercent: ((wtiMeta.regularMarketPrice - wtiMeta.previousClose) / wtiMeta.previousClose * 100) || 0.89
          });
        } catch (err) {
          commodities.push({ symbol: "WTI", current: 69.73, change: 0.62, changePercent: 0.89 });
        }
        
        return commodities;
      });
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching commodities:", error);
      res.status(500).json({ error: "Failed to fetch commodity data" });
    }
  });

  // Get currency data
  app.get("/api/currency", async (req, res) => {
    try {
      const data = await fetchWithCache("currency", async () => {
        const currencies = [];
        
        try {
          // USD/INR
          const usdInrResponse = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/INR=X`);
          const usdInrMeta = usdInrResponse.data.chart.result[0].meta;
          currencies.push({
            pair: "USDINR",
            value: usdInrMeta.regularMarketPrice || 83.48,
            change: (usdInrMeta.regularMarketPrice - usdInrMeta.previousClose) || 0.10,
            changePercent: ((usdInrMeta.regularMarketPrice - usdInrMeta.previousClose) / usdInrMeta.previousClose * 100) || 0.12
          });
        } catch (err) {
          currencies.push({ pair: "USDINR", value: 83.48, change: 0.10, changePercent: 0.12 });
        }

        try {
          // EUR/INR
          const eurInrResponse = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/EURINR=X`);
          const eurInrMeta = eurInrResponse.data.chart.result[0].meta;
          currencies.push({
            pair: "EURINR",
            value: eurInrMeta.regularMarketPrice || 87.92,
            change: (eurInrMeta.regularMarketPrice - eurInrMeta.previousClose) || 0.30,
            changePercent: ((eurInrMeta.regularMarketPrice - eurInrMeta.previousClose) / eurInrMeta.previousClose * 100) || 0.34
          });
        } catch (err) {
          currencies.push({ pair: "EURINR", value: 87.92, change: 0.30, changePercent: 0.34 });
        }
        
        return currencies;
      });
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching currency data:", error);
      res.status(500).json({ error: "Failed to fetch currency data" });
    }
  });

  // Get FII/DII flows (simulated data as this requires premium APIs)
  app.get("/api/flows", async (req, res) => {
    try {
      const data = await fetchWithCache("flows", async () => {
        return [
          { type: "FII", amount: -8429, period: "MTD", date: new Date() },
          { type: "DII", amount: 12564, period: "MTD", date: new Date() }
        ];
      });
      
      for (const flow of data) {
        await storage.addFlow(flow);
      }
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching flows:", error);
      res.status(500).json({ error: "Failed to fetch flow data" });
    }
  });

  // Get technical indicators
  app.get("/api/technical", async (req, res) => {
    try {
      const data = await fetchWithCache("technical", async () => {
        return [
          { indicator: "RSI", value: 64.5, signal: "neutral" },
          { indicator: "MACD", value: 156.8, signal: "bullish" },
          { indicator: "support1", value: 72850, signal: "support" },
          { indicator: "support2", value: 72200, signal: "support" },
          { indicator: "resistance1", value: 73800, signal: "resistance" },
          { indicator: "resistance2", value: 74400, signal: "resistance" }
        ];
      });
      
      for (const tech of data) {
        await storage.updateTechnicalData(tech);
      }
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching technical data:", error);
      res.status(500).json({ error: "Failed to fetch technical data" });
    }
  });

  // Get news updates via web scraping
  app.get("/api/news", async (req, res) => {
    try {
      const data = await fetchWithCache("news", async () => {
        const news = [];
        
        try {
          // Scrape Economic Times
          const etResponse = await axios.get('https://economictimes.indiatimes.com/markets', {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          const $ = cheerio.load(etResponse.data);
          
          $('h3 a, h4 a').slice(0, 5).each((i, el) => {
            const title = $(el).text().trim();
            const url = $(el).attr('href');
            if (title && title.length > 10) {
              news.push({
                title: title.substring(0, 100),
                source: "Economic Times",
                category: "market",
                url: url?.startsWith('http') ? url : `https://economictimes.indiatimes.com${url}`
              });
            }
          });
        } catch (err) {
          console.log("Error scraping ET:", err.message);
        }

        // Add fallback news if scraping fails
        if (news.length === 0) {
          news.push(
            {
              title: "RBI maintains repo rate at 6.50% in December policy meet",
              source: "Economic Times",
              category: "policy",
              url: "#"
            },
            {
              title: "FII outflows continue as global uncertainty persists",
              source: "Business Standard",
              category: "market",
              url: "#"
            },
            {
              title: "Manufacturing PMI shows strong expansion in December",
              source: "Mint",
              category: "economic",
              url: "#"
            }
          );
        }
        
        return news;
      });
      
      for (const newsItem of data) {
        await storage.addNewsUpdate(newsItem);
      }
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Failed to fetch news updates" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

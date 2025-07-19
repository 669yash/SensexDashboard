import { 
  MarketData, 
  EconomicIndicator, 
  MonetaryPolicy, 
  Flows, 
  GlobalData, 
  TechnicalData, 
  NewsUpdate,
  InsertMarketData,
  InsertEconomicIndicator,
  InsertMonetaryPolicy,
  InsertFlows,
  InsertGlobalData,
  InsertTechnicalData,
  InsertNewsUpdate
} from "@shared/schema";

export interface IStorage {
  // Market Data
  getMarketData(symbol: string): Promise<MarketData | undefined>;
  updateMarketData(data: InsertMarketData): Promise<MarketData>;
  
  // Economic Indicators
  getEconomicIndicators(): Promise<EconomicIndicator[]>;
  updateEconomicIndicator(data: InsertEconomicIndicator): Promise<EconomicIndicator>;
  
  // Monetary Policy
  getMonetaryPolicyRates(): Promise<MonetaryPolicy[]>;
  updateMonetaryPolicy(data: InsertMonetaryPolicy): Promise<MonetaryPolicy>;
  
  // Investment Flows
  getFlows(type: string, period: string): Promise<Flows[]>;
  addFlow(data: InsertFlows): Promise<Flows>;
  
  // Global Market Data
  getGlobalMarkets(): Promise<GlobalData[]>;
  updateGlobalMarket(data: InsertGlobalData): Promise<GlobalData>;
  
  // Technical Analysis
  getTechnicalData(): Promise<TechnicalData[]>;
  updateTechnicalData(data: InsertTechnicalData): Promise<TechnicalData>;
  
  // News Updates
  getNewsUpdates(limit?: number): Promise<NewsUpdate[]>;
  addNewsUpdate(data: InsertNewsUpdate): Promise<NewsUpdate>;
}

export class MemStorage implements IStorage {
  private marketData: Map<string, MarketData>;
  private economicIndicators: Map<string, EconomicIndicator>;
  private monetaryPolicies: Map<string, MonetaryPolicy>;
  private flows: Map<string, Flows>;
  private globalData: Map<string, GlobalData>;
  private technicalData: Map<string, TechnicalData>;
  private newsUpdates: NewsUpdate[];
  private currentId: number;

  constructor() {
    this.marketData = new Map();
    this.economicIndicators = new Map();
    this.monetaryPolicies = new Map();
    this.flows = new Map();
    this.globalData = new Map();
    this.technicalData = new Map();
    this.newsUpdates = [];
    this.currentId = 1;
  }

  async getMarketData(symbol: string): Promise<MarketData | undefined> {
    return this.marketData.get(symbol);
  }

  async updateMarketData(data: InsertMarketData): Promise<MarketData> {
    const marketData: MarketData = {
      ...data,
      id: this.currentId++,
      timestamp: new Date(),
    };
    this.marketData.set(data.symbol, marketData);
    return marketData;
  }

  async getEconomicIndicators(): Promise<EconomicIndicator[]> {
    return Array.from(this.economicIndicators.values());
  }

  async updateEconomicIndicator(data: InsertEconomicIndicator): Promise<EconomicIndicator> {
    const indicator: EconomicIndicator = {
      ...data,
      id: this.currentId++,
      lastUpdated: new Date(),
    };
    this.economicIndicators.set(data.indicator, indicator);
    return indicator;
  }

  async getMonetaryPolicyRates(): Promise<MonetaryPolicy[]> {
    return Array.from(this.monetaryPolicies.values());
  }

  async updateMonetaryPolicy(data: InsertMonetaryPolicy): Promise<MonetaryPolicy> {
    const policy: MonetaryPolicy = {
      ...data,
      id: this.currentId++,
    };
    this.monetaryPolicies.set(data.rate, policy);
    return policy;
  }

  async getFlows(type: string, period: string): Promise<Flows[]> {
    return Array.from(this.flows.values()).filter(flow => 
      flow.type === type && flow.period === period
    );
  }

  async addFlow(data: InsertFlows): Promise<Flows> {
    const flow: Flows = {
      ...data,
      id: this.currentId++,
      date: new Date(),
    };
    this.flows.set(`${data.type}-${data.period}-${this.currentId}`, flow);
    return flow;
  }

  async getGlobalMarkets(): Promise<GlobalData[]> {
    return Array.from(this.globalData.values());
  }

  async updateGlobalMarket(data: InsertGlobalData): Promise<GlobalData> {
    const global: GlobalData = {
      ...data,
      id: this.currentId++,
      timestamp: new Date(),
    };
    this.globalData.set(data.market, global);
    return global;
  }

  async getTechnicalData(): Promise<TechnicalData[]> {
    return Array.from(this.technicalData.values());
  }

  async updateTechnicalData(data: InsertTechnicalData): Promise<TechnicalData> {
    const technical: TechnicalData = {
      ...data,
      id: this.currentId++,
      timestamp: new Date(),
    };
    this.technicalData.set(data.indicator, technical);
    return technical;
  }

  async getNewsUpdates(limit: number = 10): Promise<NewsUpdate[]> {
    return this.newsUpdates
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
      .slice(0, limit);
  }

  async addNewsUpdate(data: InsertNewsUpdate): Promise<NewsUpdate> {
    const news: NewsUpdate = {
      ...data,
      id: this.currentId++,
      timestamp: new Date(),
    };
    this.newsUpdates.push(news);
    return news;
  }
}

export const storage = new MemStorage();

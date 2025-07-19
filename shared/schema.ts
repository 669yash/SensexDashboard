import { pgTable, text, serial, real, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  current: real("current").notNull(),
  change: real("change").notNull(),
  changePercent: real("change_percent").notNull(),
  dayHigh: real("day_high"),
  dayLow: real("day_low"),
  volume: text("volume"),
  fiftyTwoWeekHigh: real("fifty_two_week_high"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const economicIndicators = pgTable("economic_indicators", {
  id: serial("id").primaryKey(),
  indicator: text("indicator").notNull(),
  value: real("value").notNull(),
  unit: text("unit").notNull(),
  period: text("period").notNull(),
  trend: text("trend"), // 'up', 'down', 'neutral'
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const monetaryPolicy = pgTable("monetary_policy", {
  id: serial("id").primaryKey(),
  rate: text("rate").notNull(), // repo, reverse_repo, crr, slr, etc.
  value: real("value").notNull(),
  lastChanged: timestamp("last_changed"),
  stance: text("stance"), // hawkish, dovish, neutral
  nextMeeting: timestamp("next_meeting"),
});

export const flows = pgTable("flows", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // fii, dii
  amount: real("amount").notNull(), // in crores
  period: text("period").notNull(), // daily, weekly, monthly
  date: timestamp("date").defaultNow(),
});

export const globalData = pgTable("global_data", {
  id: serial("id").primaryKey(),
  market: text("market").notNull(), // sp500, nikkei, ftse
  value: real("value").notNull(),
  change: real("change").notNull(),
  changePercent: real("change_percent").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const technicalData = pgTable("technical_data", {
  id: serial("id").primaryKey(),
  indicator: text("indicator").notNull(), // rsi, macd, support, resistance
  value: real("value").notNull(),
  signal: text("signal"), // bullish, bearish, neutral
  timestamp: timestamp("timestamp").defaultNow(),
});

export const newsUpdates = pgTable("news_updates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  source: text("source").notNull(),
  category: text("category").notNull(), // policy, market, economic
  timestamp: timestamp("timestamp").defaultNow(),
  url: text("url"),
});

// Insert schemas
export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  timestamp: true,
});

export const insertEconomicIndicatorSchema = createInsertSchema(economicIndicators).omit({
  id: true,
  lastUpdated: true,
});

export const insertMonetaryPolicySchema = createInsertSchema(monetaryPolicy).omit({
  id: true,
});

export const insertFlowsSchema = createInsertSchema(flows).omit({
  id: true,
  date: true,
});

export const insertGlobalDataSchema = createInsertSchema(globalData).omit({
  id: true,
  timestamp: true,
});

export const insertTechnicalDataSchema = createInsertSchema(technicalData).omit({
  id: true,
  timestamp: true,
});

export const insertNewsUpdateSchema = createInsertSchema(newsUpdates).omit({
  id: true,
  timestamp: true,
});

// Types
export type MarketData = typeof marketData.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type EconomicIndicator = typeof economicIndicators.$inferSelect;
export type InsertEconomicIndicator = z.infer<typeof insertEconomicIndicatorSchema>;
export type MonetaryPolicy = typeof monetaryPolicy.$inferSelect;
export type InsertMonetaryPolicy = z.infer<typeof insertMonetaryPolicySchema>;
export type Flows = typeof flows.$inferSelect;
export type InsertFlows = z.infer<typeof insertFlowsSchema>;
export type GlobalData = typeof globalData.$inferSelect;
export type InsertGlobalData = z.infer<typeof insertGlobalDataSchema>;
export type TechnicalData = typeof technicalData.$inferSelect;
export type InsertTechnicalData = z.infer<typeof insertTechnicalDataSchema>;
export type NewsUpdate = typeof newsUpdates.$inferSelect;
export type InsertNewsUpdate = z.infer<typeof insertNewsUpdateSchema>;

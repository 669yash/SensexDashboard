import { useState } from "react";
import SensexOverview from "@/components/sensex-overview";
import NavigationTabs from "@/components/navigation-tabs";
import DomesticIndicators from "@/components/domestic-indicators";
import MonetaryPolicy from "@/components/monetary-policy";
import GlobalFactors from "@/components/global-factors";
import TechnicalIndicators from "@/components/technical-indicators";
import NewsUpdates from "@/components/news-updates";
import { ThemeToggle } from "@/components/theme-toggle";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

type TabType = "domestic" | "monetary" | "corporate" | "foreign" | "global" | "technical";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("domestic");
  const { toast } = useToast();

  const handleRefreshAll = async () => {
    try {
      // Invalidate all queries to force refresh
      await queryClient.invalidateQueries();
      toast({
        title: "Data Refreshed",
        description: "All market data has been updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "domestic":
        return <DomesticIndicators />;
      case "monetary":
        return <MonetaryPolicy />;
      case "global":
        return <GlobalFactors />;
      case "technical":
        return <TechnicalIndicators />;
      default:
        return <DomesticIndicators />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <i className="fas fa-chart-line text-2xl text-primary"></i>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sensex Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                <span className="text-slate-600 dark:text-slate-300">Live Data</span>
              </div>
              <ThemeToggle />
              <Button onClick={handleRefreshAll} className="bg-primary hover:bg-blue-700">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SensexOverview />
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
        <NewsUpdates />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <p className="text-sm text-slate-600">Data sources: RBI, NSE, BSE, Alpha Vantage, Yahoo Finance</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-slate-500">Last updated: {new Date().toLocaleString()}</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-xs text-slate-600">Live</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              © 2024 Sensex Dashboard. Data provided for informational purposes only. 
              Not for investment advice. Please consult financial advisors for investment decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

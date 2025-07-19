import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function SensexOverview() {
  const { data: sensexData, isLoading, error } = useQuery({
    queryKey: ["/api/market/sensex"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white">
          <div className="animate-pulse">
            <div className="h-8 bg-blue-400 rounded w-48 mb-4"></div>
            <div className="h-12 bg-blue-400 rounded w-64 mb-2"></div>
            <div className="h-4 bg-blue-400 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">BSE Sensex</h2>
          <p className="text-red-200">Failed to load Sensex data. Please try refreshing.</p>
        </div>
      </div>
    );
  }

  const isPositive = sensexData?.change >= 0;

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-2">BSE Sensex</h2>
            <div className="flex items-baseline space-x-4">
              <span className="text-4xl font-bold">{sensexData?.current?.toLocaleString()}</span>
              <div className="flex items-center space-x-1">
                {isPositive ? (
                  <TrendingUp className="text-green-300" />
                ) : (
                  <TrendingDown className="text-red-300" />
                )}
                <span className={`text-xl ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                  {isPositive ? '+' : ''}{sensexData?.change?.toFixed(2)}
                </span>
                <span className={`${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                  ({isPositive ? '+' : ''}{sensexData?.changePercent?.toFixed(2)}%)
                </span>
              </div>
            </div>
            <p className="text-blue-200 mt-2">Last updated: {new Date().toLocaleTimeString()} IST</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-blue-200 text-sm">Day High</p>
              <p className="text-xl font-semibold">{sensexData?.dayHigh?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-200 text-sm">Day Low</p>
              <p className="text-xl font-semibold">{sensexData?.dayLow?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-200 text-sm">Volume</p>
              <p className="text-xl font-semibold">{sensexData?.volume}</p>
            </div>
            <div>
              <p className="text-blue-200 text-sm">52W High</p>
              <p className="text-xl font-semibold">{sensexData?.fiftyTwoWeekHigh?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

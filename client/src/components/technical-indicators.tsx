import { useQuery } from "@tanstack/react-query";
import { ChartBar, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TechnicalIndicators() {
  const { data: technicalData, isLoading, error } = useQuery({
    queryKey: ["/api/technical"],
    refetchInterval: 120000, // Refresh every 2 minutes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-48"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load technical data. Please try refreshing.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRSI = () => technicalData?.find((t: any) => t.indicator === "RSI");
  const getMACD = () => technicalData?.find((t: any) => t.indicator === "MACD");
  const getSupports = () => technicalData?.filter((t: any) => t.indicator.includes("support")) || [];
  const getResistances = () => technicalData?.filter((t: any) => t.indicator.includes("resistance")) || [];

  const rsi = getRSI();
  const macd = getMACD();
  const supports = getSupports();
  const resistances = getResistances();

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "bullish":
        return "bg-green-100 text-secondary";
      case "bearish":
        return "bg-red-100 text-danger";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Technical Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <ChartBar className="text-accent h-4 w-4" />
            </div>
            <span>Technical Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-slate-600">RSI (14)</span>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold">{rsi?.value}</p>
                  <span className={`text-xs px-2 py-1 rounded ${getSignalColor(rsi?.signal || 'neutral')}`}>
                    {rsi?.signal || 'Neutral'}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-slate-600">MACD</span>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-secondary">+{macd?.value}</p>
                  <span className={`text-xs px-2 py-1 rounded ${getSignalColor(macd?.signal || 'neutral')}`}>
                    {macd?.signal || 'Neutral'}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Key Levels</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-500">Support</span>
                  {supports.map((support: any, index: number) => (
                    <p key={support.id || `support-${index}`} className={`font-semibold ${index === 0 ? 'text-danger' : 'text-slate-600'}`}>
                      {support.value?.toLocaleString()}
                    </p>
                  ))}
                </div>
                <div>
                  <span className="text-xs text-slate-500">Resistance</span>
                  {resistances.map((resistance: any, index: number) => (
                    <p key={resistance.id || `resistance-${index}`} className={`font-semibold ${index === 0 ? 'text-secondary' : 'text-slate-600'}`}>
                      {resistance.value?.toLocaleString()}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volume Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Activity className="text-orange-600 h-4 w-4" />
            </div>
            <span>Volume Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Today's Volume</span>
                <span className="text-lg font-bold">2.34M</span>
              </div>
              <div className="flex items-center text-xs text-slate-600">
                <span>vs Avg: </span>
                <span className="ml-1 text-secondary font-medium">+12%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-slate-600">20-Day Avg</span>
                <p className="font-semibold">2.08M</p>
              </div>
              <div>
                <span className="text-sm text-slate-600">Volume Trend</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="font-medium text-secondary">Rising</span>
                </div>
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Market Breadth:</span>
                <div className="text-right">
                  <span className="text-sm font-medium">Advances: <span className="text-secondary">18</span></span>
                  <br />
                  <span className="text-sm font-medium">Declines: <span className="text-danger">12</span></span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

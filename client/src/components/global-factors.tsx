import { useQuery } from "@tanstack/react-query";
import { Globe, Fuel, ArrowUpDown, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GlobalFactors() {
  const { data: globalMarkets } = useQuery({
    queryKey: ["/api/global-markets"],
    refetchInterval: 60000,
  });

  const { data: commodities } = useQuery({
    queryKey: ["/api/commodities"],
    refetchInterval: 60000,
  });

  const { data: currency } = useQuery({
    queryKey: ["/api/currency"],
    refetchInterval: 30000,
  });

  const { data: flows } = useQuery({
    queryKey: ["/api/flows"],
    refetchInterval: 300000,
  });

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return {
      isPositive,
      changeText: `${isPositive ? '+' : ''}${change?.toFixed(2)}`,
      percentText: `${isPositive ? '+' : ''}${changePercent?.toFixed(2)}%`,
      colorClass: isPositive ? 'text-secondary' : 'text-danger'
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      {/* Global Markets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="text-primary h-4 w-4" />
            <span className="text-base">Global Markets</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {globalMarkets?.map((market: any) => {
              const formatted = formatChange(market.change, market.changePercent);
              return (
                <div key={market.market} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{market.market}</span>
                  <div className="text-right">
                    <p className={`font-semibold ${formatted.colorClass}`}>
                      {market.value?.toLocaleString()}
                    </p>
                    <p className={`text-xs ${formatted.colorClass}`}>
                      {formatted.percentText}
                    </p>
                  </div>
                </div>
              );
            })}
            {!globalMarkets && (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Crude Oil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Fuel className="text-orange-600 h-4 w-4" />
            <span className="text-base">Crude Oil</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {commodities?.map((commodity: any) => {
              const formatted = formatChange(commodity.change, commodity.changePercent);
              return (
                <div key={commodity.symbol} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">
                    {commodity.symbol === 'BRENT' ? 'Brent Crude' : 'WTI Crude'}
                  </span>
                  <div className="text-right">
                    <p className="font-semibold">${commodity.current?.toFixed(2)}</p>
                    <p className={`text-xs ${formatted.colorClass}`}>
                      {formatted.percentText}
                    </p>
                  </div>
                </div>
              );
            })}
            {!commodities && (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Currency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowUpDown className="text-green-600 h-4 w-4" />
            <span className="text-base">Currency</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currency?.map((curr: any) => {
              const formatted = formatChange(curr.change, curr.changePercent);
              return (
                <div key={curr.pair} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">
                    {curr.pair === 'USDINR' ? 'USD/INR' : 'EUR/INR'}
                  </span>
                  <div className="text-right">
                    <p className="font-semibold">{curr.value?.toFixed(2)}</p>
                    <p className={`text-xs ${formatted.colorClass}`}>
                      {formatted.percentText}
                    </p>
                  </div>
                </div>
              );
            })}
            {!currency && (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* FII/DII Flows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Banknote className="text-purple-600 h-4 w-4" />
            <span className="text-base">FII/DII Flows</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {flows?.map((flow: any) => {
              const isPositive = flow.amount >= 0;
              return (
                <div key={flow.type} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{flow.type} ({flow.period})</span>
                  <div className="text-right">
                    <p className={`font-semibold ${isPositive ? 'text-secondary' : 'text-danger'}`}>
                      {isPositive ? '+' : ''}₹{Math.abs(flow.amount).toLocaleString()} Cr
                    </p>
                    <p className={`text-xs ${isPositive ? 'text-secondary' : 'text-danger'}`}>
                      {isPositive ? 'Inflow' : 'Outflow'}
                    </p>
                  </div>
                </div>
              );
            })}
            {!flows && (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Minus, ChartLine, Factory, PieChart, Scale, Ship } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DomesticIndicators() {
  const { data: indicators, isLoading, error } = useQuery({
    queryKey: ["/api/economic-indicators"],
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
            <p className="text-red-600">Failed to load economic indicators. Please try refreshing.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getIndicatorsByType = (type: string) => 
    indicators?.filter((ind: any) => ind.indicator.toLowerCase().includes(type.toLowerCase())) || [];

  const renderTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="text-secondary text-xs" />;
      case "down":
        return <TrendingDown className="text-danger text-xs" />;
      default:
        return <Minus className="text-slate-400 text-xs" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Inflation Data Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <ChartLine className="text-orange-600 h-4 w-4" />
            </div>
            <span>Inflation Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getIndicatorsByType("CPI").map((indicator: any) => (
              <div key={indicator.id} className="flex justify-between items-center">
                <span className="text-sm text-slate-600">CPI (YoY)</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{indicator.value}%</span>
                  {renderTrendIcon(indicator.trend)}
                </div>
              </div>
            ))}
            {getIndicatorsByType("WPI").map((indicator: any) => (
              <div key={indicator.id} className="flex justify-between items-center">
                <span className="text-sm text-slate-600">WPI (YoY)</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{indicator.value}%</span>
                  {renderTrendIcon(indicator.trend)}
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Core CPI</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">3.2%</span>
                <Minus className="text-slate-400 text-xs" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GDP Growth Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="text-secondary h-4 w-4" />
            </div>
            <span>GDP Growth</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getIndicatorsByType("GDP").map((indicator: any) => (
              <div key={indicator.id} className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Real GDP Growth</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-secondary">{indicator.value}%</span>
                  {renderTrendIcon(indicator.trend)}
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Nominal GDP</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">9.7%</span>
                <TrendingUp className="text-secondary text-xs" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">GVA Growth</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">7.4%</span>
                <TrendingUp className="text-secondary text-xs" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industrial Production Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Factory className="text-primary h-4 w-4" />
            </div>
            <span>Industrial Production</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getIndicatorsByType("IIP").map((indicator: any) => (
              <div key={indicator.id} className="flex justify-between items-center">
                <span className="text-sm text-slate-600">IIP (YoY)</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{indicator.value}%</span>
                  {renderTrendIcon(indicator.trend)}
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Manufacturing</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">4.1%</span>
                <TrendingUp className="text-secondary text-xs" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Mining</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">0.9%</span>
                <TrendingDown className="text-danger text-xs" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PMI Data Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <PieChart className="text-accent h-4 w-4" />
            </div>
            <span>PMI Indicators</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getIndicatorsByType("Manufacturing PMI").map((indicator: any) => (
              <div key={indicator.id} className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Manufacturing PMI</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-secondary">{indicator.value}</span>
                  <span className="text-xs bg-green-100 text-secondary px-2 py-1 rounded">Expansion</span>
                </div>
              </div>
            ))}
            {getIndicatorsByType("Services PMI").map((indicator: any) => (
              <div key={indicator.id} className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Services PMI</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-secondary">{indicator.value}</span>
                  <span className="text-xs bg-green-100 text-secondary px-2 py-1 rounded">Strong</span>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Composite PMI</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-secondary">58.6</span>
                <TrendingUp className="text-secondary text-xs" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fiscal Data Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Scale className="text-danger h-4 w-4" />
            </div>
            <span>Fiscal Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Fiscal Deficit</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">5.8% GDP</span>
                <TrendingDown className="text-secondary text-xs" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Govt Spending</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">₹45.03L Cr</span>
                <TrendingUp className="text-primary text-xs" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Revenue Growth</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-secondary">11.2%</span>
                <TrendingUp className="text-secondary text-xs" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trade Balance Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="bg-teal-100 p-2 rounded-lg">
              <Ship className="text-teal-600 h-4 w-4" />
            </div>
            <span>Trade Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Trade Deficit</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-danger">$23.78B</span>
                <TrendingDown className="text-secondary text-xs" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Exports</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">$39.2B</span>
                <TrendingUp className="text-secondary text-xs" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Imports</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">$62.98B</span>
                <TrendingUp className="text-warning text-xs" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { University, DollarSign, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MonetaryPolicy() {
  const { data: policyData, isLoading, error } = useQuery({
    queryKey: ["/api/monetary-policy"],
    refetchInterval: 300000, // Refresh every 5 minutes
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
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
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
            <p className="text-red-600">Failed to load monetary policy data. Please try refreshing.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRate = (rateName: string) => 
    policyData?.find((policy: any) => policy.rate === rateName);

  const repoRate = getRate("repo");
  const reverseRepo = getRate("reverse_repo");
  const crr = getRate("crr");
  const slr = getRate("slr");
  const msf = getRate("msf");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <University className="text-primary h-4 w-4" />
              </div>
              <span>RBI Monetary Policy</span>
            </div>
            <span className="text-xs text-slate-500">
              {repoRate?.lastChanged ? new Date(repoRate.lastChanged).toLocaleDateString() : 'Dec 8, 2024'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Repo Rate</span>
                <span className="text-2xl font-bold text-primary">{repoRate?.value}%</span>
              </div>
              <div className="flex items-center text-xs text-slate-600">
                <Minus className="mr-1 h-3 w-3" />
                <span>Unchanged since Feb 2023</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-slate-600">Reverse Repo</span>
                <p className="font-semibold">{reverseRepo?.value}%</p>
              </div>
              <div>
                <span className="text-sm text-slate-600">MSF Rate</span>
                <p className="font-semibold">{msf?.value}%</p>
              </div>
              <div>
                <span className="text-sm text-slate-600">CRR</span>
                <p className="font-semibold">{crr?.value}%</p>
              </div>
              <div>
                <span className="text-sm text-slate-600">SLR</span>
                <p className="font-semibold">{slr?.value}%</p>
              </div>
            </div>
            <div className="border-t pt-3">
              <span className="text-sm text-slate-600">Policy Stance:</span>
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                {repoRate?.stance || 'Neutral'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="text-secondary h-4 w-4" />
              </div>
              <span>Banking Liquidity</span>
            </div>
            <span className="text-xs text-slate-500">Today</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">System Liquidity</span>
                <span className="text-xl font-bold text-secondary">₹1.2L Cr</span>
              </div>
              <div className="flex items-center text-xs text-slate-600">
                <span className="w-2 h-2 bg-secondary rounded-full mr-1"></span>
                <span>Surplus maintained</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-slate-600">Avg LAF</span>
                <p className="font-semibold">₹85,400 Cr</p>
              </div>
              <div>
                <span className="text-sm text-slate-600">MSF Usage</span>
                <p className="font-semibold">₹234 Cr</p>
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Next MPC Meeting:</span>
                <span className="font-medium">
                  {repoRate?.nextMeeting 
                    ? new Date(repoRate.nextMeeting).toLocaleDateString()
                    : 'Feb 6-8, 2025'
                  }
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

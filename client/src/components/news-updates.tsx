import { useQuery } from "@tanstack/react-query";
import { Newspaper, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function NewsUpdates() {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ["/api/news"],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const { toast } = useToast();

  const handleRefreshNews = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({
        title: "News Refreshed",
        description: "Latest news updates have been loaded.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh news. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "policy":
        return "border-primary";
      case "market":
        return "border-secondary";
      case "economic":
        return "border-orange-400";
      default:
        return "border-slate-300";
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const newsTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - newsTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Newspaper className="text-danger h-4 w-4" />
              </div>
              <span>Market News & Policy Updates</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-l-4 border-gray-200 pl-4 py-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Newspaper className="text-danger h-4 w-4" />
              </div>
              <span>Market News & Policy Updates</span>
            </div>
            <Button variant="outline" onClick={handleRefreshNews}>
              <RefreshCw className="mr-1 h-4 w-4" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Failed to load news updates. Please try refreshing.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Newspaper className="text-danger h-4 w-4" />
            </div>
            <span>Market News & Policy Updates</span>
          </div>
          <Button variant="outline" onClick={handleRefreshNews}>
            <RefreshCw className="mr-1 h-4 w-4" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {news?.map((newsItem: any, index: number) => (
            <div key={newsItem.id || `news-${index}`} className={`border-l-4 ${getCategoryColor(newsItem.category)} pl-4 py-2`}>
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-medium text-slate-900 hover:text-primary cursor-pointer">
                  {newsItem.url && newsItem.url !== '#' ? (
                    <a href={newsItem.url} target="_blank" rel="noopener noreferrer">
                      {newsItem.title}
                    </a>
                  ) : (
                    newsItem.title
                  )}
                </h4>
                <span className="text-xs text-slate-500 ml-2 flex-shrink-0">
                  {newsItem.timestamp ? getTimeAgo(newsItem.timestamp) : '2h ago'}
                </span>
              </div>
              <p className="text-xs text-slate-600">{newsItem.source}</p>
            </div>
          ))}
          {(!news || news.length === 0) && (
            <div className="text-center py-8">
              <p className="text-slate-500">No news updates available at the moment.</p>
              <Button variant="outline" onClick={handleRefreshNews} className="mt-4">
                <RefreshCw className="mr-1 h-4 w-4" />
                Try Again
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

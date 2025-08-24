import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  TrendingUp, 
  Users, 
  Star,
  Timer,
  Target,
  BarChart3,
  Award,
  RefreshCw
} from "lucide-react";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { formatDuration } from "@/lib/utils";
import { ConversionTracker } from "./ConversionTracker";

export function AnalyticsDashboard() {
  const { analytics, refreshAnalytics } = useAnalytics();

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getConversionColor = (rate: number) => {
    if (rate >= 70) return "text-green-600";
    if (rate >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getProductivityLevel = (quotesPerDay: number) => {
    if (quotesPerDay >= 10) return { level: "Excellent", color: "bg-green-500" };
    if (quotesPerDay >= 7) return { level: "Good", color: "bg-blue-500" };
    if (quotesPerDay >= 5) return { level: "Average", color: "bg-yellow-500" };
    return { level: "Below Target", color: "bg-red-500" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track KPIs and measure success metrics</p>
        </div>
        <Button variant="outline" onClick={refreshAnalytics}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Average Quote Generation Time */}
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Timer className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Quote Time</p>
              <p className="text-2xl font-bold text-foreground">
                {formatTime(analytics.averageQuoteTime)}
              </p>
              <Badge variant="outline" className="mt-1">
                Primary KPI
              </Badge>
            </div>
          </div>
        </Card>

        {/* Quote-to-Order Conversion Rate */}
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className={`text-2xl font-bold ${getConversionColor(analytics.overallConversionRate)}`}>
                {analytics.overallConversionRate.toFixed(1)}%
              </p>
              <Badge variant="outline" className="mt-1">
                Secondary KPI
              </Badge>
            </div>
          </div>
        </Card>

        {/* Daily Productivity */}
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quotes Today</p>
              <p className="text-2xl font-bold text-foreground">
                {analytics.totalQuotesToday}
              </p>
              <Badge variant="outline" className="mt-1">
                Secondary KPI
              </Badge>
            </div>
          </div>
        </Card>

        {/* User Satisfaction Score */}
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Satisfaction</p>
              <p className="text-2xl font-bold text-foreground">
                {analytics.averageSatisfactionScore.toFixed(1)}/5
              </p>
              <Badge variant="outline" className="mt-1">
                Secondary KPI
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quote Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quote Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Quotes Created</span>
              <span className="font-semibold">{analytics.quotes.length}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Completed Quotes</span>
              <span className="font-semibold">
                {analytics.quotes.filter(q => q.status === 'completed').length}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Abandoned Quotes</span>
              <span className="font-semibold text-red-600">
                {analytics.quotes.filter(q => q.status === 'abandoned').length}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Converted to Orders</span>
              <span className="font-semibold text-green-600">
                {analytics.quotes.filter(q => q.convertedToOrder).length}
              </span>
            </div>
          </div>
        </Card>

        {/* Conversion Tracking */}
        <ConversionTracker />
      </div>

      {/* Recent Activity */}

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Quote Activity</h3>
        <div className="space-y-3">
          {analytics.quotes
            .filter(q => q.status === 'completed')
            .slice(-5)
            .reverse()
            .map(quote => (
              <div key={quote.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      Quote completed in {formatTime(quote.duration || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {quote.lineItemsCount} items • ${quote.totalValue || 0}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {quote.convertedToOrder && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Award className="w-3 h-3 mr-1" />
                      Converted
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(quote.endTime || 0).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          
          {analytics.quotes.filter(q => q.status === 'completed').length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No completed quotes yet. Start creating quotes to see analytics!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
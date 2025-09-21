import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BarChart3,
  FileText,
  Building2
} from "lucide-react";
import { MagicQuoteChat } from "./MagicQuoteChat";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { QuickSatisfactionTrigger } from "@/components/analytics/QuickSatisfactionTrigger";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useState } from "react";

interface DashboardOverviewProps {
  onNewQuote?: () => void;
}

export function DashboardOverview({ onNewQuote }: DashboardOverviewProps) {
  const [showMagicChat, setShowMagicChat] = useState(false);
  const [activeView, setActiveView] = useState<string>("dashboard");
  const { analytics } = useAnalytics();
  const { currentDepartment, currentUser } = useDepartment();

  if (activeView === "analytics") {
    return <AnalyticsDashboard />;
  }

  // Get department-specific data
  const departmentMetrics = currentDepartment ? {
    customerCount: currentDepartment.customerCount,
    avgOrderValue: currentDepartment.avgOrderValue,
    monthlyRevenue: currentDepartment.monthlyRevenue,
    quotesToday: Math.floor(Math.random() * 15) + 3, // Simulated
  } : {
    customerCount: 0,
    avgOrderValue: 0,
    monthlyRevenue: 0,
    quotesToday: 0,
  };
  
  return (
    <div className="space-y-6">
      {/* Department Overview */}
      {currentDepartment && (
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Building2 className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">{currentDepartment.name}</h3>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {currentDepartment.code}
                </Badge>
              </div>
              <p className="text-muted-foreground">{currentDepartment.description}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Manager: <span className="font-medium">{currentDepartment.manager}</span> • 
                Staff: {currentDepartment.staff.length} members
              </p>
            </div>
            {currentUser.role === 'ceo' && (
              <Badge variant="outline" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 border-purple-200">
                CEO Access
              </Badge>
            )}
          </div>
        </Card>
      )}
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quotes Today</p>
              <p className="text-2xl font-bold text-foreground">{departmentMetrics.quotesToday}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department Customers</p>
              <p className="text-2xl font-bold text-foreground">{departmentMetrics.customerCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <p className="text-2xl font-bold text-foreground">${departmentMetrics.avgOrderValue.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold text-foreground">${(departmentMetrics.monthlyRevenue / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button className="h-20 flex flex-col space-y-2" onClick={onNewQuote}>
            <Calculator className="w-6 h-6" />
            <span>New Quote</span>
          </Button>
          <Button 
            className="h-20 flex flex-col space-y-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={() => setShowMagicChat(true)}
          >
            <Sparkles className="w-6 h-6" />
            <span>Magic Quote</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col space-y-2">
            <Users className="w-6 h-6" />
            <span>Add Customer</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col space-y-2"
            onClick={() => setActiveView("analytics")}
          >
            <BarChart3 className="w-6 h-6" />
            <span>Analytics</span>
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Quotes - {currentDepartment?.name || 'All Departments'}</h3>
          <div className="space-y-4">
            {[
              { id: "BLK-2024-001", customer: "Industrial Chemicals Corp", amount: "$45,750", status: "pending", dept: "bulk" },
              { id: "BLK-2024-002", customer: "Manufacturing Solutions Ltd", amount: "$28,900", status: "approved", dept: "bulk" },
              { id: "PL-2024-001", customer: "Beauty Brands Inc", amount: "$15,200", status: "draft", dept: "private-label" },
              { id: "RT-2024-001", customer: "Wellness Store", amount: "$2,800", status: "pending", dept: "retail" },
            ]
            .filter(quote => !currentDepartment || 
              (currentDepartment.id === 'bulk' && quote.dept === 'bulk') ||
              (currentDepartment.id === 'private-label' && quote.dept === 'private-label') ||
              (currentDepartment.id === 'retail' && quote.dept === 'retail')
            )
            .slice(0, 4)
            .map((quote) => (
              <div key={quote.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{quote.id}</p>
                  <p className="text-sm text-muted-foreground">{quote.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{quote.amount}</p>
                  <Badge 
                    variant={quote.status === "approved" ? "default" : "secondary"}
                    className={
                      quote.status === "approved" ? "bg-green-500 text-white" :
                      quote.status === "pending" ? "bg-yellow-500 text-white" :
                      "bg-gray-500 text-white"
                    }
                  >
                    {quote.status}
                  </Badge>
                </div>
              </div>
            ))}
            {currentDepartment && [
              { id: "BLK-2024-001", customer: "Industrial Chemicals Corp", amount: "$45,750", status: "pending", dept: "bulk" },
              { id: "BLK-2024-002", customer: "Manufacturing Solutions Ltd", amount: "$28,900", status: "approved", dept: "bulk" },
              { id: "PL-2024-001", customer: "Beauty Brands Inc", amount: "$15,200", status: "draft", dept: "private-label" },
              { id: "RT-2024-001", customer: "Wellness Store", amount: "$2,800", status: "pending", dept: "retail" },
            ]
            .filter(quote => 
              (currentDepartment.id === 'bulk' && quote.dept === 'bulk') ||
              (currentDepartment.id === 'private-label' && quote.dept === 'private-label') ||
              (currentDepartment.id === 'retail' && quote.dept === 'retail')
            ).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No recent quotes for {currentDepartment.name}</p>
                <p className="text-sm">Start by creating a new quote above</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Notifications</h3>
          <div className="space-y-4">
            {[
              { type: "urgent", message: "Quote Q-2024-001 expires in 2 days", time: "2 hours ago" },
              { type: "success", message: "New customer registration: Natural Wellness Co", time: "4 hours ago" },
              { type: "info", message: "Product pricing updated for Lavender Essential Oil", time: "6 hours ago" },
              { type: "warning", message: "Low stock alert: Eucalyptus Oil (50ml)", time: "1 day ago" },
            ].map((notification, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                {notification.type === "urgent" && <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />}
                {notification.type === "success" && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                {notification.type === "info" && <Clock className="w-5 h-5 text-blue-500 mt-0.5" />}
                {notification.type === "warning" && <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-sm text-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Magic Quote Chat Dialog */}
      <MagicQuoteChat 
        open={showMagicChat} 
        onOpenChange={setShowMagicChat} 
      />
      
      {/* Quick Satisfaction Survey Trigger */}
      <QuickSatisfactionTrigger />
    </div>
  );
}